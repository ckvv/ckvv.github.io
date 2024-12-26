import { getCollection } from 'astro:content';

export async function getPosts() {
  const posts = await getCollection('blog')
  return posts.sort(
		(a, b) => new Date(b.data.updatedDate || b.data.pubDate || 0).valueOf() - new Date(a.data.updatedDate || a.data.pubDate || 0).valueOf(),
	).filter((v => v.data.draft !== true)).map(v => {
    v.data.pubDate = v.data?.date;
    return v;
  })
}