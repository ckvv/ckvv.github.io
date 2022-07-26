---
title: "get和set"
tags: ['JavaScript']
date: '2021-07-09'
---

你可以在支持添加新属性的任何标准的内置对象或用户定义的对象内定义getter(访问方法)和setter(设置方法)。使用对象字面量语法定义getters和setters方法。

## get

get语法将对象属性绑定到查询该属性时将被调用的函数,有时需要允许访问返回动态计算值的属性，或者你可能需要反映内部变量的状态，而不需要使用显式方法调用。在JavaScript中，可以使用 getter 来实现。虽然可以使用 getter 和 setter 来创建一个伪属性类型，但是不可能同时将一个 getter 绑定到一个属性并且该属性实际上具有一个值

使用get语法时应注意以下问题：

+ 可以使用数值或字符串作为标识；
+ 必须不带参数；
+ 它不能与另一个 get 或具有相同属性的数据条目同时出现在一个对象字面量中（不允许使用 { get x() { }, get x() { } } 和 { x: ..., get x() { } }）。
可通过 delete 操作符删除 getter。

## 在新对象初始化时定义一个getter

这会为obj创建一个伪属性latest，它会返回log数组的最后一个元素,注意，尝试为latest分配一个值不会改变它。

```js
var obj = {
  log: ['a', 'b', 'c'],
  get latest() {
    if (this.log.length == 0) {
      return undefined;
    }
    return this.log[this.log.length - 1];
  }
}
obj.latest = 'test';
console.log(obj.latest);
// expected output: "c"
```

## 使用delete操作符删除 getter

```
delete obj.latest;
```

## 使用计算属性名

```js
var expr = 'foo';
var obj = {
  get [expr]() { return 'bar'; }
};
console.log(obj.foo); // "bar"
```

## Smart / self-overwriting / lazy getters

Getters 给你一种方法来定义一个对象的属性，但是在访问它们之前不会计算属性的值。 getter 延续计算值的成本，直到需要值，如果不需要，您就不用支付成本。

```js
var obj = {
  get divs() {
      delete this.divs;
      return this.divs = document.getElementsByTagName('div');
  }
}
console.log(obj.divs);
```

## set

当尝试设置属性时，set语法将对象属性绑定到要调用的函数。

{set prop(val) { . . . }}
{set [expression](val) { . . . }}

```
+ `prop`要绑定到给定函数的属性名。
+ `val`用于保存尝试分配给prop的值的变量的一个别名。
+ `expression`从 ECMAScript 2015 开始，还可以使用一个计算属性名的表达式绑定到给定的函数。

## 用 delete 操作符移除一个 setter

```js
delete peo.name
```

## 在对象初始化时定义 setter

这将定义一个对象 language 的伪属性current，当分配一个值时，将使用该值更新log：

```js
var language = {
  set current(name) {
    this.log.push(name);
  },
  log: []
}

language.current = 'EN';
console.log(language.log); // ['EN']

language.current = 'FA';
console.log(language.log); // ['EN', 'FA']

let peo = {
    set name(val){
        console.log(`set name: ${val}`)
    },
    set age(val){
        console.log(`set age: ${val}`)
    }
}
peo.name = 'hello';
peo.name = 'world';
peo.age = 16;
```

## 使用 defineProperty 为当前对象定义 setter

```js
var o = { a:0 };

Object.defineProperty(o, "b", { set: function (x) { this.a = x / 2; } });

o.b = 10; // Runs the setter, which assigns 10 / 2 (5) to the 'a' property
console.log(o.a) // 5
```

## 使用计算属性名

```js
var expr = "foo";

var obj = {
  baz: "bar",
  set [expr](v) { this.baz = v; }
};

console.log(obj.baz); // "bar"
obj.foo = "baz";      // run the setter
console.log(obj.baz); // "baz"
```
