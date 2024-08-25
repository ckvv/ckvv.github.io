---
title: "React Hook Context"
tags: ['React']
date: "2024-08-24"
---

## useContext

使用 Context 深层传递参数

```jsx
useContext(SomeContext)
```
参数
- `SomeContext`：用 `createContext` 创建的 context。context 本身不包含信息，它只代表你可以提供或从组件中读取的信息类型。

返回值
- `useContext` 为调用组件返回 context 的值。它被确定为传递给树中调用组件上方最近的 SomeContext.Provider 的 value。如果没有这样的 provider，那么返回值将会是为创建该 context 传递给 createContext 的 defaultValue。返回的值始终是最新的。如果 context 发生变化，React 会自动重新渲染读取 context 的组件。

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。调用了 `useContext` 的组件总会在 context 值变化时重新渲染。如果重渲染组件的开销较大，你可以 [通过使用 memoization 来优化](https://github.com/facebook/react/issues/15156#issuecomment-474590693)。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext` provider 的 context `value` 值。即使祖先使用 [`React.memo`](https://react.docschina.org/reference/react/memo) 或 [`shouldComponentUpdate`](https://react.docschina.org/reference/react/Component#shouldcomponentupdate)，也会在组件本身使用 `useContext` 时重新渲染。

### 基础用法

```jsx
// ThemeContext.js
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
export const ThemeContext = createContext(themes.light);

// App.js
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

### 在传递对象和函数时优化重新渲染

你可以通过 context 传递任何值，包括对象和函数。

```jsx
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }
  // 每当 MyApp 出现重新渲染（例如，路由更新）时，这里将会是一个 不同的 对象指向 不同的 函数，因此 React 还必须重新渲染树中调用 useContext(AuthContext) 的所有组件
  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```
你可以使用 `useCallback` 包装 login 函数，并将对象创建包装到 `useMemo` 中

```jsx
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  // 即使 MyApp 需要重新渲染，调用 useContext(AuthContext) 的组件也不需要重新渲染，除非 currentUser 发生了变化。
  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

### 传递hooks

context 对象可以是任意值, 所以你也可以通过 `context` 往下传一个 `dispatch` 或 `hooks` 函数

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


### 将相关逻辑迁移到一个文件当中

你可以选择将 `context` 逻辑迁移到一个单独的文件当中, 然后在需要使用的组件中导入它

```jsx
import { createContext, useReducer } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```