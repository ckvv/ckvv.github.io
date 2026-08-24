---
title: "如何优雅的提示用户需要升级npm依赖包版本？"
tags: ["NPM"]
date: '2021/07/09'
---

## 背景

某次更新`@ckpack/vue-color`时引入了严重bug，影响的版本是`>=1.0.0`,`<=1.1.3`，并在`1.1.4`中修复了该问题，问题来了，如何优雅的提示安装该包的人需要升级`1.1.4`版本呢？

## 解决办法

+ 首先想到的是百度、谷歌没有，但是找到🤷‍♂️
+ 哪就看看npm有哪些命令吧`npm help`

```
    access, adduser, audit, bin, bugs, cache, ci, completion,
    config, dedupe, deprecate, diff, dist-tag, docs, doctor,
    edit, exec, explain, explore, find-dupes, fund, get, help,
    hook, init, install, install-ci-test, install-test, link,
    ll, login, logout, ls, org, outdated, owner, pack, ping,
    pkg, prefix, profile, prune, publish, rebuild, repo,
    restart, root, run-script, search, set, set-script,
    shrinkwrap, star, stars, start, stop, team, test, token,
    uninstall, unpublish, unstar, update, version, view, whoami
```

+ 直觉告诉我用`unpublish`，`npm help unpublish` 试试,
帮助信息中有一句

```
   Warning
       Consider using the npm help deprecate command instead, if your intent is to encourage users to upgrade, or if you no longer want to maintain a package.
```

很明显直觉是不对的，这里npm告诉我们鼓励用户升级的话用`deprecate`命令

+ 看看`deprecate`是干什么的，`npm help deprecate`

```
Deprecate a version of a package
```

中文意思弃用包版本，用起来很简单`npm deprecate my-thing@"< 0.2.3" "critical bug fixed in v0.2.3"` 其中的版本只要是<https://github.com/npm/node-semver#versions>支持的均可以，

+ 声明弃用版本

```
npm deprecate @ckpack/vue-color@">=1.0.0 <=1.1.3" "Critical bug fixed in v1.1.4
```

## 声明弃用版本后npm做了什么

### 官网的变化

打开npm对应地址<https://www.npmjs.com/package/@ckpack/vue-color>

![截屏2021-10-21 下午7.09.29.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89c5356a0f764e5c84eb094d833cb073~tplv-k3u1fbpfcp-watermark.image?)
我们可以发现被声明弃用的版本被隐藏掉了，点击`show deprecated versions`后才会显示出来

### 如果我们安装弃用的版本呢？

```json
{
  "dependencies": {
    "@ckpack/vue-color": "^1.1.3"
  }
}
```

`yarn install`没有任何变化，命令行也没有任何提醒？？**`不是吧`** 那我声明弃用版本有什么用呢？别急，我们打开`node_modules` 对应的包看看，果然`package.json`中对应的版本是`"version": "1.1.4",`这是由于`"@ckpack/vue-color": "^1.1.3",` 其中`^version`是与版本兼容的意思,我们试试

```json
{
  "dependencies": {
    "@ckpack/vue-color": "1.1.3"
  }
}
```

果然命令行中出现了警告`warning @ckpack/vue-color@1.1.3: Critical bug fixed in v1.1.4` 此时npm自动不会升级版本，我们安装的版本就是`1.1.3`
