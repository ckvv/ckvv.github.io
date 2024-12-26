---
title: "js中的this"
tags: ["JavaScript"]
date: "2021-07-09"
---

js 中 this 指当前执行代码的环境对象，this 不能在执行期间被赋值如`this = null`，在绝大多数情况下，函数的调用方式决定了 this 的值

## 全局环境

浏览器中，无论是否在严格模式下，在全局执行环境中（在任何函数体外部）this 都指向全局对象。

```javascript
// 在浏览器中, window 对象同时也是全局对象：
console.log(this === window); // true
a = 37;
console.log(window.a); // 37
this.b = 'MDN';
console.log(window.b); // "MDN"
console.log(b); // "MDN"
```

node 环境中 this 是一个空对象

```javascript
console.log(this); //  {}
```

## 函数（运行内）环境

在函数内部，this 的值取决于函数被调用的方式

因为下面的代码不在严格模式下，且 this 的值不是由该调用设置的，所以 this 的值默认指向全局对象

```javascript
function f1() {
  return this;
}
// 在浏览器中：
f1() === window; // 在浏览器中，全局对象是window

// 在Node中：
f1() === global;
```

严格模式下，如果 this 没有被执行环境（execution context）定义，那它将保持为 undefined

```javascript
'use strict'; // 这里是严格模式
function f2() {
  return this;
}

f2() === undefined; // true

window.f2(); //  window
```

如果要想把 this 的值从一个环境传到另一个，就要用 call 或 apply 方法

```javascript
// 将一个对象作为call和apply的第一个参数，this会被绑定到这个对象。
const obj = { a: 'Custom' };

// 这个属性是在global对象定义的。
const a = 'Global';

function whatsThis(arg) {
  return this.a; // this的值取决于函数的调用方式
}

whatsThis(); // 'Global'
whatsThis.call(obj); // 'Custom'
whatsThis.apply(obj); // 'Custom'
```

当一个函数在其主体中使用 this 关键字时，可以通过使用函数继承自 Function.prototype 的 call 或 apply 方法将 this 值绑定到调用中的特定对象

```javascript
function add(c, d) {
  return this.a + this.b + c + d;
}

const o = { a: 1, b: 3 };

// 第一个参数是作为‘this’使用的对象
// 后续参数作为参数传递给函数调用
add.call(o, 5, 7); // 1 + 3 + 5 + 7 = 16

// 第一个参数也是作为‘this’使用的对象
// 第二个参数是一个数组，数组里的元素用作函数调用中的参数
add.apply(o, [10, 20]); // 1 + 3 + 10 + 20 = 34
```

使用 call 和 apply 函数的时候要注意，如果传递给 this 的值不是一个对象，JavaScript 会尝试使用内部 ToObject 操作将其转换为对象。因此，如果传递的值是一个原始值比如 7 或 'foo'，那么就会使用相关构造函数将它转换为对象，所以原始值 7 会被转换为对象，像 new Number(7) 这样，而字符串 'foo' 转化成 new String('foo') 这样，例如：

```javascript
function bar() {
  console.log(this);
}
// 原始值 7 被隐式转换为对象
bar.call(7); // Number {7}
```

ECMAScript 5 引入了 Function.prototype.bind。调用 f.bind(someObject)会创建一个与 f 具有相同函数体和作用域的函数，但是在这个新函数中，this 将永久地被绑定到了 bind 的第一个参数，无论这个函数是如何被调用的

```javascript
function f() {
  return this.a;
}

const g = f.bind({
  a: 'azerty',
});
console.log(g()); // azerty

const h = g.bind({
  a: 'yoo',
}); // bind只生效一次！
console.log(h()); // azerty

const o = {
  a: 37,
  f,
  g,
  h,
};
console.log(o.f(), o.g(), o.h()); // 37, azerty, azerty
```

## 箭头函数

在箭头函数中，this 与封闭词法环境的 this 保持一致。在全局代码中，它将被设置为全局对象,无论如何，foo 的 this 被设置为他被创建时的环境

```javascript
const globalObject = this;
const foo = () => this;
console.log(foo() === globalObject); // true
```

如果将 this 传递给 call、bind、或者 apply，它将被忽略。不过你仍然可以为调用添加参数，不过第一个参数（thisArg）应该设置为 null。

```javascript
const obj = { foo };
console.log(obj.foo() === globalObject); // true

// 尝试使用call来设定this
console.log(foo.call(obj) === globalObject); // true

// 尝试使用bind来设定this
foo = foo.bind(obj);
console.log(foo() === globalObject); // true
```

箭头函数的 this 被设置为封闭的词法环境,一个赋值给了 obj.bar 的函数（称为匿名函数 A），返回了另一个箭头函数（称为匿名函数 B）。因此，在 A 调用时，函数 B 的 this 被永久设置为 obj.bar（函数 A）的 this。当返回的函数（函数 B）被调用时，它 this 始终是最初设置的

