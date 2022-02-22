---
title: "了解什么是polyfill"
tags: ['js', 'polyfill']
date: '2021-07-09'
---

# 什么是polyfill
初次了解polyfill这个词,是在一次面试中，题目是`使用数组的reduse方式实现map方法`，全世界使用着许多不同的浏览器和版本的浏览器，每个浏览器都具有与其他浏览器完全不同的功能集。这会使浏览器开发成为一项艰巨的任务。流行浏览器的最新版本可以完成许多旧浏览器无法完成的任务-但您可能仍必须支持旧浏览器。通过尝试使用polyfills重新创建缺少的功能，Polyfill.io使支持不同的浏览器变得更简单：您可以在支持或不支持的浏览器中利用最新和最强大的功能。

如vue中对bind的polyfill代码如下
```js
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}
var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;
```

# 常用对polyfill方法

## babel-polyfill
提供完整的ES2015+环境

## polyfill.io
polyfill.io它是一个接口，它接受一组浏览器功能的请求，并仅返回请求浏览器所需的polyfill