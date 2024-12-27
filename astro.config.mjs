import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ckvv.github.io',
  integrations: [mdx(), sitemap(), vue(), tailwind()],
  devToolbar: {
    enabled: false,
  },
  experimental: {
    svg: true,
  },
});
