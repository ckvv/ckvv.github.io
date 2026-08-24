import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ckvv.net',
  vite: {
    plugins: [tailwindcss()],
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: {
          chrome: 90 << 16,
          firefox: 90 << 16,
          safari: 14 << 16,
          edge: 90 << 16,
        },
      },
    },
    server: {
      hmr: {
        overlay: false,
      },
    },
  },
  integrations: [
    mdx(),
    sitemap(),
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
  },
  env: {
    schema: {
      KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
