---
title: koa中间件源码解析
tags: ['koa']
date: '2021-07-09'
---
中间件是koa的核心，koa的中间件机制是一个剥洋葱式的模型，多个中间件通过use放进一个数组队列然后从外层开始执行，遇到next后进入队列中的下一个中间件，所有中间件执行完后开始回帧，执行队列中之前中间件中未执行的代码部分。

## 源码

koa在`koa-compose`中实现了中间件部分，

```javascript
function compose (middleware) {
  // compose首先会对middleware进行参数检验，middleware必须是一个函数数组，

  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    async function dispatch (i) {

      // 多次调用next函数会导致1 <= index
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        // dispatch.bind 是为了注入参数，我们只需调用next即可
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

```

## 解析

## compose函数解析

执行compose函数会返回一个函数，该函数有两个参数，context, next，

+ context是middleware中的第一个参数
+ 可选参数，当所有middleware的next执行后，如果next存在会执行next函数，该参数一般用于koa中设置请求返回值，

## dispatch函数解析

dispatch函数初看有些复杂，其实主要代码是以下两行

```
    let fn = middleware[i]
    fn(context, dispatch.bind(null, i + 1)));
```

dispatch函数作用就是执行第i个中间件，并把dispatch(i+1)作为next参数传给第i个中间件
首次会开始执行参数为i为0的dispatch函数，此时fn为中间件数组的第一个函数，该函数会有两个参数，第一个为context，第二个为dispatch(2)；
所以执行第1个中间件时的如果调用了next参数相当于在执行第二个中间件，依此类推，

## 测试compose函数

注意如果想要中间件next函数后面的内容要在后一个中间件执行结束后执行，`disctxtch`函数及中间件函数必须是async函数,中间件函数调用`next`函数时需要添加`await`，入下：

```javascript
let timeout = async(sec)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },sec);
    })
}
async function t1(ctx, next) {
    console.log('t1:',ctx);
    await next();
    console.log('t1!');
}
async function t2(ctx, next) {
    console.log('t2:',ctx);
    timeout(1000)
    await next()
    console.log('t2!');
}
async function t3(ctx, next) {
    console.log('t3:',ctx);
    await next()
    console.log('t3!');
}

let middleware = [t1,t2,t3];
let tt= compose(middleware);
tt('chen',(ctx)=>{
    console.log('tt',ctx)
});

// 输出

// t1: chen
// t2: chen
//// wait 1 秒
// t3: chen
// tt chen
// t3!
// t2!
// t1!
```

## 其他

源码中compose函数会返回第一个中间件的结果，一般情况下我们如果不需要这个结果，dispatch是不需要返回参数的,所以compose函数可以简化成这样

```javascript
function compose(middleware) {
    return function (context, next) {
        // last called middleware #
        let index = -1
        return disctxtch(0)

        async function disctxtch(i) {
            if (i <= index) throw 'next() called multiple times';
            index = i
            let fn = middleware[i]
            if (i === middleware.length) fn = next
            if (!fn) return ;
            try {
                fn(context, disctxtch.bind(null, i + 1));
            } catch (err) {
                throw err
            }
        }
    }
}
```

compose函数不用递归调用的写法

```javascript
    /**
     * 中间件合并方法，将中间件数组合并为一个中间件
     * createNext函数的作用就是将上一个中间件的next当做参数传给下一个中间件，并且将上下文ctx绑定当前中间件，当中间件执行完，调用next()的时候，其实就是去执行下一个中间件。
     * next的作用是停止运行当前中间件，将控制权交给下一个中间件，执行下一个中间件的next()之前的代码，当下一个中间件运行的代码遇到了next()，又会将代码执行权交给下下个中间件，当执行到最后一个中间件的时候，控制权发生反转，开始回头去执行之前所有中间件中剩下未执行的代码
     * @return {Function}
     */
    compose() {
        // 将middlewares合并为一个函数，该函数接收一个ctx对象
        return async ctx => {

            function createNext(middleware, oldNext) {
                return async () => {
                    await middleware(ctx, oldNext);
                }
            }

            let len = this.middlewares.length;
            let next = async () => {
                return Promise.resolve();
            };
            for (let i = len - 1; i >= 0; i--) {
                let currentMiddleware = this.middlewares[i];
                next = createNext(currentMiddleware, next.bind(null,ctx));
            }

            await next();
        };
    }
```
