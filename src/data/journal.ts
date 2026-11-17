import type { MarkdownInstance } from 'astro';
import type { Lang } from './site';

export interface ArticleMeta {
  lang: Lang;
  slug: string;
  title: string;
  description: string;
  category: 'product' | 'guide' | 'research';
  date: string;
  updated?: string;
  readTime: string;
  order: number;
}
const modules = import.meta.glob<MarkdownInstance<ArticleMeta>>('../content/journal/**/*.md', { eager: true });
export const articles = Object.values(modules).sort((a, b) => a.frontmatter.order - b.frontmatter.order);
export const articlesFor = (lang: Lang) => articles.filter(a => a.frontmatter.lang === lang);
export const categoryLabels = {
  ko: { all: '전체', product: '브랜드·제품', guide: '현장 가이드', research: '연구노트' },
  en: { all: 'All notes', product: 'Brand & product', guide: 'Field guides', research: 'Research' },
};
