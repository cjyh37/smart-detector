import { SITE, pageKeys, pageUpdatedAt, path, type Lang } from '../data/site';
import { articles } from '../data/journal';

export function GET() {
  const core = (['ko', 'en'] as Lang[]).flatMap(lang => pageKeys.map(page => ({ lang, page, slug: '', updated: pageUpdatedAt[page] })));
  const posts = articles.map(({ frontmatter: a }) => ({ lang: a.lang, page: 'journal', slug: a.slug, updated: a.updated || a.date }));
  const escape = (value: string) => value.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]!));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + [...core, ...posts].map(({ lang, page, slug, updated }) => `  <url><loc>${escape(SITE + path(lang, page, slug))}</loc><lastmod>${escape(updated)}</lastmod>${(['ko', 'en', 'x-default'] as const).map(alternate => `<xhtml:link rel="alternate" hreflang="${alternate}" href="${escape(SITE + path(alternate === 'en' ? 'en' : 'ko', page, slug))}"/>`).join('')}</url>`).join('\n') + '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
