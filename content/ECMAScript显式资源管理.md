---
title: "ECMAScript中的显式资源管理"
tags: ['JavaScript']
date: "2025/05/07"
---

[Node 24](https://github.com/nodejs/node/releases/tag/v24.0.0) 今天正式发布了, V8 引擎已更新至 13.6 版本, 其中一个功能包含了`Explicit resource management` 的支持, 该功能是在为了解决软件开发中关于各种资源（内存、I/O 等）的生命周期和管理的常见模式。该模式通常包括资源的分配以及显式释放关键资源的能力。

> 注意该 `API` 较新, 目前只在部分浏览器中可用, 详情参考 https://caniuse.com/mdn-javascript_statements_using

# Explicit resource management 的使用背景

例如, 有一个函数需要创建一个`sqlite` 数据库，对其进行读取和写入等各种操作，然后关闭数据库连接。
```js
import { DatabaseSync } from "node:sqlite";
export function doSomeWork() {
  const db = new DatabaseSync(':memory:');

    // use db...
    // db.exec(`
    //   CREATE TABLE t3(x, y);
    //   INSERT INTO t3 VALUES ('a', 4),
    //                         ('b', 5),
    //                         ('c', 3),
    //                         ('d', 8),
    //                         ('e', 1);
    // `);

    // Close the db
    db.close();
}
```

操作数据库可能抛出异常，所以我们无法保证`db.close()`一定被执行, 所以我们需要额外的 `try/finally` 处理

```js
export function doSomeWork() {
  const db = new DatabaseSync(':memory:');
    try {
      // use file...
    }
    finally {
      // Close the db
      db.close();
    }
}
```
如果还有其他的资源需要释放我们还需要在`finally`块中添加更多清理逻辑,还可能遇到其他麻烦比如说清理资源也可能会抛出异常(资源尚未创建等等), 引入 `Explicit resource management` 就是为了解决此类问题

# Explicit resource management 是什么

```js
export function doSomeWork() {
  using db = new DatabaseSync(':memory:');

  // use file...
}
```

`using` 是一个新关键字，它允许我们声明新的变量，有点像 `const` 。关键区别在于， `using` 声明的变量会在作用域结束时自动调用其清理函数(`Symbol.asyncDispose` 或者 `Symbol.dispose`), `using` 声明会在其包含作用域的最后，或在“提前返回”（例如 `return` 或 `throw n error`）之前执行此清理。它们还会像堆栈一样按照先进后出的顺序进行处理。

```ts
function loggy(id: string): Disposable {
    console.log(`Creating ${id}`);
    return {
        [Symbol.dispose]() {
            console.log(`Disposing ${id}`);
        }
    }
}
function func() {
    using a = loggy("a");
    using b = loggy("b");
    {
        using c = loggy("c");
        using d = loggy("d");
    }
    using e = loggy("e");
    return;
    // Unreachable.
    // Never created, never disposed.
    using f = loggy("f");
}
func();
// Creating a
// Creating b
// Creating c
// Creating d
// Disposing d
// Disposing c
// Creating e
// Disposing e
// Disposing b
// Disposing a
```

# 异常处理

为了应对清理之前和清理过程中的抛出了异常, `SuppressedError` 作为 `Error` 的新子类型。它具有一个 `suppressed` 属性，用于保存最后抛出的错误，以及一个 `error` 属性，用于保存最近抛出的错误。

```ts
class ErrorA extends Error {
    name = "ErrorA";
}
class ErrorB extends Error {
    name = "ErrorB";
}
function throwy(id: string) {
    return {
        [Symbol.dispose]() {
            throw new ErrorA(`Error from ${id}`);
        }
    };
}
function func() {
    using a = throwy("a");
    throw new ErrorB("oops!")
}
try {
    func();
}
catch (e: any) {
    console.log(e.name); // SuppressedError
    console.log(e.message); // An error was suppressed during disposal.
    console.log(e.error.name); // ErrorA
    console.log(e.error.message); // Error from a
    console.log(e.suppressed.name); // ErrorB
    console.log(e.suppressed.message); // oops!
}
```

# DisposableStack & AsyncDisposableStack

如果您希望其他人始终如一地执行拆卸逻辑，使用` Disposable` 和 `AsyncDisposable` 定义类型可以让您的代码更易于使用。浏览器和运行时（例如 Node.js、Deno 和 Bun）中的 API 也可能选择对已经具有清理方法的对象（例如文件句柄、连接等）使用 `Symbol.dispose` 和 `Symbol.asyncDispose`,，但对于你自己的场景来说可能有点很多过度抽象
```ts
class TempFile implements Disposable {
    #path: string;
    #handle: number;
    constructor(path: string) {
        this.#path = path;
        this.#handle = fs.openSync(path, "w+");
    }
    // other methods
    [Symbol.dispose]() {
        // Close the file and delete it.
        fs.closeSync(this.#handle);
        fs.unlinkSync(this.#path);
    }
}

export function doSomeWork() {
    using file = new TempFile(".some_temp_file");
    // use file...
}
```

```ts
class TempFile implements Disposable {
    #path: string;
    #handle: number;
    constructor(path: string) {
        this.#path = path;
        this.#handle = fs.openSync(path, "w+");
    }
    // other methods
    async [Symbol.asyncDispose]() {
        // Close the file and delete it.
        fs.closeSync(this.#handle);
        fs.unlinkSync(this.#path);
    }
}

export async function doSomeWork() {
    await using file = new TempFile(".some_temp_file");
    // use file...
}
```

通过 `DisposableStack` 和 `AsyncDisposableStack` 。这两个对象既可以用于一次性清理，也可以用于任意数量的清理。`DisposableStack` 是一个对象，它拥有多种方法来跟踪 `Disposable` 对象，并且可以为其提供 `DisposableStack` 任意清理工作的函数。

```ts
function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");
    using cleanup = new DisposableStack();

    // 将一个清理回调函数添加到栈顶, 对象被销毁时将执行defer的回调函数
    cleanup.defer(() => {
        fs.closeSync(file);
        fs.unlinkSync(path);
    });
    // use file...
    if (someCondition()) {
        // do some more work...
        return;
    }
    // ...
}
```

# 参考

+ https://github.com/tc39/proposal-explicit-resource-management
+ https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html