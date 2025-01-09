import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import AstroPWA from '@vite-pwa/astro';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ckvv.net',
  integrations: [mdx(), vue(), tailwind(), AstroPWA({
    workbox: {
      globPatterns: ['**/*.{js,css,ico,png}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,ico,png}'],
    },
    registerType: 'autoUpdate',
    injectRegister: 'inline',
    manifest: {
      name: 'CK Blog',
      short_name: `CK's Blog`,
      description: `Websites for sharing my thoughts, experiences or knowledge`,
      theme_color: '#212129',
      background_color: '#ffffff',
      icons: [
        {
          src: 'favicon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'favicon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'favicon-32x32.svg',
          sizes: '32x32',
          type: 'image/svg',
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
    },
  })],
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
