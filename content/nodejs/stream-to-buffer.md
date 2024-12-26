---
title: nodejs stream to buffer
tag: ['Node.js']
date: '2023-12-18'
---

```js
/**
 *
 * @param {ReadableStream} stream
 */
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const buffers = [];

    stream.on('data', (chunk) => {
      buffers.push(chunk);
    });
    stream.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}
```

## asyncIterator

[stream](https://nodejs.org/api/stream.html#readablesymbolasynciterator)实现了[异步迭代协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)所以
```js
/**
 *
 * @param {ReadableStream} stream
 */
async function streamToBuffer2(stream) {
  const buffers = [];
  for await (const data of stream) {
    buffers.push(data);
  }

  return Buffer.concat(buffers);
}
```

或者 `Array.fromAsync`

```js
Buffer.concat(await Array.fromAsync(stream));
```
