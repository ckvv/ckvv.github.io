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

## Blog Content Rules

When the user asks for a blog post or article for this site, write the content into the repository instead of only returning prose in chat.

- Put new general blog articles under `content/posts/` unless the user explicitly asks for another category.
- Use Markdown by default; use MDX only when the article needs embedded components.
- Include frontmatter with at least `title`, `tags`, and `date`; add `description` when helpful for listing or SEO.
- Follow the existing date format used in this repo: `"YYYY/MM/DD"`.
- Keep the article title and body aligned with the source material, and include a source/reference section when the post is based on an external link or document.
- Before creating a new article, inspect nearby content to match the repository's current writing and frontmatter conventions.
- After adding or editing blog content under `content/`, skip testing and build validation for `.md` files. If the change touches any `.mdx` file, run `pnpm build` as the minimum validation to confirm the content collection and route generation still work.

## Testing Guidelines

There is currently no dedicated automated test suite in this repository. Treat `pnpm lint` and `pnpm build` as the minimum validation steps before opening a pull request, except when only updating `.md` files under `content/`; in that case, no testing is required. If a `content/` change touches any `.mdx` file, still run `pnpm build`. When changing rendered pages, verify the affected routes in `pnpm dev` or `pnpm preview`. If you add public utility behavior, update the relevant documentation under `docs/`.

## Commit & Pull Request Guidelines

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages. Use the format ``<type>[optional scope]: <description>`` and keep the description imperative, concise, and scoped to one change.

- Prefer standard types such as `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, and `chore`.
- Use an optional scope when it adds useful context, for example `feat(blog): add article series navigation`.
- Mark breaking changes with `!` after the type or scope, or with a `BREAKING CHANGE:` footer when more detail is needed.
- Add a body or footer only when extra context, issue references, or migration notes are needed.

Pull requests should include a brief summary, note any content or configuration impact, link related issues when applicable, and attach screenshots for visible UI or page changes. Do not add new production dependencies without maintainer confirmation.

## Deployment & Configuration Notes

GitHub Actions in `.github/workflows/pages.yml` builds on pushes to `main` using Node.js 24 and deploys `dist/` to GitHub Pages. Production builds read `KEY` from repository secrets, so avoid hardcoding credentials or environment-specific values in source files.
