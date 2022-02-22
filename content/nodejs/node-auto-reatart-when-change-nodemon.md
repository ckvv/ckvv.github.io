---
title: "检测node程序自动重启"
tags: ['node']
date: '2021-07-09'
---

nodemon是一种工具，通过在检测到目录中的文件更改时自动重新启动节点应用程序来帮助开发基于node.js的应用程序

### nodemon将全局安装到您的系统路径
```
npm install -g nodemon
```

### nodemon包装您的应用程序，因此您可以传递通常传递给应用程序的所有参数
```
nodemon [your node app]
```
### 查看帮助
```
nodemon -h
```

### 配置文件
nodemon支持本地和全局配置文件。这些通常是命名的nodemon.json,可以位于当前工作目录或主目录中。可以使用该--config <file>选项指定备用本地配置文件。
```
{
  "verbose": true,
  "ignore": ["*.test.js", "fixtures/*"],
  "execMap": {
    "rb": "ruby",
    "pde": "processing --sketch={{pwd}} --run"
  }
}
```

nodemon支持使用package.json配置,以与配置文件相同的格式指定配置，但nodemonConfig在package.json文件中
```
{
  "name": "nodemon",
  "homepage": "http://nodemon.io",
  "...": "... other standard package.json values",
  "nodemonConfig": {
    "ignore": ["test/*", "docs/*"],
    "delay": "2500"
  }
}
```

### 忽略指定文件
在某些情况下，您将要忽略某些特定文件，目录或文件模式，以防止nodemon过早地重新启动您的应用程序。在默认情况下，nodemon会忽略.git，node_modules，bower_components，.nyc_output，coverage和.sass-cache目录
```
nodemon --ignore lib / --ignore tests /
nodemon --ignore lib / app.js
nodemon --ignore 'lib/*.js

```

### 延迟重启
在某些情况下，您可能希望等到许多文件发生更改。检查新文件更改之前的超时是1秒。如果您上传了大量文件并且需要几秒钟，这可能会导致您的应用无需多次重启

```
nodemon --delay 10 server.js
nodemon --delay 2.5 server.js
nodemon --delay 2500ms server.js
```


