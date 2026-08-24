---
title: "如何写一个好用的组合式函数"
tags: ["Vue"]
date: "2025/02/14"
draft: true
---

在 Vue 应用的概念中，组合式函数”(Composables) 是一个利用 Vue 的 [组合式 API](https://cn.vuejs.org/api/#%E7%BB%84%E5%90%88%E5%BC%8F-api) 来封装和复用有状态逻辑的函数。


下面是一个 使用组合式 API 实现鼠标跟踪功能的例子
```ts
export function useMouse() {
  const mouse = reactive({
    x: 0,
    y: 0,
  });

  function update(event: MouseEvent) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));

  return mouse;
}
```
## 命名

组合式函数约定用驼峰命名法命名，并以`use`作为开头

### 使用 options 对象作为参数

使用`options`对象作为参数, 可以提供更灵活的扩展

```js
// 仅检测鼠标更改
const { x, y } = useMouse({ useMouse: { x: 10, y: 10 } })
```

##  返回 `refs` 对象

组合式函数中使用 `ref()` 而不是 `reactive()`, 这样该对象在组件中被解构为 ref 之后仍可以保持响应性

```js
// x 和 y 是两个 ref
const { x, y } = useMouse()
```
如果你更喜欢将它们用作对象属性，你可以使用 `reactive（）` 来解包引用

```js
const mouse = reactive(useMouse());

// "foo" and "bar" will be auto unwrapped, no `.value` needed
console.log(mouse.x)
```

## 响应式参数

使用`toValue` 处理 输入参数是 `ref` 或 `getter` 或 `原始值`的情况
```
```

## 副作用清理
在组合式函数中可以执行副作用 (例如：添加 DOM 事件监听器)
+ 确保在 `onUnmounted()` 时清理副作用。举例来说，如果一个组合式函数`onMounted()`设置了一个事件监听器，它就应该在 `onUnmounted()` 中被移除
+ 

### 返回清理函数

### effectScope 包装

## 包装大量数据时使用 shallowRef 而不是 ref

## 通过抽取组合式函数改善代码结构

基于逻辑问题将组件代码拆分成更小的函数

```js
export function useEventListener(target: EventTarget, event: string, callback: EventListenerOrEventListenerObject) {
  onMounted(() => target.addEventListener(event, callback));
  onUnmounted(() => target.removeEventListener(event, callback));
}

```

## 书写 SSR 友好的代码

+ 如果你的应用用到了服务端渲染 (SSR)，请确保在组件挂载后才调用的生命周期钩子中执行 `DOM` 相关的副作用，例如：`onMounted()`。这些钩子仅会在浏览器中被调用，因此可以确保能访问到 DOM

# 参考文档

+ https://cn.vuejs.org/guide/reusability/composables.html
+ https://cn.vuejs.org/guide/scaling-up/ssr.html#access-to-platform-specific-apis
+ https://antfu.me/posts/composable-vue-vueday-2021
+ https://vueuse.org/guidelines.html
+ https://vueuse.org/guide/best-practice