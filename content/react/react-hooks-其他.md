---
title: "React Hook 其他"
tags: ['React']
date: "2024-08-24"
---

## useDebugValue

`useDebugValue` 可用于在 React 开发者工具中显示自定义 hook 的标签。

```js
useDebugValue(value)
```

### 基础用法

```js
function testHook(initialCount) {
  const [count, setCount] = useState(initialCount)
  // 在开发者工具中的这个 Hook 旁边显示标签
  // e.g. "testHook: 好好学习"
  useDebugValue('好好学习');
  return [count, setCount];
}

function Counter(props) {
  const [count, setCount] = testHook(props.initialCount);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      count is: {count}
    </button>
  );
}
```

### 延迟格式化 debug 值

在某些情况下，格式化值的显示可能是一项开销很大的操作。除非需要检查 Hook，否则没有必要这么做。

因此，`useDebugValue` 接受一个格式化函数作为可选的第二个参数。该函数只有在 Hook 被检查时才会被调用。它接受 debug 值作为参数，并且会返回一个格式化的显示值。

例如，一个返回 `Date` 值的自定义 Hook 可以通过格式化函数来避免不必要的 `toDateString` 函数调用：

```js
//只有在 Hook 被检查时才会被调用
useDebugValue(date, date => date.toDateString());
```

## useId

## useSyncExternalStore

在组件顶层调用 useSyncExternalStore 以从外部 store 读取值。
```jsx
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

## useActionState