---
title: "npm"
tags: ['tool', 'npm']
date: '2021-07-09'
---

## npm 配置

修改配置文件
npm配置文件地址`~/.npmrc`，`npm config ls -l`,`npm config edit`命令;

npm的全局node包在哪里？
就是那些通过npm install xxx -g或者cnpm install xxx -g或者yarn global add xxx安装的xxx文件，到底安装在什么地方？这个其实也挺好找的。默认情况下，可以通过下面的命令查看其基础路径。

```
npm config get prefix
npm root -g

```

默认的全局安装包位置：
win系统下路径是：%APPDATA%/npm/node_modules/
mac系统下路径是：/usr/local/lib/node_modules/

+ npm 清空缓存
npm cache clean -

+ 设置npm源

```
npm config set registry http://registry.npmjs.org/
npm config set registry https://registry.npm.taobao.org/

//临时使用
npm i -g express --registry https://registry.npm.taobao.org
```

+ 更新npm

```
npm install --global npm
```

# npm 发布包

```shell
# 登陆
npm login --registry http://registry.npmjs.org

# 推送
npm publish --registry http://registry.npmjs.org --access=public

# 24h unpublish
npm unpublish pkgname --force

# 安装警告声明
npm deprecate my-thing@1.x "1.x is no longer supported"
```
