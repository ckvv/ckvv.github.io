---
title: DOM中的event
tags: ['web']
---

## event
Event 接口表示在 DOM 中发生的任何事件; 一些是用户生成的（例如鼠标或键盘事件），而其他由 API 生成（例如指示动画已经完成运行的事件，视频已被暂停等等。事件通常由外部源触发，同样也会以编程方式触发，例如执行一个 element 的一个 HTMLElement.click( ) 方法，或通过定义事件，然后使用 EventTarget.dispatchEvent() 将其派发到一个指定的目标。有许多类型的事件，其中一些使用基于主要事件接口的其他接口。事件本身包含所有事件通用的属性和方法。
**事件处理函数可以附加在各种对象上，包括 DOM元素,window,document对象. 等**

有三种方式可以为DOM元素注册事件处理函数

+ EventTarget.addEventListener

```js
// Assuming myButton is a button element
myButton.addEventListener('click', function(){alert('Hello world');}, false);
```
+ HTML 属性

```html
<button onclick="alert('Hello world!')">
```
+ DOM 元素属性

该函数在定义时，可以传入一个 event 形式的参数。 在HTML 规范中，其返回值会以一种特殊的方式被处理。
```
// Assuming myButton is a button element
myButton.onclick = function(event){alert('Hello world');};
```

## 创建自定义事件
可以使用事件构造函数创建事件
```javascript
var event = new Event('build');
let eventEle = document.createElement('event')
// Listen for the event.
eventEle.addEventListener('build', function (event) {console.log(event)}, false);

// Dispatch the event.
eventEle.dispatchEvent(event);
```
为了向事件对象添加更多数据，存在CustomEvent接口，并且可以使用详细信息属性传递自定义数据。CustomEvent接口的detail只读属性返回初始化事件时传递的所有数据
例如，可以如下创建事件：
```javascript
var event = new CustomEvent('build',{
    detail: 'text'
});
let eventEle = document.createElement('event')
// Listen for the event.
eventEle.addEventListener('build', function (event) {console.log(event)}, false);

// Dispatch the event.
eventEle.dispatchEvent(event);

```



