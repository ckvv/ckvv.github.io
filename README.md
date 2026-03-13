# [CK'S BLOG](https://ckvv.net)

A personal blog built with Astro and deployed to GitHub Pages.

## Overview

- Content-driven site powered by Markdown and MDX
- Minimal blog layout focused on reading speed
- Static deployment via GitHub Actions and GitHub Pages

## Development

This project uses `pnpm` and Node.js `24.x`.

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Project Structure

- `src/`: pages, layouts, components, styles, and shared utilities
- `content/`: blog posts and topic-based content collections
- `public/`: static assets copied directly to the final build
- `scripts/`: repository-specific helper scripts

# Features

+ Minimalism
+ [PageSpeed Insights 100%](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fckvv.net%2F)
+ [Mdx support](https://docs.astro.build/en/guides/integrations-guide/mdx/)
+ Blog encryption support
+ Comment

# Others

+ Power by: [astro](https://astro.build/)
+ Comment: [cusdis](https://cusdis.com)
+ File Hosting: [ckvv/cloudflare-worker](https://github.com/ckvv/cloudflare-worker)
