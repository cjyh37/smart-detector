import { SITE, pageKeys, path, type Lang } from '../data/site';
import { articles } from '../data/journal';

export function GET() {
  const core = (['ko', 'en'] as Lang[]).flatMap(lang => pageKeys.map(page => ({ lang, page, slug: '' })));
  const posts = articles.map(({ frontmatter: a }) => ({ lang: a.lang, page: 'journal', slug: a.slug }));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + [...core, ...posts].map(({ lang, page, slug }) => `  <url><loc>${SITE}${path(lang, page, slug)}</loc>${(['ko', 'en', 'x-default'] as const).map(alternate => `<xhtml:link rel="alternate" hreflang="${alternate}" href="${SITE}${path(alternate === 'en' ? 'en' : 'ko', page, slug)}"/>`).join('')}</url>`).join('\n') + '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
