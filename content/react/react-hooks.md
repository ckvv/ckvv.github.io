---
title: "react hooks 入门"
tags: ['react', 'hooks']
date: "2022-02-21"
---

在React中，如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其它转化为 class。但是 [Class组件](https://reactjs.org/docs/react-component.html)在变得复杂之后会变得难以维护, 通过`React Hook` (React 16.8 的新增特性) 可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 React 特性。

Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，`useState` 是允许你在 React 函数组件中添加 state 的 Hook。现在你可以在现有的函数组件中使用 Hook，所以通常来说`hook`使得在组件之间复用状态逻辑变得便捷、逻辑也更清晰。

# Hooks API
## useState
在函数组件中存储内部 state
```js
const [state, setState] = useState(initialState);
```
参数:
- `initialState`: state初始值

返回值: 
- `state`: 当前的 state
- `setState`: 更新 state 的方法, 它接收一个新的 state 值并将组件的一次重新渲染加入队列。如果你的更新函数返回值与当前 state 完全相同，则随后的重渲染会被完全跳过

### 基础用法

这个例子用来显示一个计数器。当你点击按钮，计数器的值就会增加

```js
function Counter(props) {
  const [count, setCount] = useState(props.initialCount)

  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      count is: {count}
    </button>
  );
}
Counter.defaultProps = {
  initialCount: 10,
}
```



值得注意的是，类似`setState`,在我们执行`setCount`时count的值不是立即更新的，而是在下一个重渲染时才会更新。

```js
// 所以如在同一周期内多次执行setCount
setCount(count + 1);
setCount(count + 2);
setCount(count + 1);
// 这相当于setCount(count + 1);
```

 后调用的 setCount() 将覆盖同一周期内先调用 setCount 的值，因此count数仅增加一,解决办法可以参考`函数式更新`



### 函数式更新

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 `setCount`，该回调函数将接收先前的 state，并返回一个更新后的值。

```js
setCount((count) => count + 1);
```

```js
setCount(count => count + 1);
setCount(count => count + 2);
setCount(count => count + 1);
// 这相当于setCount(count + 4);
```

> 与 class 组件中的 `setState` 方法不同，`setState` 不会自动合并更新对象。你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。
>
> ```js
> const [people, setPeople] = useState({
>   age: 18,
>   name: '小红',
> });
> 
> setPeople({
>   age: people.age + 1,
> });
> 
> // 不会自动合并更新对象
> // people {age: 18}
> 
> setPeople(prevState => {
>   ..prevState,
>   age: prevState.age + 1,
> });
>   
> // people {age: 19, name: '小红'}
> ```

### 惰性初始 state
### 跳过 state 更新
## useEffect
### 基础用法
## useContext
### 基础用法
## useReducer
### 基础用法
## useCallback
### 基础用法
## useMemo
### 基础用法
## useRef
### 基础用法
## useImperativeHandle
### 基础用法
## useLayoutEffect
### 基础用法
## useDebugValue
### 基础用法



# 关于hooks
## Hooks的原理
## Hooks的使用限制
## React Hooks与Vue3 Composition API的区别