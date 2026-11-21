import type { CollectionEntry } from 'astro:content';
import { parse } from 'node:path';
import { getCollection } from 'astro:content';

const NAME_SEPARATOR_RE = /[_-]/;

function formatName(name: string) {
  return name.split(NAME_SEPARATOR_RE).join(' ');
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function groupPostsByTag(posts: Awaited<ReturnType<typeof getPosts>>) {
  const groups = new Map<string, typeof posts>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      if (!tag.trim()) {
        continue;
      }
      const group = groups.get(tag);
      if (group) {
        group.push(post);
      } else {
        groups.set(tag, [post]);
      }
    }
  }
  return groups;
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
          tags: Array.isArray(v.data.tags)
            ? v.data.tags.map(t => t.toLocaleLowerCase())
            : [],
          pubDate: v.data.pubDate || v.data.date,
        },
      };
    })
    .sort(
      (a, b) => new Date(b.data.updatedDate || b.data.pubDate || 0).valueOf() - new Date(a.data.updatedDate || a.data.pubDate || 0).valueOf(),
    );
}
