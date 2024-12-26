---
title: "React 基础"
tags: ['React']
date: "2022-02-21"
---

## Hooks 基础
在React中，如果在编写函数组件并需要向其添加一些 state，以前的做法是必须将其它转化为 class。通过一个实例化的`class`，保存组件的`state`等状态，对于每一次更新只需要调用`render`方法就可以。但是 [Class组件](https://reactjs.org/docs/react-component.html)在变得复杂之后会变得难以维护。

在`function`组件中，没有一个状态去保存这些信息，每一次函数上下文执行，所有变量，常量都重新声明，执行完毕，再被垃圾机制回收。为了保存一些状态,执行一些副作用钩子,React 16.8新增了`React Hooks`，去帮助记录组件的状态，处理一些额外的副作用。通过`React Hook` 可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 React 特性。

Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，`useState` 是允许你在 React 函数组件中添加 state 的 Hook。你可以在现有的函数组件中使用 Hook，所以通常来说`hook`使得在组件之间复用状态逻辑变得方便、更容易实现代码的关注点分离。

### Hooks的原理

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

### Hooks的使用限制

#### 只在最顶层使用 Hook

**不要在循环，条件或嵌套函数中调用 Hook，** 确保总是在你的 React 函数的最顶层调用他们。遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 hook 状态的正确。参考`Hooks的原理`

> 如果我们想要有条件地执行一个 effect，可以将判断放到 Hook 的*内部*：
>
> ```js
> useEffect(() => {
>   // 👍 将条件判断放置在 effect 中
>   if (name !== '') {
>     localStorage.setItem('formData', name);
>   }
> });
> ```

#### 只在 React 函数中调用 Hook

**不要在普通的 JavaScript 函数中调用 Hook**你可以：

- ✅ 在 React 的函数组件中调用 Hook
- ✅ 在自定义 Hook 中调用其他 Hook

遵循此规则，确保组件的状态逻辑在代码中清晰可见。

#### 自定义 Hook 必须以 “`use`” 开头

这个约定非常重要。不遵循的话，由于无法判断某个函数是否包含对其内部 Hook 的调用，React 将无法自动检查你的 Hook 是否违反了 [Hook 的规则](https://zh-hans.reactjs.org/docs/hooks-rules.html)。

## React 的渲染流程

+ JSX 转换与函数组件执行
  - 当 React 应用启动时，首先会对 JSX 代码进行转换。JSX 看起来像 HTML，但实际上会被编译为 `React.createElement` 调用，创建虚拟 DOM 节点。
  - 对于函数组件，React 会调用该组件函数，传入 props 和 context 等参数。函数组件会根据输入的 props 返回描述组件 UI 的虚拟 DOM 结构。
+ 虚拟 DOM 创建与更新
  - 组件的渲染结果是一个虚拟 DOM 树，它是对真实 DOM 的抽象表示，包含了元素的类型、属性、子节点等信息，但并不直接操作真实 DOM。
  - 当组件的 props 或 state 发生变化时，React 会重新调用组件函数，生成新的虚拟 DOM 树。
  - React 会通过对比新旧虚拟 DOM 树，找出发生变化的部分，这个过程称为调和（reconciliation）。
+ 调和过程
  - 从根节点开始，React 递归地比较新旧虚拟 DOM 树的每个节点。
    如果节点类型相同，React 会继续比较它们的属性和子节点，只更新发生变化的部分。
    如果节点类型不同，React 会销毁旧节点，创建新节点。
  - 对于列表渲染，React 会使用 key 属性来帮助识别哪些项发生了变化，从而更高效地更新列表。
+ 更新队列与批处理
  - 在渲染过程中，当组件的 setState 方法被调用时，React 不会立即更新组件，而是将这些更新放入一个更新队列中。
  - React 会进行批处理更新，即在同一事件循环中的多个 setState 调用会被合并为一次更新，以提高性能。
+ 提交阶段
  - 一旦调和过程完成，React 进入提交阶段，开始将变化应用到真实 DOM。
  - 首先，React 会执行所有在 useEffect(浏览器布局和绘制之后) 和 useLayoutEffect(浏览器进行布局和绘制之前) 的回调函数中注册的副作用（side effects）
  - React 会根据调和过程中确定的变化，更新真实 DOM。这包括添加、删除或更新 DOM 节点，以及更新节点的属性。
+ 渲染完成与生命周期钩子
  - 当 DOM 更新完成后，React 会触发一些生命周期钩子，如 componentDidMount（对于挂载阶段）、componentDidUpdate（对于更新阶段）和 componentWillUnmount（对于卸载阶段）。
  - 如果有错误发生，React 会捕获并处理这些错误，触发 componentDidCatch 生命周期钩子。

### 错误边界

类组件
```jsx
import React, { PureComponent } from  react ;
import ErrorPage from  ../ErrorPage ;

export default class ErrorBound extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  // 这个方法在服务器端渲染期间也被调用，在DOM尚未更新时在“渲染阶段”调用。
  // 应该是一个纯函数。如果要执行副作用 （例如，调用分析服务） ，则还需要实现 componentDidCatch
  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  // 这个方法总是在浏览器中调用，当DOM已经更新时，在“提交阶段”调用
  componentDidCatch(error, errorInfo) {
    // 1、错误信息（error）
    // 2、错误堆栈（errorInfo)
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}
```

函数组件
目前还没有 static getDerivedStateFromError in 函数组件的直接等效项。如果您想避免创建类组件，请编写一个像上面一样的 ErrorBoundary 组件，并在整个应用程序中使用它。或者，使用执行此操作的 `react-error-boundary`
```jsx
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <ExampleApplication />
</ErrorBoundary>
```

## 参考文档

- <https://react.docschina.org/reference/react>

- <https://zhuanlan.zhihu.com/p/376914196>
