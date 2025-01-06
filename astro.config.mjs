import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ckvv.net',
  integrations: [mdx(), vue(), tailwind()],
  devToolbar: {
    enabled: false,
  },
  experimental: {
    svg: true,
  },
  env: {
    schema: {
      KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
