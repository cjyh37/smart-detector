"""Render Japanese static pages using the reviewed, offline phrase catalogue."""
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, unquote

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
CATALOG = ROOT / "src/data/ja.json"
phrases = {}
blocks = {}
missing = set()


def translate(value):
    key = value.strip()
    if key.startswith('Contact help@fwth.ai about'):
        return '導入、共同研究、出資、アプリに関するお問い合わせは help@fwth.ai までお寄せください。'
    if not re.search('[a-zA-Z]', key) or '@' in key or '://' in key:
        return value
    if key not in phrases:
        missing.add(key)
    return value.replace(key, phrases.get(key, key))


def local_url(value):
    if value.startswith('mailto:') and 'subject=' in value:
        prefix, encoded = value.split('subject=', 1)
        subject = unquote(encoded)
        if subject in phrases:
            return prefix + 'subject=' + quote(phrases[subject])
    return re.sub(r'^(https://smartdetector\.fwth\.ai)?/en/', lambda m: (m.group(1) or '') + '/ja/', value)


def replace_blocks(doc):
    if not blocks:
        return doc
    return re.sub(
        r'<p>(.*?)</p>',
        lambda m: f'<p data-ja-done="1">{blocks[m.group(1).strip()]}</p>' if m.group(1).strip() in blocks else m.group(0),
        doc,
        flags=re.S,
    )


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.raw = ''
        self.schema = False
        self.language_link = False
        self.pretranslated = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ('style', 'script'):
            self.raw = tag
            self.schema = a.get('type') == 'application/ld+json'
        if tag == 'p' and a.pop('data-ja-done', None):
            self.pretranslated = True
        self.language_link = tag == 'a' and 'language-link' in (a.get('class') or '')
        if tag == 'select' and a.get('id') == 'site-language':
            a['aria-label'] = '言語を選択'
        if tag == 'option' and a.get('lang'):
            self.language_link = True
            a.pop('selected', None)
            if a['lang'] == 'ja':
                a['selected'] = None
        if tag == 'html':
            a['lang'] = 'ja'
        if tag == 'meta':
            field = a.get('property') or a.get('name')
            if field in ('description', 'og:title', 'og:description', 'og:image:alt', 'twitter:title', 'twitter:description'):
                a['content'] = translate(a['content'])
            elif field == 'og:locale':
                a['content'] = 'ja_JP'
            elif field == 'og:url':
                a['content'] = local_url(a['content'])
        if 'href' in a and 'hreflang' not in a:
            a['href'] = local_url(a['href'])
        if a.get('data-embed-src'):
            a['data-embed-src'] = a['data-embed-src'].replace('hl=en', 'hl=ja')
        for key in ('placeholder', 'aria-label', 'alt', 'title', 'data-title', 'data-alt', 'data-zoom-label', 'data-fit-label', 'data-video-title', 'data-subject'):
            if a.get(key) and not self.language_link and not self.pretranslated:
                a[key] = translate(a[key])
        self.parts.append('<' + tag + ''.join(' ' + k if v is None else ' ' + k + '="' + html.escape(v, quote=True) + '"' for k, v in a.items()) + '>')

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        self.parts.append('</' + tag + '>')
        if tag == self.raw:
            self.raw = ''
        if tag in ('a', 'option'):
            self.language_link = False
        if tag == 'p':
            self.pretranslated = False

    def handle_data(self, data):
        if self.raw and self.schema and self.raw == 'script':
            def localized(obj):
                if isinstance(obj, list):
                    return [localized(x) for x in obj]
                if isinstance(obj, dict):
                    return {
                        k: ('ja' if k == 'inLanguage' and v == 'en' else translate(v) if k in ('headline', 'description', 'name') and isinstance(v, str) else localized(v))
                        for k, v in obj.items()
                    }
                return local_url(obj) if isinstance(obj, str) else obj
            data = json.dumps(localized(json.loads(data)), ensure_ascii=False).replace('<', '\\u003c')
        elif not self.raw and not self.language_link:
            data = html.escape(data if self.pretranslated else translate(data), quote=False)
        self.parts.append(data)

    def handle_decl(self, d):
        self.parts.append('<!' + d + '>')

    def handle_comment(self, d):
        self.parts.append('<!--' + d + '-->')


def render(write=True):
    for source in (DIST / 'en').rglob('index.html'):
        page = Page()
        page.feed(replace_blocks(source.read_text(encoding='utf8')))
        if write:
            target = DIST / 'ja' / source.relative_to(DIST / 'en')
            target.parent.mkdir(parents=True, exist_ok=True)
            result = ''.join(page.parts).replace('/assets/localized/en/', '/assets/localized/ja/').replace('/assets/social-en.png', '/assets/social-ja.png')
            target.write_text(result, encoding='utf8')


if __name__ == '__main__':
    loaded = json.loads(CATALOG.read_text(encoding='utf8'))
    blocks.update(loaded.pop('__blocks__', {}))
    phrases.update(loaded)
    render()
    if missing:
        raise SystemExit('Missing Japanese translations: ' + str(sorted(missing)[:5]))
    file = DIST / 'sitemap.xml'
    xml = file.read_text(encoding='utf8')
    if 'hreflang="ja"' not in xml:
        def extend(match):
            block = match[0]
            alt = re.search(r'<xhtml:link rel="alternate" hreflang="en" href="([^"]+)"/>', block)
            ja = local_url(alt[1])
            block = block.replace(alt[0], alt[0] + alt[0].replace('hreflang="en"', 'hreflang="ja"').replace(alt[1], ja))
            if '<loc>' + alt[1] + '</loc>' in block:
                block += block.replace('<loc>' + alt[1] + '</loc>', '<loc>' + ja + '</loc>')
            return block

        file.write_text(re.sub(r'<url>.*?</url>', extend, xml), encoding='utf8')
