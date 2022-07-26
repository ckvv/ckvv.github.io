---
title: "node程序放入docker"
tags: ["Node.js", "Docker"]
date: "2021-07-09"
---

## 准备 demo 程序

- index.js

```javascript
"use strict";

const express = require("express");

// Constants
const PORT = 6677;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
```

- 根目录新建`Dockerfile`文件

```
## 定义我们需要从哪个镜像进行构建
FROM node:8

## 在镜像中创建一个文件夹存放应用程序代码，这将是你的应用程序工作目录
WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "index.js" ]
```

- `.dockerignore` 文件
  这将避免你的本地模块以及调试日志被拷贝进入到你的 Docker 镜像中

```
node_modules
npm-debug.log
```

## 镜像

构建你的镜像
进入到 Dockerfile 所在的那个目录中，运行以下命令构建 Docker 镜像。开关符 -t 让你标记你的镜像

```
//Don’t forget the . character at the end, which sets the build context to the current directory.
docker build -t chenkai/node-web-app:v1.0.0 .
```

检测镜像是否构建成功`docker images | grep node-web-app` 可以看到构建的镜像

运行镜像,使用 -d 模式运行镜像将以分离模式运行 Docker 容器，使得容器在后台自助运行。开关符 -p 在容器中把一个公共端口导向到私有的端口，请用以下命令运行你之前构建的镜像

```
docker run -p 4444:6677 -d chenkai/node-web-app:v1.0.0
```

`docker ps | grep node-web-app`可以看到启动的容器
`docker logs -f ${CONTAINER ID }`可以看到容器输出的日志

浏览器中输入通过容器暴露出的端口`http://localhost:4444/`即可访问镜像中的 node 程序

## 注意事项

## npm 包大小写

一次构建镜像后提示缺少 npm 包错误，原因是因为 mac 开发下对文件名大小写不敏感，程序可以正常跑通，打包成镜像后基础镜像基于 linux，对文件大小写敏感，找不到对应库

## dockerfile

一次运行容器报`sh: app.js,: unknown operand`错误，原因是 dockerfile 文件里面

```shell
CMD [ "node", 'app.js' ]
```

js 养成了引号、双引号的习惯没检查出来，
