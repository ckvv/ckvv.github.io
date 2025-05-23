import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './content', pattern: ['**/*.{md,mdx}', '*.{md,mdx}'] }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    pubDate: z.coerce.date().optional(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
    blog: z.boolean().optional(),
    encrypt: z.boolean().optional(),
    id: z.string().optional(),
  }),
});

export const collections = { blog };
