---
title: "js的迭代器"
tags: ['JavaScript']
date: '2021-07-09'
---

## 什么是迭代器

ECMAScript 2015的几个补充，并不是新的内置实现或语法，而是协议。这些协议可以被任何遵循某些约定的对象来实现。有两个协议：可迭代协议和迭代器协议。
JavaScript 提供了许多迭代集合的方法，从简单的 for 循环到 map() 和 filter()，迭代器和生成器将迭代的概念直接带入核心语言，并提供了一种机制来自定义 for...of 循环的行为

```js
var myIterator = {
    next: function() {
        // ...
    },
    [Symbol.iterator]: function() { return this }
}
```

## 可迭代协议

为了变成可迭代对象， 一个对象必须实现 @@iterator 方法, 意思是这个对象（或者它原型链 prototype chain 上的某个对象）必须有一个名字是 Symbol.iterator 的属性:
> [Symbol.iterator]
返回一个对象的无参函数，被返回对象符合迭代器协议。

当一个对象需要被迭代的时候（比如开始用于一个for..of循环中），它的@@iterator方法被调用并且无参数，然后返回一个用于在迭代中获得值的迭代器。

```js
class people{
    constructor(index){
        this.index = index;
    }
    next(){
        this.index++;
        return{
            done: this.index > 10,
            value: this.index
        }
    }
    [Symbol.iterator](){
        return this;
    }
}

let a = new people(3);
for (let val of a){
    console.log(val);
}

//缺失[Symbol.iterator]会报错误a is not iterable
```

或者

```javascript
var myIterator = {
    num: 2,
    next: function () {

        return  {
            value: this.num *= 2,
            done: false
        }
    },
    [Symbol.iterator]: function () {
        return this;
    }
}
```

## 迭代器协议

该迭代器协议定义了一种标准的方式来产生一个有限或无限序列的值，并且当所有的值都已经被迭代后，就会有一个默认的返回值。
当一个对象只有满足下述条件才会被认为是一个迭代器：
它实现了一个 next() 的方法并且拥有以下含义：

> next
返回一个对象的无参函数，被返回对象拥有两个属性：
done (boolean)
true:迭代器已经超过了可迭代次数。这种情况下,value的值可以被省略
如果迭代器可以产生序列中的下一个值，则为 false。这等效于没有指定done这个属性。
value - 迭代器返回的任何 JavaScript 值。done 为 true 时可省略。
next 方法必须要返回一一个对象，该对象有两个必要的属性： done和value，如果返回一个非对象值（比如false和undefined) 会展示一个 TypeError ("iterator.next() returned a non-object value") 的错误

```javascript
class people{
    constructor(index){
        this.index = index;
    }
    next(){
        this.index++;
        return{
            done: this.index > 10,
            value: this.index
        }
    }
}

let a = new people(3);
for (let val of a){
    console.log(val);
}
```

## 常见的迭代器

String, Array, TypedArray, Map and Set 是所有内置可迭代对象， 因为它们的原型对象都有一个 @@iterator 方法.

## String 是一个内置的可迭代对象

```javascript
var iterator = 'some'[Symbol.iterator]();
for (let val of iterator){
    console.log(`${val}`,iterator.next());
}

s { value: 'o', done: false }
m { value: 'e', done: false }
```

## 接受可迭代对象的内置 API

```javascript
var myObj = {};
new Map([[1,"a"],[2,"b"],[3,"c"]]).get(2);               // "b"
new WeakMap([[{},"a"],[myObj,"b"],[{},"c"]]).get(myObj); // "b"
new Set([1, 2, 3]).has(3);                               // true
new Set("123").has("2");                                 // true
new WeakSet(function*() {
    yield {};
    yield myObj;
    yield {};
}()).has(myObj); 
```

另外还有 Promise.all(iterable), Promise.race(iterable) 以及 Array.from().

## 用于可迭代对象的语法

一些语句和表达式是预料会用于可迭代对象，比如 for-of 循环，spread operator, yield* 和 destructuring assignment

```javascript
for(let value of ["a", "b", "c"]){
    console.log(value);
}
// "a"
// "b"
// "c"

[..."abc"]; // ["a", "b", "c"]

function* gen(){
  yield* ["a", "b", "c"];
}

gen().next(); // { value:"a", done:false }

[a, b, c] = new Set(["a", "b", "c"]);
a // "a"
```

## 自定义迭代器

```javascript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
[...myIterable]; // [1, 2, 3]
```

## 迭代器示例

```javascript
function makeIterator(array){
    var nextIndex = 0;
    
    return {
       next: function(){
           return nextIndex < array.length ?
               {value: array[nextIndex++], done: false} :
               {done: true};
       }
    };
}

var it = makeIterator(['yo', 'ya']);

console.log(it.next().value); // 'yo'
console.log(it.next().value); // 'ya'
console.log(it.next().done);  // true
```

## 生成器式的迭代器

生成器对象是由一个 generator function 返回的,并且它符合可迭代协议和迭代器协议

```javascript
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i){
  yield i;

  //   yield* 表达式用于委托给另一个generator 或可迭代对象
  yield* anotherGenerator(i);
  yield i + 10;
}

var gen = generator(10);
```

生成器对象 既是迭代器也是可迭代对象:就像前面所说的，一个良好的迭代即实现了迭代器协议，又实现了可迭代协议，方式就是可迭代协议返回的是自身

```javascript
var aGeneratorObject = function*(){
    yield 1;
    yield 2;
    yield 3;
}();
typeof aGeneratorObject.next;
// "function", because it has a next method, so it's an iterator
typeof aGeneratorObject[Symbol.iterator];
// "function", because it has an @@iterator method, so it's an iterable
aGeneratorObject[Symbol.iterator]() === aGeneratorObject;
// true, because its @@iterator method return its self (an iterator), so it's an well-formed iterable
[...aGeneratorObject];
// [1, 2, 3]
```
