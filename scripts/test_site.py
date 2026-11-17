"""Check the actual static artifact, including deep routes and HTML-only paths."""
from html.parser import HTMLParser
import json
from pathlib import Path
import unittest
from urllib.parse import urljoin, urlsplit, unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
SITE = 'https://smartdetector.fwth.ai'
PLAY = 'https://play.google.com/store/apps/details?id=ai.fwth.smartdetector'
CORES = ['', 'app/', 'research/', 'institutions/', 'journal/', 'about/', 'contact/']
SLUGS = ['why-we-start-with-a-free-app', 'what-the-app-can-observe', 'from-app-to-dedicated-hardware']
ROUTES = ['/' + locale + route for locale in ['', 'en/']
          for route in CORES + ['journal/' + slug + '/' for slug in SLUGS]]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.tags = []
        self.text = path.read_text(encoding='utf-8')
        self.feed(self.text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def find(self, tag, **attrs):
        return [a for t, a in self.tags if t == tag and all(a.get(k) == v for k, v in attrs.items())]


def path_for(route):
    return DIST / route.strip('/') / 'index.html'


class StaticSiteTest(unittest.TestCase):
    def test_all_twenty_localized_routes_are_real_pages(self):
        missing = [route for route in ROUTES if not path_for(route).is_file()]
        self.assertEqual(missing, [], 'Missing real page routes')

    def test_search_metadata_and_reciprocal_languages(self):
        titles = set()
        for route in ROUTES:
            with self.subTest(route=route):
                self.assertTrue(path_for(route).is_file(), route)
                page = Page(path_for(route))
                lang = 'en' if route.startswith('/en/') else 'ko'
                self.assertEqual(page.find('html')[0]['lang'], lang)
                self.assertEqual(len(page.find('h1')), 1)
                self.assertEqual(page.find('link', rel='canonical')[0]['href'], SITE + route)
                self.assertTrue(page.find('meta', name='description')[0]['content'])
                self.assertEqual(page.find('meta', name='google-site-verification')[0]['content'],
                                 'ABUjBZu12KW5HPL2hmBqH1joQ2i3LJen_rjr-b9VvVk')
                self.assertEqual(page.find('meta', property='og:url')[0]['content'], SITE + route)
                self.assertTrue(page.find('meta', property='og:image')[0]['content'].startswith(SITE + '/assets/'))
                base = route[3:] if lang == 'en' else route
                alts = {a['hreflang']: a['href'] for a in page.find('link', rel='alternate') if 'hreflang' in a}
                self.assertEqual(alts, {'ko': SITE + base, 'en': SITE + '/en' + base, 'x-default': SITE + base})
                title = page.text.split('<title>', 1)[1].split('</title>', 1)[0]
                self.assertNotIn(title, titles)
                titles.add(title)

    def test_every_internal_link_asset_and_fragment_resolves(self):
        broken = []
        for route in ROUTES:
            if not path_for(route).exists():
                continue
            page = Page(path_for(route))
            for tag, attrs in page.tags:
                ref = attrs.get('href') if tag in ['a', 'link'] else attrs.get('src')
                if not ref or ref.startswith(('mailto:', 'tel:', 'data:')):
                    continue
                parsed = urlsplit(urljoin(SITE + route, ref))
                if parsed.netloc != 'smartdetector.fwth.ai':
                    continue
                local = DIST / unquote(parsed.path).lstrip('/')
                if parsed.path.endswith('/'):
                    local /= 'index.html'
                if not local.is_file():
                    broken.append((route, ref))
                elif parsed.fragment and local.suffix == '.html':
                    ids = {a.get('id') for _, a in Page(local).tags}
                    if unquote(parsed.fragment) not in ids:
                        broken.append((route, ref))
        self.assertEqual(broken, [])

    def test_install_and_contact_work_without_javascript(self):
        for route in ROUTES:
            with self.subTest(route=route):
                self.assertTrue(path_for(route).is_file(), route)
                page = Page(path_for(route))
                self.assertTrue(page.find('a', href=PLAY))
                if '/contact/' in route:
                    mail = [a['href'] for a in page.find('a') if a.get('href', '').startswith('mailto:smartdetector@fwth.ai?subject=')]
                    self.assertGreaterEqual(len(mail), 4)
                    self.assertNotIn('generate_lead', page.text)

    def test_sitemap_lists_exact_real_routes_with_language_pairs(self):
        root = ET.parse(DIST / 'sitemap.xml').getroot()
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'x': 'http://www.w3.org/1999/xhtml'}
        urls = root.findall('s:url', ns)
        self.assertEqual({u.find('s:loc', ns).text for u in urls}, {SITE + p for p in ROUTES})
        for node in urls:
            self.assertEqual(len(node.findall('x:link', ns)), 3)
        self.assertIn('Sitemap: ' + SITE + '/sitemap.xml', (DIST / 'robots.txt').read_text())

    def test_private_material_is_excluded_and_store_is_pinned(self):
        for name in ['PRODUCT.md', 'DESIGN.md', '.preview', '.git', 'node_modules', 'src', 'scripts', '.impeccable']:
            self.assertFalse((DIST / name).exists(), name)
        config = json.loads((DIST / 'download.json').read_text(encoding='utf-8'))
        self.assertTrue(config['available'])
        self.assertEqual(config['channel'], 'google-play')
        self.assertEqual(config['url'], PLAY)
        self.assertTrue((DIST / '.nojekyll').exists())

    def test_home_fragments_and_current_workflow_screens_resolve(self):
        for locale in ['', '/en']:
            page = Page(path_for(locale + '/'))
            ids = {a.get('id') for _, a in page.tags}
            self.assertTrue({'download', 'how-it-works', 'questions', 'report', 'tutorial'} <= ids)
            sources = {a.get('src') for a in page.find('img')}
            for name in ['ready', 'empty-room', 'baseline-ready', 'monitoring', 'paused']:
                self.assertIn('/assets/screenshots/' + name + '.png', sources)


if __name__ == '__main__':
    unittest.main()