```javascript
// 创建一个含有bar方法的obj对象，
// bar返回一个函数，
// 这个函数返回this，
// 这个返回的函数是以箭头函数创建的，
// 所以它的this被永久绑定到了它外层函数的this。
// bar的值可以在调用中设置，这反过来又设置了返回函数的值。
const obj = {
  bar() {
    const x = () => this;
    return x;
  },
};

// 作为obj对象的一个方法来调用bar，把它的this绑定到obj。
// 将返回的函数的引用赋值给fn。
const fn = obj.bar();

// 直接调用fn而不设置this，
// 通常(即不使用箭头函数的情况)默认为全局对象
// 若在严格模式则为undefined
console.log(fn() === obj); // true

// 但是注意，如果你只是引用obj的方法，
// 而没有调用它
const fn2 = obj.bar;
// 那么调用箭头函数后，this指向window，因为它从 bar 继承了this。
console.log(fn2()() == window); // true
```

## 作为对象的方法

当函数作为对象里的方法被调用时，它们的 this 是调用该函数的对象;
当 o.f()被调用时，函数内的 this 将绑定到 o 对象

```javascript
const o = {
  prop: 37,
  f() {
    return this.prop;
  },
};

console.log(o.f()); // logs 37

window.prop = 3;
a = o.f;
a(); // 3
```

**注意**
这样的行为，根本不受函数定义方式或位置的影响。在前面的例子中，我们在定义对象 o 的同时，将函数内联定义为成员 f 。但是，我们也可以先定义函数，然后再将其附属到 o.f。这样做会导致相同的行为：

```javascript
const o = { prop: 37 };

function independent() {
  return this.prop;
}

o.f = independent;

console.log(o.f()); // logs 37
```

**这表明函数是从 o 的 f 成员调用的才是重点**

this 的绑定只受最靠近的成员引用的影响。在下面的这个例子中，我们把一个方法 g 当作对象 o.b 的函数调用。在这次执行期间，函数中的 this 将指向 o.b。事实证明，这与他是对象 o 的成员没有多大关系，最靠近的引用才是最重要的

```javascript
o.b = { g: independent, prop: 42 };
console.log(o.b.g()); // 42
```

## 原型链中的 this

如果该方法存在于一个对象的原型链上，那么 this 指向的是调用这个方法的对象，就像该方法在对象上一样

```javascript
const o = {
  f() {
    return this.a + this.b;
  },
};
const p = Object.create(o);
p.a = 1;
p.b = 4;

console.log(p.f()); // 5
```

在这个例子中，对象 p 没有属于它自己的 f 属性，它的 f 属性继承自它的原型。虽然在对 f 的查找过程中，最终是在 o 中找到 f 属性的，这并没有关系；查找过程首先从 p.f 的引用开始，所以函数中的 this 指向 p。也就是说，因为 f 是作为 p 的方法调用的，所以它的 this 指向了 p。这是 JavaScript 的原型继承中的一个有趣的特性。

## getter 与 setter 中的 this

再次，相同的概念也适用于当函数在一个 getter 或者 setter 中被调用。用作 getter 或 setter 的函数都会把 this 绑定到设置或获取属性的对象

```javascript
function sum() {
  return this.a + this.b + this.c;
}

const o = {
  a: 1,
  b: 2,
  c: 3,
  get average() {
    return (this.a + this.b + this.c) / 3;
  },
};

Object.defineProperty(o, 'sum', {
  get: sum,
  enumerable: true,
  configurable: true,
});

console.log(o.average, o.sum); // logs 2, 6
```

## 作为构造函数

当一个函数用作构造函数时（使用 new 关键字），它的 this 被绑定到正在构造的新对象。虽然构造器返回的默认值是 this 所指的那个对象，但它仍可以手动返回其他的对象（如果返回值不是一个对象，则返回 this 对象）

```javascript
/*
 * 构造函数这样工作:
 *
 * function MyConstructor(){
 *   // 函数实体写在这里
 *   // 根据需要在this上创建属性，然后赋值给它们，比如：
 *   this.fum = "nom";
 *   // 等等...
 *
 *   // 如果函数具有返回对象的return语句，
 *   // 则该对象将是 new 表达式的结果。
 *   // 否则，表达式的结果是当前绑定到 this 的对象。
 *   //（即通常看到的常见情况）。
 * }
 */
function C() {
  this.a = 37;
}

let o = new C();
console.log(o.a); // logs 37

function C2() {
  this.a = 37;
  return { a: 38 };
}

o = new C2();
console.log(o.a); // logs 38
```

## 作为一个 DOM 事件处理函数

当函数被用作事件处理函数时，它的 this 指向触发事件的元素（一些浏览器在使用非 addEventListener 的函数动态添加监听函数时不遵守这个约定)

```javascript
// 被调用时，将关联的元素变成蓝色
function bluify(e) {
  console.log(this === e.currentTarget); // 总是 true

  // 当 currentTarget 和 target 是同一个对象时为 true
  console.log(this === e.target);
  this.style.backgroundColor = '#A5D9F3';
}

// 获取文档中的所有元素的列表
const elements = document.getElementsByTagName('*');

// 将bluify作为元素的点击监听函数，当元素被点击时，就会变成蓝色
for (let i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', bluify, false);
}
```

## 作为一个内联事件处理函数

当代码被内联 on-event 处理函数调用时，它的 this 指向监听器所在的 DOM 元素

```html
<button onclick="alert(this.tagName.toLowerCase());">Show this</button>
```

注意只有外层代码中的 this 是这样设置的

```html
<button onclick="alert((function(){return this})());">Show inner this</button>
```

在这种情况下，没有设置内部函数的 this，所以它指向 global/window 对象（即非严格模式下调用的函数未设置 this 时指向的默认对象）
