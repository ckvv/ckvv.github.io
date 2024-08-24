---
title: "React Hook Context"
tags: ['React']
date: "2024-08-24"
---

## useContext

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。调用了 `useContext` 的组件总会在 context 值变化时重新渲染。如果重渲染组件的开销较大，你可以 [通过使用 memoization 来优化](https://github.com/facebook/react/issues/15156#issuecomment-474590693)。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext` provider 的 context `value` 值。即使祖先使用 [`React.memo`](https://react.docschina.org/reference/react/memo) 或 [`shouldComponentUpdate`](https://react.docschina.org/reference/react/Component#shouldcomponentupdate)，也会在组件本身使用 `useContext` 时重新渲染。

### 基础用法

```jsx
import { useState, createContext, useContext } from "react";

const themes = {
  light: {
    color: "#000000",
    background: "#eeeeee"
  },
  dark: {
    color: "#ffffff",
    background: "#222222"
  }
};

// 设置Context 默认值
const ThemeContext = createContext(themes.light);

function App() {
  const [model, setModel] = useState('light');
  return (
    // 当value 变化时，调用了 useContext的组件重新渲染
    <ThemeContext.Provider value={themes[model]}>
      <Toolbar />
      <button onClick={() => setModel(model === 'light' ? 'dark' : 'light')}>Change Theme</button>
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  //useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 <Provider> 来为下层组件提供 context
  //调用了 useContext 的组件总会在 context 值变化时重新渲染 
  const theme = useContext(ThemeContext);
  return (
    <button style={{ ...theme }}>
      I am styled by theme context!
    </button>
  );
}
```

### 传递hooks

context 对象可以是任意值所以，你也可以通过 context往下传一个 `hooks` 函数

```jsx
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 提示：`dispatch` 不会在重新渲染之间变化
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```
