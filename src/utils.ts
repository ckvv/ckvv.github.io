import { parse } from 'node:path';
import { type CollectionEntry, getCollection } from 'astro:content';

function formatName(name: string) {
  return name.split(/[_-]/).join(' ');
}

export async function getPosts(filter?: (entry: CollectionEntry<'blog'>) => boolean) {
  const posts = await getCollection('blog', filter);
  return posts.filter(v => v.data.draft !== true)
    .map((v) => {
      v.data.title ||= formatName(parse(`${v.filePath}`).name);
      v.data.tags = Array.isArray(v.data.tags) ? v.data.tags.map(v => v.toLocaleLowerCase()) : [];
      v.data.pubDate ||= v.data?.date;
      return v;
    })
    .sort(
      (a, b) => new Date(b.data.updatedDate || b.data.pubDate || 0).valueOf() - new Date(a.data.updatedDate || a.data.pubDate || 0).valueOf(),
    )
  ;
}
