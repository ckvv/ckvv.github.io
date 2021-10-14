---
title: 你不知道的package.json
tags: ['文章', 'npm']
---

## engines
描述模块的兼容性如:

指定模块运行的node版本
```json
{
  "engines": {
    "node": ">=0.10.3 <15"
  }
}
```

指定模块运行的npm版本
```json
{
  "engines": {
    "npm": "~1.0.20"
  }
}
```

禁止使用yarn
```json
{
  "engines": {
    "yarn": "please use npm"
  }
}
```

## files
> 一般来说`npm`上我们只需要发布打包好的文件，对于`git`则恰好相反我们只需要提交源代码
指定发布到npm中的文件,默认是所有文件`["*"]`
你也可以通过`.npmignore`防止某些文件被包含在内，它不会覆盖`files`字段，但会覆盖其子目录。 如果不存在`.npmignore`将使用`.gitignore`替代
## bin
安装可执行文件
如果你的包都有一个或多个想要安装到 PATH 中的可执行文件，请在`package.json`中提供一个`bin`字段，它是命令名到本地文件名的映射。当这个包被全局安装时，该文件将被链接到全局`bin`所在的位置，因此它可以按名称运行。当这个包作为另一个包的依赖项安装时，该文件将被链接到该包可以直接通过 npm exec 或通过 npm run-script 调用它们时在其他脚本中的名称,
以`typescript`举例，在[`package.json`](https://github.com/microsoft/TypeScript/blob/315b807489b8ff3a892179488fb0c00398d9b2c3/package.json#L24-L27)文件中存在
```json
{
  "bin": {
      "tsc": "./bin/tsc",
      "tsserver": "./bin/tsserver"
  },
}
```
### 全局安装
所以通过全局安装`npm install -g typescript` 我们可以在命令行中使用`tsc`命令,
通过`which tsc` 我们可以查看可执行文件在`/Users/chenkai/.nvm/versions/node/v14.17.1/bin/tsc`
`$PATH`中定义了`/Users/chenkai/.nvm/versions/node/v14.17.1/bin`目录，所以我们可以直接运行`tsc`命令
### 作为另一个包的依赖项安装

此时我们不能作为全局命令使用`tsc`, 但是在`node_modules/.bin`中多了`tsc`文件指向`node_modules/typescript/bin/tsc`,我们可以在`scripts`中调用`tsc` 如
```json
{
  "scripts": {
    "build": "tsc index.ts"
  }
}
```
## dependencies
设置包的依赖项,`dependencies`设置的依赖包也会被默认安装到`node_modules`。 一般用来存放代码运行中实际依赖的包。
## devDependencies
设置包的依赖项,和`dependencies`不同的是，只有在该包根目录执行`npm link`或者`npm install`时才会被安装到`node_modules`。当你把该包作为一个依赖时，`devDependencies`设置的依赖包***不会**被安装到`node_modules`。 一般用来存放打包（rollup、esbuild、webpack）、构建（typescript）、测试（jest）等只有在开发环境依赖的包。
## peerdependencies
设置包的依赖项, `peerdependencies`设置的依赖包表达您的包与主机工具或库的兼容性，
如你开发了一个vue组件库需要指定在`vue 3.x`版本中使用，可以这样设置
```json
{
  "peerdependencies": {
    "vue": "^3.0"
  }
}
```
如果用户安装了该组件库，并且安装`peerdependencies`设置的依赖包与用户安装的依赖包指定的版本不一致时，npm会提示vue版本不兼容的信息
> `npm v7`开始如果用户没有安装`peerdependencies`设置的依赖包, `peerdependencies`设置的依赖包会被默认安装到`node_modules`，

## workspaces
它支持从单个顶级根包中管理本地文件系统中的多个包,避免手动使用 npm link 来添加对应符号链接到当前 node_modules 文件夹的包的引用。如
当前工作目录中，包含一个名为 workspace-a 的文件夹，其中本身包含一个 package.json
```
.
+-- package.json
`-- workspace-a
   `-- package.json
```
在当前工作目录中运行 npm install 后, 文件夹 workspace-a 将符号链接到当前工作目录的 node_modules 文件夹
```
.
+-- node_modules
|  `-- workspace-a -> ../workspace-a
+-- package-lock.json
+-- package.json
`-- workspace-a
   `-- package.json
```
## 其他

### module
指定模块入口文件，不同于`main`字段，将指向一个具有 ES2015 模块语法的模块入口文件，你可以与`main`字段同时命名，当你用`es6`语法导入时，打包工具（`rollup`,`webpack`）会优先使用该字段对应的入口文件，
```json
{
  "name": "my-package",
  "version": "0.1.0",
  "main": "dist/my-package.umd.js",
  "module": "dist/my-package.esm.js"
}
```

### type
[`type`](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#packages_type)字段定义了 Node.js 用于所有以 package.json 文件作为其最近父级的 .js 文件的模块格式。 当最近的父 package.json 文件包含值为“module”的顶级字段`type`时，以 .js 结尾的文件将作为 ES 模块加载。

### exports
[`exports`](https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#packages_exports) 字段允许定义包的入口点，当通过 node_modules 查找或对其自身名称的自引用加载的名称导入时。 Node.js 12+ 支持它作为“main”的替代方案，
```json
{
  "name": "a-package",
  "exports": {
    ".": "./main.mjs",
    "./foo": "./foo.js"
  }
}
```

并且`exports`还支持按条件导出
```json
{
  "type": "module",
  "main": "./index.cjs",
  "exports": {
    "import": "./wrapper.mjs",
    "require": "./index.cjs"
  }
}
```