---
title: "node Promise 转换"
tags: ["Node.js"]
date: "2021-07-09"
---

如果你曾经使用 Javascript，你必须有经验的回调。Javascript 以其内置的异步哲学而闻名。从标准内置模块到其他框架和库，回调无处不在。这就是在 Javascript 中完成异步编程。但是回调有一个黑暗的一面。这叫 Callback Hells。

回调地狱的解决方案是 Promises。而不是通过回调同步返回值或传递结果，我们可以返回一个 Promise，我们将来会返回一些值或错误。 有许多像好的库如 Bluebird 和 Q 可以用来处理 Promise。但是内置的模块和很多其他库不能使用 Promises。这些库能够将传统的回调方法转换为 Promise，在 Node v8 中我们现在可以使用 util.promisify 来处理回调方法。根据 Node.js 的文档：
util.promisify(original)

- original <Function>
- Returns: <Function>

```js
const util = require("util");
const fs = require("fs");

const stat = util.promisify(fs.stat);
stat(".")
  .then((stats) => {
    // Do something with `stats`
  })
  .catch((error) => {
    // Handle the error.
  });

或者;

const util = require("util");
const fs = require("fs");

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat(".");
  console.log(`This directory is owned by ${stats.uid}`);
}
```

看传统的例子：

```js
const fs = require('node:fs');
fs.readFile('./index.js', 'utf8', (err, text) => {
  if (err) {
    console.log('Error', err);
  } else {
    console.log(text);
  }
});
```

现在这个例子可以用 Promises 写成如下：

```js
const fs = require('node:fs');
const util = require('node:util');
const readFile = util.promisify(fs.readFile);
readFile('./index.js', 'utf8')
  .then((text) => {
    console.log(text);
  })
  .catch((err) => {
    console.log('Error', err);
  });
```

在这里我们习惯于 util.promisify 将 fs.readFile 转换为基于 promise 的方法。现在，而不是采取回调，readFile 方法作为一个 pormise。promise 有两个方法，then 和 catch。then 如果函数调用成功，则用于获取结果。而 catch 用于捕获错误。Promise 的优点在于，我们可以使用异步的链式写法而不会陷入回调地狱

结合 async 和 await 关键字，promise 可以更容易处理。链式太长的话也会使程序难于阅读。async 和 await 使它看起来更清洁。以下是 Async＆Await 的上面的例子：

```js
const fs = require('node:fs');
const util = require('node:util');
const readFile = util.promisify(fs.readFile);
(async function () {
  try {
    const text = await readFile('./index.js', 'utf8');
    console.log(text);
  } catch (err) {
    console.log('Error', err);
  }
})();
```

## 异步函数改为回调

回调是异步执行的，并且具有有限的堆栈跟踪。如果回调抛出，则进程将发出一个'uncaughtException' 事件，如果未处理则将退出

```js
util.callbackify(original)
original <Function> An async function
Returns: <Function> a callback style function

const util = require('util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
