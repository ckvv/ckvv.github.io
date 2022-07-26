---
title: JavaScript可选链操作符
tags: ["JavaScript"]
date: "2021-07-09"
---

# 可选链操作符

**可选链**操作符( **`?.`** )允许读取位于连接对象链深处的属性的值，而不必明确验证链中的每个引用是否有效。`?.` 操作符的功能类似于 `.` 链式操作符，不同之处在于，在引用为空([nullish](https://developer.mozilla.org/zh-CN/docs/Glossary/Nullish) ) ([`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null) 或者 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)) 的情况下不会引起错误，该表达式短路返回值是 `undefined`。与函数调用一起使用时，如果给定的函数不存在，则返回 `undefined`。

当尝试访问可能不存在的对象属性时，可选链操作符将会使表达式更短、更简明。在探索一个对象的内容时，如果不能确定哪些属性必定存在，可选链操作符也是很有帮助的。

<iframe class="interactive" height="692" src="https://interactive-examples.mdn.mozilla.net/pages/js/expressions-optionalchainingoperator.html" title="MDN Web Docs Interactive Example" loading="lazy" style="box-sizing: border-box; background-color: rgb(244, 244, 244); border: 0px; color: rgb(27, 27, 27); padding: 10px; width: 1002px; max-width: 100%;"></iframe>

## [语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#语法)

```js
obj?.prop;
obj?.[expr];
arr?.[index];
func?.(args);
```

## [描述](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#描述)

通过连接的对象的引用或函数可能是 `undefined` 或 `null` 时，可选链操作符提供了一种方法来简化被连接对象的值访问。

比如，思考一个存在嵌套结构的对象 `obj`。不使用可选链的话，查找一个深度嵌套的子属性时，需要验证之间的引用，例如：

```js
let nestedProp = obj.first && obj.first.second;
```

为了避免报错，在访问`obj.first.second`之前，要保证 `obj.first` 的值既不是 `null`，也不是 `undefined`。如果只是直接访问 `obj.first.second`，而不对 `obj.first` 进行校验，则有可能抛出错误。

有了可选链操作符（`?.`），在访问 `obj.first.second` 之前，不再需要明确地校验 `obj.first` 的状态，再并用短路计算获取最终结果：

```js
let nestedProp = obj.first?.second;
```

通过使用 `?.` 操作符取代 `.` 操作符，JavaScript 会在尝试访问 `obj.first.second` 之前，先隐式地检查并确定 `obj.first` 既不是 `null` 也不是 `undefined`。如果`obj.first`是 `null` 或者 `undefined`，表达式将会短路计算直接返回 `undefined`。

这等价于以下表达式，但实际上没有创建临时变量：

```js
let temp = obj.first;
let nestedProp = temp === null || temp === undefined ? undefined : temp.second;
```

### [可选链与函数调用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#可选链与函数调用)

当尝试调用一个可能不存在的方法时也可以使用可选链。这将是很有帮助的，比如，当使用一个 API 的方法可能不可用时，要么因为实现的版本问题要么因为当前用户的设备不支持该功能。

函数调用时如果被调用的方法不存在，使用可选链可以使表达式自动返回`undefined`而不是抛出一个异常。

```js
let result = someInterface.customMethod?.();
```

**注意:** 如果存在一个属性名且不是函数, 使用 `?.` 仍然会产生一个 [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 异常 (` x.y`` is not a function `).

**注意:** 如果 `someInterface` 自身是 `null` 或者 `undefined` ，异常 [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError) 仍会被抛出 `someInterface is null` 如果你希望允许 `someInterface` 也为 `null` 或者 `undefined` ，那么你需要像这样写 `someInterface?.customMethod?.()`

#### 处理可选的回调函数或者事件处理器

如果使用[解构赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)来解构的一个对象的回调函数或 fetch 方法，你可能得到不能当做函数直接调用的不存在的值，除非你已经校验了他们的存在性。使用`?.`的你可以忽略这些额外的校验：

```js
//  ES2019的写法
function doSomething(onContent, onError) {
  try {
    // ... do something with the data
  } catch (err) {
    if (onError) {
      // 校验onError是否真的存在
      onError(err.message);
    }
  }
}
```

```js
// 使用可选链进行函数调用
function doSomething(onContent, onError) {
  try {
    // ... do something with the data
  } catch (err) {
    onError?.(err.message); // 如果onError是undefined也不会有异常
  }
}
```

### [可选链和表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#可选链和表达式)

当使用[方括号与属性名](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors#方括号表示法)的形式来访问属性时，你也可以使用可选链操作符：

```js
let nestedProp = obj?.["prop" + "Name"];
```

### [可选链不能用于赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#可选链不能用于赋值)

```js
let object = {};
object?.property = 1; // Uncaught SyntaxError: Invalid left-hand side in assignment
```

### [可选链访问数组元素](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#可选链访问数组元素)

```js
let arrayItem = arr?.[42];
```

## [例子](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#例子)

### [基本例子](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#基本例子)

如下的例子在一个不含 `bar` 成员的 Map 中查找 `bar` 成员的 `name` 属性，因此结果是 `undefined`。

```js
let myMap = new Map();
myMap.set("foo", { name: "baz", desc: "inga" });

let nameBar = myMap.get("bar")?.name;
```

### [短路计算](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#短路计算)

当在表达式中使用可选链时，如果左操作数是 `null` 或 `undefined`，表达式将不会被计算，例如：

```js
let potentiallyNullObj = null;
let x = 0;
let prop = potentiallyNullObj?.[x++];

console.log(x); // x 将不会被递增，依旧输出 0
```

### [连用可选链操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#连用可选链操作符)

可以连续使用可选链读取多层嵌套结构：

```js
let customer = {
  name: "Carl",
  details: {
    age: 82,
    location: "Paradise Falls", // details 的 address 属性未有定义
  },
};
let customerCity = customer.details?.address?.city;

// … 可选链也可以和函数调用一起使用
let duration = vacations.trip?.getTime?.();
```

### [使用空值合并操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining#使用空值合并操作符)

[`空值合并操作符`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)可以在使用可选链时设置一个默认值：

```js
let customer = {
  name: "Carl",
  details: { age: 82 },
};
let customerCity = customer?.city ?? "暗之城";
console.log(customerCity); // “暗之城”
```
