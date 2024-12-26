---
title: koa跨域
tags: ['Koa']
date: '2021-07-09'
---

## 跨域

## 为什么会有跨域问题？

这是浏览器的同源策略所造成的，同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。这是一个用于隔离潜在恶意文件的重要安全机制。

> 一定要注意跨域是浏览器的限制，其实你用抓包工具抓取接口数据，是可以看到接口已经把数据返回回来了，只是浏览器的限制，你获取不到数据。用postman请求接口能够请求到数据。这些再次印证了跨域是浏览器的限制。

## 如何解决跨域?

- jsonp: 带有src属性的标签都可以用来， 但是只能处理GET请求
- document.domain + iframe跨域
- location.hash + iframe
- window.name + iframe
- postMessage跨域
- Nginx配置反向代理
- CORS（跨域资源共享）：支持所有类型的HTTP请求 相信大家对于以上的解决方法都很熟悉，这里不再对每一种方法展开讲解，接下来主要讲一下CORS；

## 简单请求和非简单请求

浏览器将**CORS跨域请求**分为简单请求和非简单请求；

> 如果你使用nginx反向代理解决的跨域问题，则不会有跨域请求这个说法了，因为nginx反向代理就使得前后端是同一个域了，就不存在跨域问题了。

只要同时满足一下两个条件，就属于简单请求 (1)使用下列方法之一：

- head
- get
- post

(2)请求的Heder是

- Accept
- Accept-Language
- Content-Language
- Content-Type: 只限于三个值：
  - application/x-www-form-urlencoded
  - multipart/form-data
  - text/plain

不同时满足上面的两个条件，就属于非简单请求。 浏览器对这两种的处理，是不一样的。

## 简单请求

### 例子

对于简单请求，浏览器直接发出CORS请求。具体来说，就是头信息之中，增加一个Origin字段。

