---
title: "react hooks 入门"
tags: ['react', 'hooks']
date: "2022-02-21"
---

`React`在组件变得复杂之后使用`Class`组件会变得更难以维护, `React Hook` 是 React 16.8 的新增特性。它可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 React 特性。通常来说`hook`使得在组件之间复用状态逻辑变得便捷、逻辑也更清晰。文章主要参考了[React Hooks](https://reactjs.org/docs/hooks-reference.html), 在此基础上添加了更多的用例。

# API
## 基础hook
#### useState
在函数组件中存储内部 state
```js
const [state, setState] = useState(initialState);
```
参数:
- `initialState`: 初始值

返回值: 
- `state`: 当前的 state
- `setState`: 更新 state 的方法, 它接收一个新的 state 值并将组件的一次重新渲染加入队列。`setState(newState);`, 如果你的更新函数返回值与当前 state 完全相同，则随后的重渲染会被完全跳过

#### 用例

##### 函数式更新
##### 惰性初始 state
##### 跳过 state 更新


useEffect
useContext

## 其他hook
useReducer
useCallback
useMemo
useRef
useImperativeHandle
useLayoutEffect
useDebugValue


# 与Vue3 Composition API的区别