---
title: "axios核心源码解读"
tags: ['js']
date: '2021-07-09'
---

转载自[axios 核心源码解读](https://github.com/coconilu/Blog/issues/116)

# 介绍axios

一直在使用axios库，在享受它带来的便利的同时，总感觉不读读它的源码有点对不起它，刚好网上介绍axios源码的文章较少，所以写下这篇文章，权当抛砖引玉。

axios是同构的JavaScript的异步请求库，它可以在浏览器端和NodeJS环境里使用。

VueJS的作者尤大也推荐这个工具，它除了异步请求网络资源功能，还有如下功能：

1. 提供代理功能
2. 提供了拦截器（类似中间件），可以注册在请求发出去之前和收到响应之后的操作
3. 可以获取上传进度和下载进度
4. 提供的adapter选项可以模拟响应数据
5. 自定义引起报错的响应码范围
6. 提供了取消请求的功能

axios的[GitHub地址](https://github.com/axios/axios)。

# 那么，它是怎么办到的呢？

## 首先说说为什么它可以在浏览器端和NodeJS环境中使用

在axios中，使用适配器设计模式来屏蔽平台的差异性，让使用者可以在浏览器端和NodeJS环境中使用同一套API发起http请求。

axios的默认配置里的adapter是通过`getDefaultAdapter()`方法来获取的，它的逻辑如下：

```javascript
function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  }
  return adapter;
}
```

如上面代码，通过判断运行环境的特征来选择不同的API发起http请求。

接下来分别介绍这两个文件——http和xhr。

### http.js

这个文件里，引用了NodeJS的http和https库，用于发出http请求，并使用Promise接收请求结果。

代码的细节不介绍了，就讲个大概的思路，我们都知道发起http请求，最重要的是遵守http协议，书写正确的请求头，而axios就是通过传入`config`接收使用者的一些定制参数，其中包括请求头，请求参数等等，然后在内部使用(http/https).request(options, callback)发起http请求。

具体如何整合、处理传入的参数，还请下载源码看看。

### xhr.js

类似http的逻辑，只不过是调用了WebAPI的XMLHTTPRequest接口发起http请求。

## 拦截器的实现

axios提供了拦截器的功能，可以在请求发起前处理传入的config或者其它操作，也可以在接收完响应后处理response。

我们可以看看Axios的构造函数，很简单：

```javascript
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
```

其中的InterceptorManager维护一个数组，用以收集拦截器函数，有`fulfilled`和`rejected`，分别对应Promise的onSuccess和onFail的回调，接下来看看拦截器和发起http请求是如何结合在一起的，我们看看Axios的原型上的request方法：

```javascript
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```

从上面可以看出，它们结合的方式是使用Promise把拦截器和发起http请求的操作结合起来的，`interceptors.request`会安排在发起http请求的操作前，`interceptors.response`会安排在发起http请求的操作后。

## 上传和下载的进度

axios提供了观察上传和下载进度的功能，不过仅支持在浏览器环境中，核心代码如下：

```javascript
// Handle progress if needed
if (typeof config.onDownloadProgress === 'function') {
  request.addEventListener('progress', config.onDownloadProgress);
}

// Not all browsers support upload events
if (typeof config.onUploadProgress === 'function' && request.upload) {
  request.upload.addEventListener('progress', config.onUploadProgress);
}
```

从上面可以看出，下载进度回调其实就是监听XMLHTTPRequest对象的[progress事件](https://developer.mozilla.org/en-US/docs/Web/Events/progress)，上传进度回调其实就是XMLHTTPRequest对象的upload属性的[progress事件](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload)。

## 模拟响应数据

官方文档里指出这个功能需要开发者返回一个Promise对象并且在Promise里返回一个有效的Response对象：

```javascript
// `adapter` allows custom handling of requests which makes testing easier.
// Return a promise and supply a valid response (see lib/adapters/README.md).
adapter: function (config) {
  /* ... */
}
```

我们可以在源码中找到这个功能的实现方式：

```javascript
var adapter = config.adapter || defaults.adapter;

return adapter(config).then(function onAdapterResolution(response) {
  throwIfCancellationRequested(config);

  // Transform response data
  response.data = transformData(
    response.data,
    response.headers,
    config.transformResponse
  );

  return response;
}, function onAdapterRejection(reason) {
  if (!isCancel(reason)) {
    throwIfCancellationRequested(config);

    // Transform response data
    if (reason && reason.response) {
      reason.response.data = transformData(
        reason.response.data,
        reason.response.headers,
        config.transformResponse
      );
    }
  }

  return Promise.reject(reason);
});
```

从上面可以看出，如果我们在使用axios发出http请求时，如果传入的config对象有adapter属性，这个属性会顶替了默认的adapter（NodeJS的http.request()或XMLHTTPRequest），所以我们需要在config的adapter属性中返回一个Promise，并且这个Promise会返回一个有效的Response对象。

## 自定义引起报错的响应码范围

axios提供了一个功能，可以自定义报错的响应码的范围，可以通过`config.validateStatus`来配置。

默认的范围是200到300之间：

```javascript
validateStatus: function validateStatus(status) {
  return status >= 200 && status < 300;
}
```

而在源码中，这个方法是通过`lib\core\settle.js`来调用的：

```javascript
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};
```

从上面可以看出，settle的入参很像Promise的resolve和reject，接下来，我们看看settle又是在哪里被调用的。

果不其然，在`lib\adapters\http.js`和`lib\adapters\xhr.js`中都看到settle的身影。

细节就不说了，我大致说一下思路，就是axios使用Promise发起http请求后，会把传入Promise对象的函数中的resolve和reject再次传递给settle中，让它来决定Promise的状态是onResolved还是onRejected。

## 取消请求的功能

axios官方文档指出axios提供了取消已经发出去的请求的功能。

> The axios cancel token API is based on the withdrawn [cancelable promises proposal](https://github.com/tc39/proposal-cancelable-promises).

上面引用的话里指出这是一个promise的提议，不过已经被撤回了。

在这里，笔者想说的是，其实不依赖这个提议，我们也可以写一个简单取消请求的功能，只要你熟悉闭包就可以了。

思路是这样的：我们可以使用闭包的方式维护一个是否取消请求的状态，然后在处理Promise的onResolved回调的时候判断一下这个状态，如果状态是需要取消请求的话，就reject结果，大致如下：

```javascript
function dispatchRequest(config) {
  let hasCancled = false;
  return Promise((resolve, reject) => {
    if (hasCancled) {
      reject({ hasCancled: true })
    } else {
      /** 处理正常响应 **/
    }
  })
    .then(/** 其他业务操作 **/)
    .catch(err => {
      if (err.hasCancled) {
        /** 处理请求被取消 */
      }
    })
}
```

# 总结

最后，我们可以大致了解了axios强大的背后原因：使用适配器模式屏蔽了平台差异性，并提供统一的API，使用Promise的链式调用来保证整个请求过程的有序性和增强一些额外的功能。

axios库是一个很精美的第三库，值得我们去读读它的源码。你也会收获很多的。很感谢你能坚持看到这里。
