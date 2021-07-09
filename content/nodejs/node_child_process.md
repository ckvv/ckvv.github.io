---
title: node中的多进程
tags: ['node']
---
javascript是单线程的并且只在一个进程中跑，

## child_process
child_process 模块提供了衍生子进程的能力，此功能主要由 child_process.spawn() 函数提供：
```javascript
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});
ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});
ls.on('close', (code) => {
  console.log(`子进程退出，使用退出码 ${code}`);
});
```
child_process.spawn() 方法异步地衍生子进程，且不阻塞 Node.js 事件循环。 child_process.spawnSync() 函数则以同步的方式提供了等效的功能，但会阻塞事件循环直到衍生的进程退出或终止。为方便起见， child_process 模块提供了 child_process.spawn() 和 child_process.spawnSync() 的一些同步和异步的替代方法。 这些替代方法中的每一个都是基于 child_process.spawn() 或 child_process.spawnSync() 实现的。

- [`child_process.spawn()`]: 方法使用给定的 command 衍生一个新进程，并带上 args 中的命令行参数。 如果省略 args，则其默认为一个空数组。
- [`child_process.exec()`]: 衍生一个 shell 然后在该 shell 中执行 command，并缓冲任何产生的输出。
- [`child_process.execFile()`]: 类似于 child_process.exec()，但默认情况下不会衍生 shell。 相反，指定的可执行文件 file 会作为新进程直接地衍生，比 child_process.exec() 稍微更高效，由于没有衍生 shell，因此不支持 I/O 重定向和文件通配(模糊搜索文件)等行为。
- [`child_process.fork()`]: 衍生一个新的 Node.js 进程，并调用一个指定的模块，该模块已建立了 IPC 通信通道，允许在父进程与子进程之间发送消息。
- [`child_process.execSync()`]): [`child_process.exec()`]的同步版本，将会阻塞 Node.js 事件循环。
- [`child_process.execFileSync()`]: [`child_process.execFile()`]的同步版本，将会阻塞 Node.js 事件循环。

fork执行程序的示例：
```javascript
// compute.js
const longComputation = (count) => {
    let sum = 0;
    for (let i = 0; i < count; i++) {
        sum += i;
    };
    return sum;
};

process.on('message', message => {
    // 需要先进行序列号
    let count = Number(message);
    const result = longComputation(count);
    process.send(result);
});

// app.js
const compute = fork(path.join(__dirname, './compute.js'));
compute.send('start');
let asfun = () => new Promise(resolve => {
    compute.on('message', result => {
        resolve(result)
    });
});
let result = await asfun();
```
## **TIPS**
fork衍生的 Node.js 子进程独立于父进程，但两者之间建立的 IPC 通信通道除外。 每个进程都有自己的内存(10m左右)，带有自己的 V8 实例。 由于需要额外的资源分配，因此不建议衍生大量的 Node.js 子进程。

## worker_threads
worker_threads模块允许使用并行执行JavaScript的线程,worker_threads对于执行CPU密集型JavaScript操作非常有用。他们在I / O密集型工作中无济于事。 Node.js的内置异步I / O操作比Workers效率更高。
与child_process或cluster不同，worker_threads可以共享内存。它们通过传输ArrayBuffer实例或共享SharedArrayBuffer实例来实现。
```javascript
// compute.js
const {
    parentPort
} = require('worker_threads');

const longComputation = (count) => {
    let sum = 0;
    for (let i = 0; i < count; i++) {
        sum += i;
    };
    return sum;
};
parentPort.on('message', (msg) => {
    // 不需要先进行序列号
    const result = longComputation(msg);
    parentPort.postMessage({
        [msg]: result
    });
})

// app.js
const worker = new Worker(path.join(__dirname, './fork/com_worker.js'), {
    workerData: null
});
worker.postMessage('msg');
let asfun = () => new Promise(resolve => {
    worker.on('message', result => {
        resolve(result)
    });
});
let result = await asfun();
```
上面生成了一个Worker线程，通常我们需要创建一个工作者池。否则，创建Workers的开销可能会超出其收益
```javascript
const workerpool = require('workerpool');
const pool = workerpool.pool();

const longComputation = (count) => {
    let sum = 0;
    for (let i = 0; i < count; i++) {
        sum += i;
    };
    return sum;
};

pool.exec(longComputation,[count]);
```

#总结一下
Worker线程相对于传统的生成子进程的方式更删除与主进程的通信，并且不开启一个node实例，占用更小的内存;
fork太多子进程会导致内存爆炸，或者Too many open files in system（打开的文件/socket连接数量超过系统设定值的错误）。
