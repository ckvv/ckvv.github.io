---
title: "2025 年的 Node.js 开发步骤"
tags: ["Node.js"]
date: "2025/04/09"
---

2025 如何通过 Node.js TypeScript 的新功能來进行轻量高效的的后端开发

## 框架选择

### 优先考虑

+ [hono](https://hono.dev/)
+ [h3](https://h3.unjs.io/)
+ [nitro](https://nitro.build/)
+ [fastify](https://fastify.dev/)
+ [midway](https://midwayjs.org/)
+ [nestjs](https://nestjs.com/)

需要服务器端渲染可以考虑

+ [nextjs](https://nextjs.org/docs)
+ [nuxt](https://nuxt.com/)

其他

+ [koajs](https://koajs.com/)
+ [expressjs](https://expressjs.com/)
+ [eggjs](https://www.eggjs.org/)

## TypeScript

推荐的 `tsconfig` 配置
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "noEmit": true, // Optional - see note below
    "forceConsistentCasingInFileNames": true, //程序试图通过与磁盘上的大小写不同的大小写来包含文件，则 TypeScript 将发出错误
    "verbatimModuleSyntax": true, // TypeScript 会原封不动保留你的 import / export 语法,  https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax
    "erasableSyntaxOnly": true, // Node.js 仅支持不具有运行时语义的 TypeScript 特定语法
    "skipLibCheck": true, // 跳过默认库声明文件的类型检查
    "rewriteRelativeImportExtensions": true // 将相对导入路径中的 .ts、.tsx、.mts 和 .cts 文件扩展名重写为输出文件中对应的 JavaScript 文件扩展名
  }
} 
```

开发环境可以通过下面两个命令启动

+ node 直接启动 `node --experimental-strip-types index.ts`
+ 使用 tsx 启动 `node --import=tsx index.ts`

## Subpath Imports

`Subpath Imports`（子路径导入）是一种现代化模块导入方式，配合 Node.js 的 `exports`, `imports` 字段或 TypeScript 的 `paths` 设置, 可以带来以下几个显著好处

+ 清晰的模块结构
+ 简化路径，避免深层相对路径
+ 支持自动补全与类型提示
+ 统一的项目导入方式

## ESM

## 环境变量

您不再需要像 `dotenv` 之类包来处理.env 文件。简单地使用 `--env-file` 标志

```shell
node --env-file=.env index.ts
```
## watch

比 `nodemon`更高效, Node.js 现在支持本地文件监视

```shell
node --watch index.ts
```

## 测试

您不再需要像 `jest` 之类包来开发测试, 使用 `node:asser`, `node:test` 编写测试文件, 通过 `node --test` 启动 Node.js 命令行测试运行器

```shell
node --test "**/*.test.js" "**/*.spec.js" 
```

+ [vitest](https://vitest.dev/)

## ORM

+ [drizzle](https://orm.drizzle.team/)
+ [prisma](https://www.prisma.io/)
+ [sequelize V7](https://sequelize.org/docs/v7/)

## 日志

+ [pino](https://getpino.io/)

## 参数验证

+ [zod](https://zod.dev/)
+ [ArkType](https://arktype.io/docs/intro/morphs-and-more)
+ [ajv](https://ajv.js.org/) 

## API 文档

+ [Swagger](https://swagger.io/)
+ [OpenAPI](https://tools.openapis.org/categories/sdk.html)
+ [openapi-ts](https://openapi-ts.dev/)
+ [typedoc](https://typedoc.org/)
+ [jsdoc](https://jsdoc.app/)

## 代码参考

你可以参考 <https://github.com/ckvv/template> 的 `server-*` 项目

## 参考文档

+ https://nodejs.org/api/assert.html
+ https://nodejs.org/api/test.html
+ https://nodejs.org/api/typescript.html
+ https://nodejs.org/api/esm.html
+ https://devblogs.microsoft.com/typescript/announcing-typescript-5-7-beta/#path-rewriting-for-relative-paths