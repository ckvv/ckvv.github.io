---
title: 深入理解UUID
tag: 'uuid'
date: '2021-07-09'
---

# UUID是什么

UUID[Universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) 是一种唯一的字符串，用来标识一个设备或一个应用程序的唯一性。根据标准方法生成时，UUID 出于实用目的是唯一的。与大多数其他编号方案不同，它们的唯一性不依赖于中央注册机构或生成它们的各方之间的协调。虽然UUID 被复制的概率不是零，但它足够接近零，可以忽略不计.

UUID是固定长度128位，表示为 32 个十六进制（base-16）数字，显示在由连字符分隔的五组中，格式为 8-4-4-4-12 总共 36 个字符（32 个十六进制字符和 4 个连字符）例如：

`123e4567-e89b-12d3-a456-426614174000`
`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx`

数字的四位M是 UUID 版本（version），数字的 1 到 3 位最高有效位是NUUID的变体（variant），在示例中，M是1，N是a(10xx 2 )，这意味着这是一个version-1、variant-1 的 UUID。

## 变体（variant）

UUID的变体（variant）字段，占1或2或3比特。RFC 4122定义了4种变体：

+ 变体 0 (形如0xxx), 用于向后兼容已经过时的1988年开发的 Apollo 网络计算系统（NCS）1.5 UUID 格式.
+ 变体 1 (形如10xx), 它是按照大端序作为二进制存储与传输
+ 变体 2 (形如110x), 它是按照小端序作为二进制存储与传输
+ 变体 3 (形如111x), 保留未使用

UUID的编码有很多种下面我只介绍Version 4 (random)，

## 版本（version）

对于“变体（variants）1、2，标准中定义了五个版本（versions），在特定用例中每个版本可能比其他版本更合适。版本由 M 字符串中指示。

+ 版本1 - UUID 是根据时间和 节点ID（通常是MAC地址）生成；
+ 版本2 - UUID是根据标识符（通常是组或用户ID）、时间和节点ID生成；
+ 版本3、版本5 - 确定性UUID 通过散列（hashing）名字空间（namespace）标识符和名称生成；
+ 版本4 - UUID 使用随机性或伪随机性生成。

# UUID的实现

浏览器提供了(`crypto.randomUUID()`)[https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID] 用来生成UUID（version：4，variants：1），对于node也提供了对应接口,

它的实现相当简单

+ 生成 128 个随机位
+ 用正确的版本和变体信息覆盖其中的一些位
+ 将 128 位转换为十六进制表示并插入连字符以实现规范文本表示。

> version位生成: `& 0x0f | 0x40`, `0x0f`的二进制表示`00001111`, `0x40`的二进制表示`01000000`, `xxxxxxxx & 00001111`即转换为`0000xxxx`, `0000xxxx | 01000000`即转换为`0100xxxx`,
> variants位生成: `& 0x3f | 0x80`, `0x3f`的二进制表示`00111111`, `0x80`的二进制表示`10000000`, `xxxxxxxx & 00111111`即转换为`00xxxxxx`, `00xxxxxx | 10000000`即转换为`10xxxxxx`

代码部分

```js
const {
  getRandomValues
} = require('crypto').webcrypto

// 缓存数据
const _data = new Uint8Array(16);
const _hex = [...new Array(256)].map((val, index) => index.toString(16).padStart(2, '0'));

function uuidv4() {
  // 给定的 typedArray 填充随机值
  getRandomValues(data);
  // set version bits
  data[6] = (data[6] & 0x0f) | 0x40;
  data[8] = (data[8] & 0x3f) | 0x80;
  return `${hex[data[0]]}${hex[data[1]]}${hex[data[2]]}${hex[data[3]]}`
  + `-${hex[data[4]]}${hex[data[5]]}`
  + `-${hex[data[6]]}${hex[data[7]]}`
  + `-${hex[data[8]]}${hex[data[9]]}`
  + `-${hex[data[10]]}${hex[data[11]]}${hex[data[12]]}${hex[data[13]]}${hex[data[14]]}${hex[data[15]]}`;
}
```
