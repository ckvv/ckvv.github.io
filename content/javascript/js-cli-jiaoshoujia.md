---
title: "JavaScript脚手架"
tags: ['文章']
date: '2021-07-09'
---

## 什么是脚手架
脚手架是为了保证各施工过程顺利进行而搭设的工作平台。在项目开发中我们把创建项目结构模版的工具也称之为脚手架。如vue-cli，create-react-app等。这些脚手架等原理都一样，即用Node.js命令行程序生成项目模版。

## 第一个Node.js命令行脚本
编写脚手架其实就是Node.js命令行开发,和写shell脚本类似，使用JavaScript语言，写一个可执行脚本 hello wold过程如下：
新建一个`hello`文件，其中`#!/usr/bin/env node`不可少，其作用是它告诉系统这个脚本需要用node解释器来执行，语法与node一样。
```
#!/usr/bin/env node
console.log('hello world');
```
然后,修改的权限
```
chmod 755 hello
```
执行脚本
```
./hello
```
如果想把 hello 前面的路径去除，可以将 hello 的路径加入环境变量 PATH。但是，另一种更好的做法，是在当前目录下新建 package.json ，写入下面的内容。
```js
{
  "name": "hello",
  "bin": {
    "hello": "hello"
  }
}
```
然后执行 npm link 命令。
```
npm link
```
执行脚本
```
hello
```
## 写一个脚手架
脚手架开发与上面过程类似，有一些npm库可以帮助我们开发命令行工具如`shelljs`、`commander`，它们封装了node命令行命令可以更方便命令行开发。
文件目录结构
```
.
├── bin
│   └── ckoa.js
├── package-lock.json
├── package.json
└── utils
    └── download.js
```

## ckoa.js
Node.js命令行
```js
#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const downLoad = require('../utils/download')

if(!process.argv || process.argv.length <= 2){
    console.log(chalk.yellow(`\nOptions: \n   -h, --help for a list of available commands.`));
    process.exit(1);
}

const gitPath = 'ckvv/cli_koa';
program
    .version(require('../package').version)

program
    .command('init')
    .description('初始化一个koa项目')
    .arguments('<project_name> [env]')
    .action(async (args) => {
        downLoad(gitPath, `./${args}`);
    });


program.on('option:verbose', function () {
    process.env.VERBOSE = this.verbose;
});


// 未知命令会报错
program.on('command:*', function () {
    console.log(chalk.red(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`));
    process.exit(1);
});
program.parse(process.argv);
```

## download.js
从git仓库下载文件
```js
const downLoad = require('download-git-repo')
const ora = require('ora')

let clone = false;
let downGit = (url, name) => {
    if (!url || !name) {
        console.log(`缺少参数:url-${url},name-${name}`);
        process.exit(1);
        return;
    }
    const spinner = ora(`正在拉取git模板:${url}...`)
    spinner.start();
    downLoad(url, name, {
        clone
    }, err => {
        spinner.stop()
        console.log(err ? err : `拉取git模板:${url}完成`);
        process.exit(1)
    })
}

module.exports = downGit
```
## package.json
把下面配置添加到`package.json`中，npm会将ckoa.js符号链接（symlink）到`/usr/local/bin/ckoa`(全局安装)或者`./node_modules/.bin/`(本地安装)
当我们全局安装时我们可以使用ckoa命令行工具啦，
```
  "bin": {
    "ckoa": "bin/ckoa.js"
  },
```
**注意请确保bin中引用的文件以`#!/usr/bin/env node`开头**

## 脚手架发布到npm中
登陆
```shell
npm login --registry http://registry.npmjs.org
```
推送
```shell
npm publish --registry http://registry.npmjs.org --access=public
```

## 使用脚手架

全局安装
```shell
npm install -g @c_kai/cli
```
使用命令行
```shell
## 查看帮助
ckoa -h

## 用脚手架创建项目
ckoa init my_app;
```