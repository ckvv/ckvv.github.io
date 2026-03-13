# Repository Guidelines

## Project Structure & Module Organization

This repository is an Astro-based blog deployed to GitHub Pages. Application code lives in `src/`: reusable UI in `src/components/`, page routes in `src/pages/`, layouts in `src/layouts/`, shared styles in `src/styles/`, and supporting utilities in files such as `src/utils.ts` and `src/api/index.ts`. Content is stored in `content/` and organized by topic (`content/posts/`, `content/vue/`, `content/javascript/`, etc.). Static assets that should be copied as-is belong in `public/`. Build output is generated into `dist/`. Helper scripts live in `scripts/`, currently `scripts/gen.ts`.

## Build, Test, and Development Commands

Use `pnpm` with Node.js 24.x.

- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the local Astro dev server.
- `pnpm build` creates the production site in `dist/`.
- `pnpm preview` serves the built site locally for a final check.
- `pnpm lint` runs ESLint with `--fix` across the repository.
- `pnpm gen` runs `scripts/gen.ts` for repository-specific content generation.

## Coding Style & Naming Conventions

Follow the existing Astro, TypeScript, and component patterns already in `src/`. ESLint is configured through [`eslint.config.mjs`](/Users/chenkai/github/ckvv/ckvv.github.io/eslint.config.mjs) using `@antfu/eslint-config`; semicolons are required, brace style is `1tbs`, and console usage is allowed but warned. Use descriptive PascalCase names for Astro components such as `BaseLayout.astro`, and keep utility modules in concise camelCase or lower-case file names such as `utils.ts`. Prefer small, focused changes over broad refactors.

## Testing Guidelines

There is currently no dedicated automated test suite in this repository. Treat `pnpm lint` and `pnpm build` as the minimum validation steps before opening a pull request. When changing rendered pages, verify the affected routes in `pnpm dev` or `pnpm preview`. If you add public utility behavior, update the relevant documentation under `docs/`.

## Commit & Pull Request Guidelines

Recent history favors short `chore:`-style commit subjects, for example `chore: update action`. Keep commit messages imperative and scoped to one change. Pull requests should include a brief summary, note any content or configuration impact, link related issues when applicable, and attach screenshots for visible UI or page changes. Do not add new production dependencies without maintainer confirmation.

## Deployment & Configuration Notes

GitHub Actions in `.github/workflows/pages.yml` builds on pushes to `main` using Node.js 24 and deploys `dist/` to GitHub Pages. Production builds read `KEY` from repository secrets, so avoid hardcoding credentials or environment-specific values in source files.
