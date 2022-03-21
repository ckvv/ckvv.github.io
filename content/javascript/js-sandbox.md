---
title: 简单谈谈JS中的沙箱
tags: ['js', 'sandbox']
date: '2021-07-09'
---

沙箱(sandbox)是一种安全机制， 为运行中的程序提供的隔离环境。通常是作为一些来源不可信、具破坏力或无法判定程序意图的程序提供实验之用。沙盒通常严格控制其中的程序所能访问的资源，比如，沙盒可以提供用后即回收的磁盘及内存空间。

## JS中沙箱的使用场景

前端JS中也会有应用到沙箱的时候，毕竟有时候你要获取到的是第三方的JS文件或数据？而这数据又是不一定可信的时候，创建沙箱，做好保险工作尤为重要  

+ jsonp：解析服务器所返回的jsonp请求时，如果不信任jsonp中的数据，可以通过创建沙箱的方式来解析获取数据；（TSW中处理jsonp请求时，创建沙箱来处理和解析数据）；
+ 执行第三方js：当你有必要执行第三方js的时候，而这份js文件又不一定可信的时候；
+ 在线代码编辑器：相信大家都有使用过一些在线代码编辑器，而这些代码的执行，基本都会放置在沙箱中，防止对页面本身造成影响；（例如：<https://codesandbox.io/s/new>）
+ vue模板中表达式计算：vue模板中表达式的计算被放在沙盒中，只能访问全局变量的一个白名单，如 Math 和 Date 。你不能够在模板表达式中试图访问用户定义的全局变量  
总而言之：当你要解析或执行不可信的JS的时候，当你要隔离被执行代码的执行环境的时候，当你要对执行代码中可访问对象进行限制的时候，沙箱就派上用场了

## JS沙箱实现

### [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`Function` 构造函数创建一个新的 `Function` 对象。直接调用此构造函数可用动态创建函数，但会遇到和 [`eval`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval) 类似的的安全问题和(相对较小的)性能问题。然而，与 `eval` 不同的是，`Function` 创建的函数只能在全局作用域中运行。

### [eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)

`eval()` 函数会将传入的字符串当做 JavaScript 代码进行执行,`eval()` 是一个危险的函数， 它使用与调用者相同的权限执行代码。如果你用 `eval()` 运行的字符串代码被恶意方（不怀好意的人）修改，您最终可能会在您的网页/扩展程序的权限下，在用户计算机上运行恶意代码。更重要的是，第三方代码可以看到某一个 `eval()` 被调用时的作用域，这也有可能导致一些不同方式的攻击。相似的 [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 就不容易被攻击。

### vm

vm 模块支持在 V8 虚拟机上下文中编译和运行代码。 vm 模块不是一种安全机制。不要使用它来运行不受信任的代码。

```js
const { Script, createContext } = require('vm');

/**
 * 
 * @param {string} code 需要执行的代码, 执行的代码被包括在一个自执行函数中
 * @param {object} context 设置执行代码的上下文对象，默认包含 resolve: 用于代码返回值, reject: 用于代码抛出异常
 * @param {object} options 可选参数
 * @returns 执行代码返回值
 */
async function runScript(code, context = {}, options = {}) {
  return new Promise((resolve, reject) => {
    const { timeout = 120 * 1000, breakOnSigint = true } = options;
    const script = new Script(`(async()=>{${code}})()`);
    script.runInContext(createContext({
      ...context,
      resolve,
      reject,
    }), {
      timeout,
      breakOnSigint,
    });
  });
}
```

### [vm2](https://www.npmjs.com/package/vm2)

vm2 是一个沙箱，可以使用列入白名单的 Node 的内置模块运行不受信任的代码, 它使用内部 VM 模块来创建安全上下文,它使用代理来防止逃离沙箱, 它覆盖了内置的 require 来控制对模块的访问.

## 参考资料

+ [浅析 JavaScript 沙箱](https://mp.weixin.qq.com/s/euHJpS6rcRRqVBIPAnbUHA)
+ [说说JS中的沙箱](https://juejin.cn/post/6844903954074058760)
+ [为 Node.js 应用建立一个更安全的沙箱环境](https://cnodejs.org/topic/5adcd8dfba60fcc66b7b875b)
+ [记一次 Node.js 应用内存暴涨分析](https://fed.taobao.org/blog/taofed/do71ct/nodejs-memory-leak-analyze/)
