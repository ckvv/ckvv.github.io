---
title: "一个关于Promise的问题"
tags: ['js']
date: '2021-07-09'
---


## 一道题带来的疑问

[掘金](https://juejin.im/post/5d37e392f265da1ba252a226)上的一道题：
JS实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个，一个解法如下：

```js
const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
});
class Scheduler {
    constructor() {
        this.awaitArr = [];
        this.count = 0;
    }
    async add(promiseCreator) {

        if (this.count >= 2) {
            await new Promise(resolve => {
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
const scheduler = new Scheduler()
const addTask = (time, order) => {
    scheduler.add(() => timeout(time))
        .then(() => console.log(order))
}
addTask(1000, '1000')
addTask(500, '500')
addTask(400, '400')
addTask(300, '300')
// 输出
// 500
// 400
// 1000
// 300
```

初看有些懵，`this.awaitArr.push(resolve);`，好奇为什么不是吧`promiseCreator`push进去，仔细看下这个Promise里面的函数没有执行resolve函数，只是把resolve函数push进数组了。那么问题来了！

## 如果Promise的resolve, reject没有执行会怎么样？

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

根据Promise定义[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise):

```js
new Promise( function(resolve, reject) {...} /* executor */  );
```

executor是带有 resolve 和 reject 两个参数的函数。
Promise构造函数执行时立即调用executor 函数，resolve和reject
两个函数作为参数传递给executor（executor 函数在Promise构造函数返回所建promise实例对象前被调用）。resolve 和 reject 函数被调用时，分别将promise的状态改为fulfilled（完成）或rejected（失败）。如果在executor函数中抛出一个错误，那么该promise 状态为rejected。executor函数的返回值被忽略。

看来由于await使异步功能的执行被暂停，直到Promise被解决（resolve或reject），并在实现后恢复执行异步功能。由于该Promise一直没有调用resolve 和 reject导致下面的程序无法执行。看到这又有个疑问？

## 在Promise的外部执行resolve, reject可以改变Promise的状态吗？

我们看到解法中的resolve在Promise外部被执行，这样是否可以改变Promise的状态呢？
将上面代码改造一下，验证看看：

```js
let waitf = null;
let tAsync = async function () {
    console.log(`----->`)
    await new Promise((resolve) => {
       waitf = resolve
    });
    console.log(`<-----`)
};
tAsync();
waitf()

//输出
//----->
//<-----
```

## 结论

这时再回头看看上面的代码就容易理解了

+ 当前执行并发大于2时，生成一个暂停的Promise，把resolve添到一个数组中，下面的代码被暂停执行
+ 当前执行并发不大于2,立即执行异步操作并从数组中弹出最先push的resolve改变Promise的状态，
+ 由于Promise被解决，最初被暂停的代码可以继续执行
