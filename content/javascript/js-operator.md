---
title: 介绍几个表达式和运算符
tags: ['js']
date: '2021-07-09'
---

## 空值合并运算符

`??`是一个逻辑操作符，当左侧的表达式结果为 null或者 undefined时，其返回右侧表达式的结果，否则返回左侧表达式的结果。

以前，如果想为一个变量赋默认值，通常的做法是使用逻辑或操作符`||` 然而，由于 `||` 是一个布尔逻辑运算符，左侧的操作数会被强制转换成布尔值用于求值。任何假值（`0`， `''`， `NaN`， `null`， `undefined`）都不会被返回。这导致如果你使用`0`，`''`或`NaN`作为有效值，就会出现不可预料的后果。空值合并操作符可以避免这种陷阱，其只在第一个操作数为`null` 或 `undefined` 时（而不是其它假值）返回第二个操作数

```javascript
let myText = ''; // An empty string (which is also a falsy value)

let notFalsyText = myText || 'Hello world';
console.log(notFalsyText); // Hello world

let preservingFalsy = myText ?? 'Hi neighborhood';
console.log(preservingFalsy); // '' (as myText is neither undefined nor null)


//因为空值合并操作符和其他逻辑操作符之间的运算优先级/运算顺序是未定义的
null || undefined ?? "foo"; // 抛出 SyntaxError
(null || undefined ) ?? "foo"; // 返回 "foo"


let customer = {
  name: "Carl",
  details: { age: 82 }
};
let customerCity = customer?.city ?? "暗之城";
console.log(customerCity); // “暗之城”
```



## 可选链式操作

**`?.`** 可以按照操作符之前的属性是否有效，链式读取对象的属性或者使整个对象链返回 `undefined`。`?.` 运算符的作用与 `.` 运算符类似，不同之处在于，如果对象链上的引用是 nullish(null或undefined)操作符会抛出一个错误，而 `?.` 操作符则会按照短路计算的方式进行处理，返回 `undefined`。可选链操作符也可用于函数调用，如果操作符前的函数不存在，也将会返回 `undefined`。



```javascript
const adventurer = {
  name: 'Alice',
  cat: {
    name: 'Dinah'
  }
};

const dogName = adventurer.dog?.name;
console.log(dogName);
// expected output: undefined
console.log(adventurer.someNonExistentMethod?.());
// expected output: undefined
```

## new.target

检测函数或构造方法是否是通过new运算符被调用的。在通过new运算符被初始化的函数或构造方法中，`new.target`返回一个指向构造方法或函数的引用。在普通的函数调用中，`new.target` 的值是`undefined`



```javascript
function Foo() {
  if (!new.target) throw "Foo() must be called with new";
  console.log("Foo instantiated with new");
}

Foo(); // throws "Foo() must be called with new"
new Foo(); // logs "Foo instantiated with new"

class A {
  constructor() {
    console.log(new.target.name);
  }
}

class B extends A { constructor() { super(); } }

var a = new A(); // logs "A"
var b = new B(); // logs "B"
```



## 逗号操作符

对它的每个操作数求值（从左到右），并返回最后一个操作数的值

```javascript
let x = 1;
x = (x++, x);
console.log(x);
// expected output: 2

x = (2, 3);
console.log(x);
// expected output: 3

```



## 管道操作符

试验性的管道操作符 `|>` （目前其标准化流程处于 stage 1 阶段）允许以一种易读的方式去对函数链式调用。本质上来说，管道操作符是单参数函数调用的语法糖，它允许你像这样执行一个调用

```javascript
let url = "%21" |> decodeURI;

使用传统语法写的话，等效的代码是这样的：
let url = decodeURI("%21");
```



# 装饰器

装饰器是对类、函数、属性之类的一种装饰，可以针对其添加一些额外的行为。通俗的理解可以认为就是在原有代码外层包装了一层处理逻辑,装饰器是一个还处于草案中的特性

TODO