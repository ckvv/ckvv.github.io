---
title: "React 类组件"
tags: ['React']
date: "2024-08-28"
---

# 生命周期

类组件有一系列的生命周期方法，主要分为三个阶段：挂载阶段、更新阶段和卸载阶段

## 挂载阶段
### constructor()：
最早被调用的生命周期方法
通常用于初始化组件的 state 和绑定事件处理方法。
在这个方法中，可以通过将方法绑定到当前组件实例来确保在回调中this指向正确的组件实例。例如：this.handleClick = this.handleClick.bind(this);。
### static getDerivedStateFromProps(nextProps, prevState)：
是一个静态方法，在组件实例被创建以及每次接收到新的 props 时被调用。
此方法接收新的 props 和当前的 state 作为参数，并返回一个对象来更新 state，或者返回 null 表示不需要更新 state。
主要用于根据 props 来同步 state，可以用于将 props 的值同步到 state 中，确保组件状态的一致性。
### render()：
是 React 类组件中必须定义的方法。
用于返回一个 React 元素，描述组件的 UI 结构。
在这个方法中，不能进行任何有副作用的操作，如直接修改 state、进行异步请求等。它应该是一个纯函数，仅根据输入的 props 和 state 来确定输出的 UI。
### componentDidMount()：
在组件挂载到 DOM 后立即被调用。
通常用于在这个阶段进行一些副作用操作，比如发起异步请求获取数据、添加事件监听器等。
因为此时组件已经在 DOM 中渲染完成，可以确保 DOM 操作的安全性。
## 更新阶段
### static getDerivedStateFromProps(nextProps, prevState)：
同样在组件更新时（由于 props 变化或 state 变化导致的重新渲染）会被调用。
### shouldComponentUpdate(nextProps, nextState)：
此方法接收新的 props 和新的 state 作为参数。
返回一个布尔值，决定组件是否应该重新渲染。如果返回 false，则组件不会重新渲染，这可以用于性能优化，避免不必要的渲染。
### render()：
当组件的 props 或 state 发生变化时，会再次调用render方法来重新生成组件的 UI 结构。
### getSnapshotBeforeUpdate(prevProps, prevState)：
在更新发生之前被调用，就在组件即将更新但 DOM 还未更新时触发。
这个方法可以返回一个值，这个值会作为参数传递给componentDidUpdate。
通常用于获取更新前的某些 DOM 状态，比如滚动位置等。
### componentDidUpdate(prevProps, prevState, snapshot)：
在组件更新完成后立即被调用。
接收先前的 props、先前的 state 和来自getSnapshotBeforeUpdate的 snapshot 参数。
通常用于处理更新后的副作用，比如根据新的数据再次发起异步请求、更新 DOM 元素的位置等。
## 卸载阶段
### componentWillUnmount()
在组件从 DOM 中卸载之前被调用。
用于清理在组件生命周期中创建的副作用，比如取消定时器、移除事件监听器、取消网络请求等，以避免内存泄漏
### 错误边界
### ‌getDerivedStateFromError‌(error)
这个方法在服务器端渲染期间也被调用，在DOM尚未更新时在“渲染阶段”调用。
#