---
title: Reflect和Proxy
tags: ['js']
---

## Proxy
Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。
ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。`var proxy = new Proxy(target, handler);`
Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，
+ `new Proxy()`表示生成一个Proxy实例，
+ `target`参数表示所要拦截的目标对象，
+ `handler`参数也是一个对象，用来定制拦截行为。

```js
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});
proxy.time // 35
proxy.name // 35
proxy.title // 35
```
上面代码中，作为构造函数，Proxy接受两个参数。第一个参数是所要代理的目标对象（上例是一个空对象），即如果没有Proxy的介入，操作原来要访问的就是这个对象；第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。比如，上面代码中，配置对象有一个get方法，用来拦截对目标对象属性的访问请求。get方法的两个参数分别是目标对象和所要访问的属性。可以看到，由于拦截函数总是返回35，所以访问任何属性都得到35。
注意，要使得Proxy起作用，必须针对`Proxy实例`（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

如果handler没有设置任何拦截，那就等同于直接通向原对象。

```js
let peo = {};

let proxyP = new Proxy(peo,{});

proxyP.name = 'ck';
peo.name    //'ck'

```
下面是 Proxy 支持的拦截操作一览，一共 13 种。
+ `get(target, propKey, receiver)`：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
+ `set(target, propKey, value, receiver)`：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
+ `has(target, propKey)`：拦截propKey in proxy的操作，返回一个布尔值。
+ `deleteProperty(target, propKey)`：拦截delete proxy[propKey]的操作，返回一个布尔值。
+ `ownKeys(target)`：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
+ `getOwnPropertyDescriptor(target, propKey)`：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
+ `defineProperty(target, propKey, propDesc)`：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
+ `preventExtensions(target)`：拦截Object.preventExtensions(proxy)，返回一个布尔值。
+ `getPrototypeOf(target)`：拦截Object.getPrototypeOf(proxy)，返回一个对象。
+ `isExtensible(target)`：拦截Object.isExtensible(proxy)，返回一个布尔值。
+ `setPrototypeOf(target, proto)`：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
+ `apply(target, object, args)`：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
+ `construct(target, args)`：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。


## Reflect
Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与处理器对象的方法相同。与大多数全局对象不同，Reflect没有构造函数。你不能将其与一个new运算符一起使用，或者将Reflect对象作为一个函数来调用。Reflect的所有属性和方法都是静态的（就像Math对象）。

Reflect对象提供以下静态函数，它们具有与处理器对象方法相同的名称。这些方法中的一些与 Object 上的对应方法相同。
```
Reflect.apply(target, thisArg, args)
Reflect.construct(target, args)
Reflect.get(target, name, receiver)
Reflect.set(target, name, value, receiver)
Reflect.defineProperty(target, name, desc)
Reflect.deleteProperty(target, name)
Reflect.has(target, name)
Reflect.ownKeys(target)
Reflect.isExtensible(target)
Reflect.preventExtensions(target)
Reflect.getOwnPropertyDescriptor(target, name)
Reflect.getPrototypeOf(target)
Reflect.setPrototypeOf(target, prototype)
```
+ `Reflect.apply()`对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和 Function.prototype.apply() 功能类似。
+ `Reflect.construct()`
对构造函数进行 new 操作，相当于执行 new target(...args)。
+ `Reflect.defineProperty()`和 Object.defineProperty() 类似。
+ `Reflect.deleteProperty()`作为函数的delete操作符，相当于执行 delete target[name]。
+ `Reflect.enumerate()`该方法会返回一个包含有目标对象身上所有可枚举的自身字符串属性以及继承字符串属性的迭代器，for...in 操作遍历到的正是这些属性。
+ `Reflect.get()`获取对象身上某个属性的值，类似于 target[name]。
Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。

```js
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
}

Reflect.get(myObject, 'foo') // 1
Reflect.get(myObject, 'bar') // 2
Reflect.get(myObject, 'baz') // 3
```
+ `Reflect.getOwnPropertyDescriptor()`类似于 Object.getOwnPropertyDescriptor()。
+ `Reflect.getPrototypeOf()`类似于 Object.getPrototypeOf()。
+ `Reflect.has()`判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。
+ `Reflect.isExtensible()`类似于 Object.isExtensible().
+ `Reflect.ownKeys()`返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受enumerable影响).
+ `Reflect.preventExtensions()`类似于 Object.preventExtensions()。返回一个Boolean。
+ `Reflect.set()`将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。
+ `Reflect.setPrototypeOf()`类似于 Object.setPrototypeOf()。



## demo

观察者模式：当一个对象被修改时,则会自动通知它的依赖对象
```js
// 存放修改时触发的行为
const queuedObservers = new Set();
const observe = (fn) => {
    queuedObservers.add(fn)
};

// 返回一个观察对象
const observable = (obj) => {
    return new Proxy(obj, {
        set: function (target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            queuedObservers.forEach((fn) => {
                fn()
            });
            return result;
        }
    })
};

const person = observable({
    name: '张三',
    age: 20
});

function print() {
    console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = '李四';
person.name = 'ck';
```
