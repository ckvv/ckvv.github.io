import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ckvv.net',
  vite: {
    plugins: [tailwindcss()],
    server: {
      hmr: {
        overlay: false,
      },
    },
  },
  integrations: [
    mdx(),
    vue({
      include: ['**/components/vue/*'],
    }),
    react({
      include: ['**/components/react/*'],
    }),
  ],
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
