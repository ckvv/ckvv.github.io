---
title: 展开语法和剩余参数
tags: ['js']
---

## 展开语法
展开语法(Spread syntax),只能用于可迭代对象, 可以在函数调用/数组构造时, 将数组表达式或者string在语法层面展开；还可以在构造字面量对象时, 将对象表达式按key-value的方式展开

```js
a={name: "mdn"}
b=[1,2,3]
console.log({...a})
console.log([...b])

//函数参数
function sum(x, y, z) {
  return x + y + z;
}
const numbers = [1, 2, 3];
console.log(sum(...numbers));
console.log(sum.apply(null, numbers));

//构造
var parts = ['shoulders', 'knees']; 
var lyrics = ['head', ...parts, 'and', 'toes']; 
// ["head", "shoulders", "knees", "and", "toes"]

var obj1 = { foo: 'bar', x: 42 };
var obj2 = { foo: 'baz', y: 13 };
var clonedObj = { ...obj1 };
var mergedObj = { ...obj1, ...obj2 };
```

## 剩余参数
剩余参数语法允许我们将一个不定数量的参数表示为一个数组。如果函数的最后一个命名参数以...为前缀，则它将成为一个由剩余参数组成的真数组，其中从0（包括）到theArgs.length（排除）的元素由传递给函数的实际参数提供。

```js
function sum(...theArgs) {
  return theArgs.reduce((previous, current) => {
    return previous + current;
  });
}

console.log(sum(1, 2, 3));
// expected output: 6

console.log(sum(1, 2, 3, 4));
// expected output: 10
```

## 剩余参数和 arguments对象之间的区别主要有三个
+ 剩余参数只包含那些没有对应形参的实参，而 arguments 对象包含了传给函数的所有实参。
+ arguments对象不是一个真正的数组，而剩余参数是真正的 Array实例，也就是说你能够在它上面直接使用所有的数组方法，比如 sort，map，forEach或pop。
+ arguments对象还有一些附加的属性 （如callee属性）。