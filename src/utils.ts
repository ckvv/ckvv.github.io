import type { CollectionEntry } from 'astro:content';
import { parse } from 'node:path';
import { getCollection } from 'astro:content';

const NAME_SEPARATOR_RE = /[_-]/;

function formatName(name: string) {
  return name.split(NAME_SEPARATOR_RE).join(' ');
}

export function formatDate(date: Date) {
  const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
  return `${year}/${`${month + 1}`.padStart(2, '0')}/${`${day}`.padStart(2, '0')}`;
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export async function getPosts(filter?: (entry: CollectionEntry<'blog'>) => boolean) {
  const posts = await getCollection('blog', filter);
  return posts
    .filter(v => v.data.draft !== true)
    .map((v) => {
      return {
        ...v,
        data: {
          ...v.data,
          title: v.data.title || formatName(parse(`${v.filePath}`).name),
          tags: Array.isArray(v.data.tags) ? v.data.tags.map(t => t.toLocaleLowerCase()) : [],
          pubDate: v.data.pubDate || v.data.date,
        },
      };
    })
    .sort(
      (a, b) => new Date(b.data.updatedDate || b.data.pubDate || 0).valueOf() - new Date(a.data.updatedDate || a.data.pubDate || 0).valueOf(),
    );
}
