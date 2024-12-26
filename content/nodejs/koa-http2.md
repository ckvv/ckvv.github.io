---
title: 使用koa创建基于http2的服务
tag: ['Koa']
date: '2021-07-09'
---

# 使用koa创建服务

使用koa我们可以很容易创建一个http服务

```js
const Koa = require('koa');
const app = new Koa();
app.use(async (ctx) => {
  ctx.body = 'Hello World';
});
app.listen(3000);
```

其中`app.listen(...)` 方法只是以下内容的糖：

```js
const http = require('node:http');
const Koa = require('koa');
const app = new Koa();
app.use(async (ctx) => {
  ctx.body = 'Hello World';
});
http.createServer(app.callback()).listen(3000);
```

# 创建一个http2服务

想当然的我们可能会首先尝试使用一下代码创建一个http2服务

```js
const http2 = require('node:http2');
const Koa = require('koa');
const app = new Koa();
app.use(async (ctx) => {
  ctx.body = 'Hello World';
});
http2.createServer(app.callback()).listen(3000);
```

但是这样的代码会并不支持浏览器访问，没有已知的浏览器支持未加密的 HTTP/2，因此在与浏览器客户端通信时必须使用 `http2.createSecureServer()` ,但是createSecureServer需要证书和密钥，

为了此示例生成证书和密钥，我们可以运行：

```shell
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```

我们的代码就变成了这样

```js
const http2 = require('node:http2');
const Koa = require('koa');
const app = new Koa();
app.use(async (ctx) => {
  ctx.body = 'Hello World';
});
http2.createSecureServer({
  key: readFileSync(`${__dirname}/localhost-privkey.pem`),
  cert: readFileSync(`${__dirname}/localhost-cert.pem`),
}, app.callback()).listen(3000);
```

接着我们打开浏览器尝试访问：`http://localhost:3000/`, 但是我们的服务器返回了一个错误，`server ERR_EMPTY_RESPONSE`这是因为我们需要使用`https://localhost:3000/`访问http2服务，这时打开谷歌调试窗口我们可以看到请求的`Protocol`为`h2`,我们也可以使用以下命令验证

```
curl -vso /dev/null --http2 https://localhost:3000/
```

我们可以看到类似信息

```
* ALPN, offering h2
* ALPN, offering http/1.1
```

# 让 Chrome 接受自签名的 localhost 证书

对于自签名的证书Chrome会仍然坚持认证证书不可信，可以通过下面的方式让chrome接受自签名的证书（仅限localhost的证书）

```
chrome://flags/#allow-insecure-localhost
```
