---
title: "React Hooks 基础"
tags: ['React']
date: "2022-02-21"
---

在React中，如果在编写函数组件并需要向其添加一些 state，以前的做法是必须将其它转化为 class。通过一个实例化的`class`，保存组件的`state`等状态，对于每一次更新只需要调用`render`方法就可以。但是 [Class组件](https://reactjs.org/docs/react-component.html)在变得复杂之后会变得难以维护。

在`function`组件中，没有一个状态去保存这些信息，每一次函数上下文执行，所有变量，常量都重新声明，执行完毕，再被垃圾机制回收。为了保存一些状态,执行一些副作用钩子,React 16.8新增了`React Hooks`，去帮助记录组件的状态，处理一些额外的副作用。通过`React Hook` 可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 React 特性。

Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，`useState` 是允许你在 React 函数组件中添加 state 的 Hook。你可以在现有的函数组件中使用 Hook，所以通常来说`hook`使得在组件之间复用状态逻辑变得方便、更容易实现代码的关注点分离。


## Hooks的原理

React 保持对当前渲染中的组件的追踪。多亏了 [Hook 规范](https://zh-hans.reactjs.org/docs/hooks-rules.html)，我们得知 Hook 只会在 React 组件中被调用（或自定义 Hook —— 同样只会在 React 组件中被调用）。

每个组件内部都有一个「记忆单元格」列表。它们只不过是我们用来存储一些数据的 JavaScript 对象。当你用 `useState()` 调用一个 Hook 的时候，它会读取当前的单元格（或在首次渲染时将其初始化），然后把指针移动到下一个。这就是多个 `useState()` 调用会得到各自独立的本地 state 的原因。

```js
// 每次执行一个`hooks`函数，都产生一个`hook`对象，里面保存了当前`hook`信息,
// 然后将每个`hooks`以链表形式串联起来，并赋值给`workInProgress`的`memoizedState`。
// 也就证实了上述所说的，函数组件用`memoizedState`存放`hooks`链表。
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,

    baseState: null,
    baseQueue: null,
    queue: null,

    next: null,
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```

所以一旦在条件语句中声明`hooks`，在下一次函数组件更新，`hooks`链表结构，将会被破坏，`current`树的`memoizedState`缓存`hooks`信息，和当前`workInProgress`不一致，如果涉及到读取`state`等操作，就会发生异常

## Hooks的使用限制

### 只在最顶层使用 Hook

**不要在循环，条件或嵌套函数中调用 Hook，** 确保总是在你的 React 函数的最顶层调用他们。遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 hook 状态的正确。参考`Hooks的原理`

> 如果我们想要有条件地执行一个 effect，可以将判断放到 Hook 的*内部*：
>
> ```js
> useEffect(function persistForm() {
>   // 👍 将条件判断放置在 effect 中
>   if (name !== '') {
>     localStorage.setItem('formData', name);
>   }
> });
> ```

### 只在 React 函数中调用 Hook

**不要在普通的 JavaScript 函数中调用 Hook**你可以：

- ✅ 在 React 的函数组件中调用 Hook
- ✅ 在自定义 Hook 中调用其他 Hook

遵循此规则，确保组件的状态逻辑在代码中清晰可见。

### 自定义 Hook 必须以 “`use`” 开头

这个约定非常重要。不遵循的话，由于无法判断某个函数是否包含对其内部 Hook 的调用，React 将无法自动检查你的 Hook 是否违反了 [Hook 的规则](https://zh-hans.reactjs.org/docs/hooks-rules.html)。

## 参考文档

- <https://react.docschina.org/reference/react>

- <https://zhuanlan.zhihu.com/p/376914196>
