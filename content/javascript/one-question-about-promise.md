---
title: "一个关于Promise的问题"
tags: ["JavaScript"]
date: "2021-07-09"
---

## 一道题带来的疑问

[掘金](https://juejin.im/post/5d37e392f265da1ba252a226)上的一道题：
JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个，一个解法如下：

```js
function timeout(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
class Scheduler {
  constructor() {
    this.awaitArr = [];
    this.count = 0;
  }

  async add(promiseCreator) {
    if (this.count >= 2) {
      await new Promise((resolve) => {
        this.awaitArr.push(resolve);
      });
    }
    this.count++;
    const res = await promiseCreator();
    this.count--;

    if (this.awaitArr.length) {
      this.awaitArr.shift()();
    }
    return res;
  }
}
const scheduler = new Scheduler();
function addTask(time, order) {
  scheduler.add(() => timeout(time)).then(() => console.log(order));
}
addTask(1000, '1000');
addTask(500, '500');
addTask(400, '400');
addTask(300, '300');
// 输出
// 500
// 400
// 1000
// 300
```

初看有些懵，`this.awaitArr.push(resolve);`，好奇为什么不是吧`promiseCreator`push 进去，仔细看下这个 Promise 里面的函数没有执行 resolve 函数，只是把 resolve 函数 push 进数组了。那么问题来了！

## 如果 Promise 的 resolve, reject 没有执行会怎么样？

执行以下代码

```js
let tAsync = async function () {
    console.log(`----->`)
    await new Promise(() => {});
    console.log(`<-----`)
};

tAsync();
//输出
----->
```

发现程序执行结束后并没有输出`<-----`,

根据 Promise 定义[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise):

```js
new Promise( function(resolve, reject) {...} /* executor */  );
```

executor 是带有 resolve 和 reject 两个参数的函数。
Promise 构造函数执行时立即调用 executor 函数，resolve 和 reject
两个函数作为参数传递给 executor（executor 函数在 Promise 构造函数返回所建 promise 实例对象前被调用）。resolve 和 reject 函数被调用时，分别将 promise 的状态改为 fulfilled（完成）或 rejected（失败）。如果在 executor 函数中抛出一个错误，那么该 promise 状态为 rejected。executor 函数的返回值被忽略。

看来由于 await 使异步功能的执行被暂停，直到 Promise 被解决（resolve 或 reject），并在实现后恢复执行异步功能。由于该 Promise 一直没有调用 resolve 和 reject 导致下面的程序无法执行。看到这又有个疑问？

## 在 Promise 的外部执行 resolve, reject 可以改变 Promise 的状态吗？

我们看到解法中的 resolve 在 Promise 外部被执行，这样是否可以改变 Promise 的状态呢？
将上面代码改造一下，验证看看：

```js
let waitf = null;
const tAsync = async function () {
  console.log(`----->`);
  await new Promise((resolve) => {
    waitf = resolve;
  });
  console.log(`<-----`);
};
tAsync();
waitf();

// 输出
// ----->
// <-----
```

## 结论

这时再回头看看上面的代码就容易理解了

- 当前执行并发大于 2 时，生成一个暂停的 Promise，把 resolve 添到一个数组中，下面的代码被暂停执行
- 当前执行并发不大于 2,立即执行异步操作并从数组中弹出最先 push 的 resolve 改变 Promise 的状态，
- 由于 Promise 被解决，最初被暂停的代码可以继续执行
