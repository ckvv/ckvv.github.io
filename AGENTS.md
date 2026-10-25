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
- Never put docs or rules under `content/`. The collection loader globs every `**/*.md`, so a file there becomes a published post.

### AI-assisted writing

The standard for what a post should be is [`docs/writing-guide.md`](docs/writing-guide.md). Read it before writing; this section holds only the repo mechanics the guide cannot know.

The agent may draft, restructure, and tighten prose. It is not the author: the material, the conclusions, and the final fact check stay with the repo owner.

Repo mechanics:

- Internal links use the route the site generates, `/blog/<id>` with `<id>` being the path under `content/` without its extension, and must point at a file that exists. External links must be ones the author can open.
- `description` says what the post contains, not why someone should read it.

Before publishing, the owner checks, not the agent:

- Every specific number, limit, and timing.
- Every sentence with a causal claim (因为 / 所以 / 因为这样才), the easiest place for a plausible fabrication.
- Every uniformly parallel section, which often signals paragraphs that were expanded to fill a skeleton rather than written from understanding.
- Every "insight" the owner cannot restate unprompted. Delete what fails; an uneven post is more credible than a smooth one.

## Content Naming & Tag Conventions

Content under `content/` follows these naming and tagging conventions. Match them when adding or moving files.

### File naming

- Use lowercase `kebab-case` for English filenames (for example `vue-component-registration.md`). Chinese titles may use a Chinese filename, but do not mix pinyin (`guanyu-vue-...`) — prefer the English or Chinese form directly.
- Use the `.md` extension only; never `.md.md`.
- Avoid spaces in filenames; use hyphens to separate words.
- A filename may reuse a topic prefix shared with its siblings (for example `react-hooks-effect.md`, `pg-trigger.md`), but keep it descriptive and short.
- Prefer moving a post into its topic directory over leaving it in `content/posts/`. Keep `content/posts/` for general or cross-cutting articles only.

### Topic directories

- `ai/` — AI, agents, MCP, coding assistants (Codex/Claude Code)
- `algorithm/` — algorithm and LeetCode notes
- `css/` — CSS
- `database/` — PostgreSQL, Sequelize, etc.
- `javascript/` — JavaScript and TypeScript
- `libs/` — tools, CLIs, and DevOps (git, docker, nginx, npm, shell, kubernetes, tauri, install guides)
- `life/` — personal
- `nodejs/` — Node.js, Koa
- `react/` — React
- `vue/` — Vue
- `web/` — browser/Web platform APIs
- `hide/` — drafts not meant to be published (`draft: true`)
- `posts/` — general or cross-cutting articles that do not fit a topic directory

### Frontmatter

- Always include `title`, `tags`, and `date` for posts. The field is `tags` (plural) — never `tag` or `tage`.
- Use the `date` format `"YYYY/MM/DD"` (slashes, not dashes).
- `draft: true` keeps a post out of the build; use it for unfinished drafts.
- `blog: false` marks non-blog pages such as `about.mdx`.
- `encrypt: true` marks an encrypted post.

### Tag vocabulary

Tags are lower-cased at display time in `src/utils.ts`, so source casing does not affect grouping — but keep the source casing consistent with the list below. Add a new tag only when no existing one fits.

`AI` · `Agent` · `Astro` · `Base64` · `CentOS` · `CSS` · `Claude Code` · `Codex` · `Cookie` · `Database` · `Docker` · `File API` · `GIS` · `Git` · `GitHub` · `Icon` · `JavaScript` · `JsonWebToken` · `Koa` · `Kubernetes` · `Life` · `Linux` · `MDX` · `Nginx` · `NPM` · `Node.js` · `OpenAI` · `Polyfill` · `React` · `Redis` · `Sandbox` · `Sequelize` · `Shell` · `Skills` · `Tauri` · `Tool` · `TypeScript` · `UUID` · `Vue` · `Web` · `WebAssembly` · `WebWorker` · `Windows` · `Yum`

Chinese tags: `工程实践` · `微信` · `正则` · `测试` · `算法` · `计算广告` · `资源收藏` · `面试`

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