![简单请求](https://user-gold-cdn.xitu.io/2019/6/24/16b873283da2fb58?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

 上面这个例子，`post``Content-Type``application/x-www-form-urlencoded``Access-Control-Allow-Origin: http://127.0.0.1:3000``Origin``Origin`

### CORS请求相关的字段，都以 `Access-Control-`开头

- Access-Control-Allow-Origin

  ：必选

  - 请求头`Origin`字段的值
  - `*`：接受任何域名

- Access-Control-Allow-Credentials

  ：可选，

  - true: 表示允许发送cookie，此时`Access-Control-Allow-Origin`不能设置为`*`，必须指定明确的，与请求网页一致的域名。
  - 不设置该字段：不需要浏览器发送cookie

- Access-Control-Expose-Headers

  ：可选

  - 响应报头指示哪些报头可以公开为通过列出他们的名字的响应的一部分。默认情况下，只显示6个简单的响应标头：
    - Cache-Control
    - Content-Language
    - Content-Type
    - Expires
    - Last-Modified
    - Pragma
  - 如果想要让客户端可以访问到其他的首部信息，可以将它们在 Access-Control-Expose-Headers 里面列出来。

### withCredentials 属性

CORS请求默认不发送Cookie和HTTP认证信息，如果要把Cookie发到服务器，一方面需要服务器同意，设置响应头`Access-Control-Allow-Credentials: true`,另一方面在客户端发出请求的时候也要进行一些设置;

```
// XHR
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/', true);
xhr.withCredentials = true;
xhr.send(null);

// Fetch
fetch(url, {
  credentials: 'include'
})
复制代码
```

## 非简单请求

非简单请求就是那种对服务器有特殊要求的请求，比如请求方法为`PUT`或`DELETE`，或者`Content-Type`字段为`application/json`;

### 1. 预检请求和回应

非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为“预检”请求； 浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段，只有得到肯定答复，浏览器才会发出正式的接口请求，否则就会报错；

![preflight](https://user-gold-cdn.xitu.io/2019/6/24/16b873283c9ccfc8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

HTTP请求的方法是POST，请求头`Content-Type`字段为`application/json`。浏览器发现，这是一个非简单请求，就自动发出一个`预检`请求，要求服务器确认可以这样请求。

#### 1.1预检请求

`预检`请求用的请求方法是OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是`Origin`，表示请求来自哪个域。 除了`Origin`，`预检`请求的头信息包括两个特殊字段：

- [Access-Control-Request-Method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Method)： 必选，用来列出浏览器的CORS请求会用到哪些HTTP方法，上例是`POST`
- [Access-Control-Request-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Request-Headers)：该字段是一个用逗号分割的字符串，执行浏览器CORS请求会额外发送的头信息字段，上例是`Content-Type`;

#### 1.2预检回应

服务器收到`预检`请求以后，检查了`Origin`、`Access-Control-Request-Method`和`Access-Control-Request-Headers`字段以后，确认允许跨域请求，就可以做出回应。 上面的HTTP回应中，关键的是Access-Control-Allow-Origin字段，表示<http://127.0.0.1:3000>可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。

如果浏览器否定了“预检”请求，就会返回一个正常的HTTP回应，但是没有任何CORS相关的头信息字段，这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被XMLHttpRequest对象的onerror回调函数捕获h。

服务器回应的其他CORS字段

- [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods)：必需；它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的方法。这是为了避免多次`预检`请求。
- [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers)：如果浏览器请求头里包括`Access-Control-Request-Headers`字段，则`Access-Control-Allow-Headers`字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在`预检`中请求的字段。
- [Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials)：与简单请求时含义相同。
- [Access-Control-Allow-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age): 可选，用来指定本次预检请求的有效期。单位为秒。在有效期内，不用发出另一条预检请求

### 2.正常请求和回应

一旦服务器通过了`预检`请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个`Origin`头信息字段。服务器的回应，也都会有一个`Access-Control-Allow-Origin`头信息字段；

![normal](https://user-gold-cdn.xitu.io/2019/6/24/16b873283cd30bd2?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 服务端如何设置CORS

## 单独接口单独处理

比如一个简单的登录页面，需要给接口接口传入 username和password 两个字段；前端的域名为 localhost:8900，后端的域名为 localhost:3200，构成跨域。

### 1. 如果设置请求头`'Content-Type': 'application/x-www-form-urlencoded'`，这种情况则为简单请求

会有跨域问题，直接设置 响应头 `Access-Control-Allow-Origin`为`*`, 或者具体的域名；注意如果设置响应头`Access-Control-Allow-Credentials`为`true`，表示要发送`cookie`，则此时`Access-Control-Allow-Origin`的值不能设置为星号，必须指定明确的，与请求网页一致的域名。

```
const login = ctx => {
    const req = ctx.request.body;
    const userName = req.userName;
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.response.body = {
        data: {},
        msg: '登陆成功'
    };
}
复制代码
```

### 2. 如果设置请求头`'Content-Type': 'application/json'`，这种情况则为非简单请求

处理OPTIONS请求，服务端可以单独写一个路由，来处理`login`的OPTIONS的请求

```
app.use(route.options('/login', ctx => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.status = 204;

}));
复制代码
```

大家都知道前端调用服务端的时候，会调用很多个接口，并且每个接口处理跨域请求的逻辑是完全一样的，我们可以把这部分抽离出来，作为一个中间件；

## 写一个中间件进行处理

### 首先了解一下koa中间件的“洋葱圈”模型

![洋葱圈](https://user-gold-cdn.xitu.io/2019/6/24/16b873283dddc80b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

将洋葱的一圈看做是一个中间件，直线型就是从第一个中间件走到最后一个，但是洋葱圈就很特殊了，最早use的中间件在洋葱最外层，开始的时候会按照顺序走到所有中间件，然后按照倒序再走一遍所有的中间件，相当于每个中间件都会进入两次，这就给了我们更多的操作空间。

```
const Koa = require("koa");
const app = new Koa();
app.use((ctx, next) => {
    console.log('a - 1');
    next();
    console.log('a - 2');
})
app.use((ctx, next) => {
    console.log('b - 1');
    next();
    console.log('b - 2');
})
app.use((ctx, next) => {
    console.log('c - 1');
    next();
    console.log('c - 2');
})

app.listen(3200, () => {
    console.log('启动成功');
});

复制代码
```

输出

```
a - 1
b - 1
c - 1
c - 2
b - 2
a - 2
复制代码
```

Koa官方文档上把外层的中间件称为“上游”，内层的中间件为“下游”。 一般的中间件都会执行两次，调用`next`之前为一次，调用`next`时把控制按顺序传递给下游的中间件。当下游不再有中间件或者中间件没有执行 `next` 函数时，就将依次恢复上游中间件的行为，让上游中间件执行 `next`之后的代码；

### 处理跨域的中间件简单示例

```
const Koa = require("koa");
const app = new Koa();
const route = require('koa-route');
var bodyParser = require('koa-bodyparser');

app.use(bodyParser()); // 处理post请求的参数

const login = ctx => {
    const req = ctx.request.body;
    const userName = req.userName;
    const expires = Date.now() + 3600000; // 设置超时时间为一小时后

    var payload = {
        iss: userName,
        exp: expires
    };
    const Token = jwt.encode(payload, secret);
    ctx.response.body = {
        data: Token,
        msg: '登陆成功'
    };
}

// 将公共逻辑方法放到中间件中处理
app.use((ctx, next)=> {
    const headers = ctx.request.headers;
    if(ctx.method === 'OPTIONS') {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Authorization');
        ctx.status = 204;
    } else {
        next();
    }
})
app.use(route.post('/login', login));

app.listen(3200, () => {
    console.log('启动成功');
});

复制代码
```

上述[示例代码地址](https://github.com/funnycoderstar/demos/tree/master/koa/koa-cors)

## @koa/cors是怎么实现的

```
'use strict';

const vary = require('vary');

/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 * @return {Function} cors middleware
 * @api public
 */
module.exports = function (options) {
    const defaults = {
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    };
    // 默认的配置项和使用时设置的options进行一个融合
    options = Object.assign({}, defaults, options);

    // 因为函数的一些参数，exposeHeaders，allowMethods，allowHeaders的形式既可以是String,也可以是Array类型，
    // 如果是Array类型,也转换为用逗号分隔的字符串。
    if (Array.isArray(options.exposeHeaders)) {
        options.exposeHeaders = options.exposeHeaders.join(',');
    }

    if (Array.isArray(options.allowMethods)) {
        options.allowMethods = options.allowMethods.join(',');
    }

    if (Array.isArray(options.allowHeaders)) {
        options.allowHeaders = options.allowHeaders.join(',');
    }

    if (options.maxAge) {
        options.maxAge = String(options.maxAge);
    }

    options.credentials = !!options.credentials;
    options.keepHeadersOnError = options.keepHeadersOnError === undefined || !!options.keepHeadersOnError;

    return async function cors(ctx, next) {
        // If the Origin header is not present terminate this set of steps.
        // The request is outside the scope of this specification.
        const requestOrigin = ctx.get('Origin');

        // Always set Vary header
        // https://github.com/rs/cors/issues/10
        ctx.vary('Origin');
        // 如果请求头不存在 origin，则直接跳出该中间件，执行下一个中间件
        if (!requestOrigin) return await next();

        // 对origin参数的不同类型做一个处理
        let origin;
        if (typeof options.origin === 'function') {
            origin = options.origin(ctx);
            if (origin instanceof Promise) origin = await origin;
            if (!origin) return await next();
        } else {
            origin = options.origin || requestOrigin;
        }

        const headersSet = {};

        function set(key, value) {
            ctx.set(key, value);
            headersSet[key] = value;
        }
        /**
        * 非OPTIONS请求的处理
        *
        */

        if (ctx.method !== 'OPTIONS') {
            // Simple Cross-Origin Request, Actual Request, and Redirects
            set('Access-Control-Allow-Origin', origin);

            if (options.credentials === true) {
                set('Access-Control-Allow-Credentials', 'true');
            }

            if (options.exposeHeaders) {
                set('Access-Control-Expose-Headers', options.exposeHeaders);
            }

            if (!options.keepHeadersOnError) {
                return await next();
            }
            try {
                return await next();
            } catch (err) {
                const errHeadersSet = err.headers || {};
                const varyWithOrigin = vary.append(errHeadersSet.vary || errHeadersSet.Vary || '', 'Origin');
                delete errHeadersSet.Vary;

                err.headers = Object.assign({}, errHeadersSet, headersSet, {
                    vary: varyWithOrigin
                });

                throw err;
            }
        } else {
            // Preflight Request

            // If there is no Access-Control-Request-Method header or if parsing failed,
            // do not set any additional headers and terminate this set of steps.
            // The request is outside the scope of this specification.
            if (!ctx.get('Access-Control-Request-Method')) {
                // this not preflight request, ignore it
                return await next();
            }

            ctx.set('Access-Control-Allow-Origin', origin);

            if (options.credentials === true) {
                ctx.set('Access-Control-Allow-Credentials', 'true');
            }

            if (options.maxAge) {
                ctx.set('Access-Control-Max-Age', options.maxAge);
            }

            if (options.allowMethods) {
                ctx.set('Access-Control-Allow-Methods', options.allowMethods);
            }

            let allowHeaders = options.allowHeaders;
            if (!allowHeaders) {
                allowHeaders = ctx.get('Access-Control-Request-Headers');
            }
            if (allowHeaders) {
                ctx.set('Access-Control-Allow-Headers', allowHeaders);
            }

            ctx.status = 204;
        }
    };
};
复制代码
```

以上是 [@koa/cors](https://github.com/koajs/cors/blob/master/index.js) V3.0.0的源码实现，如果你真正理解的CORS，看源码的逻辑就会非常轻松。

主要是分两个逻辑来处理，有预检请求的和没有预检请求的。

对于非OPTIONS请求的处理，要根据情况加上 `Access-Control-Allow-Origin`，`Access-Control-Allow-Credentials`，`Access-Control-Expose-Headers`这三个响应头部；

对于OPTIONS请求（预检请求）的处理，要根据情况加上 `Access-Control-Allow-Origin`，`Access-Control-Allow-Credentials`，`Access-Control-Max-Age`，`Access-Control-Allow-Methods`，`Access-Control-Allow-Headers`这几个响应头部；
