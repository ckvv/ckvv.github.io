---
title: "Node.js 对 TypeScript 功能的原生支持"
tags: ['Node.js']
date: '2024-08-06'
---

Node.js 22.6.0 版本以后可以通过设置实验标志 `--experimental-strip-types` 来执行 TypeScript 文件, Node.js 会将 TypeScript 源代码转译为 JavaScript 源代码(目前使用`@swc/wasm-typescript`)。在转译过程中，不执行类型检查，并且类型将被丢弃。

引入了 `--experimental-strip-types` 标志， 使Node.js能够运行仅包含类型注释的 TypeScript 文件。此类文件不包含需要转换的 TypeScript 功能，例如枚举或命名空间。Node.js将用空格替换内联类型注释，并且不执行类型检查。依赖于 tsconfig.json 中的设置的 TypeScript 功能（例如路径或将较新的 JavaScript 语法转换为较旧的标准）是有意不支持的。

## 启动功能

在以前 Node.js 是不支持直接运行 TypeScript 代码的, 我们一般需要一些第三方库的支持，比如说`tsx` `vite-node` 等

``` shell
npx vite-node index.ts
npx tsx index.ts 
# 或者
node --import=tsx index.ts 
```
现在可以像`bun` 或 `deno` 一样直接运行 TypeScript 代码(目前还通过`--experimental-strip-types` 标志启用)
```shell
node --experimental-strip-types index.ts 
```

## 功能限制

+ 仅支持内联类型注释，不支持`enums`或`namespaces`等功能。
+ 在 `import` 和 `require `语句中需要显式文件扩展名如`.ts` `.mts` `.cts`（注意和`bun` 或 `deno` 不同 目前 `.tsx` 文件不受支持的）
+ 强制使用 type 关键字进行类型导入，以避免运行时错误。
+ 默认情况下，Node.js将拒绝处理 node_modules 路径下的文件夹中的 TypeScript 文件。


## 参考
+ https://nodejs.org/docs/latest/api/typescript.html
+ https://github.com/nodejs/node/pull/53725