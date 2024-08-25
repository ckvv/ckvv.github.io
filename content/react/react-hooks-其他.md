---
title: "React Hook 其他"
tags: ['React']
date: "2024-08-24"
---

## useDebugValue

`useDebugValue` 可用于在 React 开发者工具中显示自定义 hook 的标签。

```js
useDebugValue(value, format?)
```
参数 
- `value`：在 React 开发工具中显示的值。可以是任何类型。
- `format`：它接受一个格式化函数。当组件被检查时，React 开发工具将用 value 作为参数来调用格式化函数，然后显示返回的格式化值（可以是任何类型）。如果不指定格式化函数，则会显示 value。

返回值 
- `useDebugValue` 没有返回值。

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
生成传递给无障碍属性的唯一 ID
```jsx
const id = useId();
```

### 基础用法
为无障碍属性生成唯一 ID
```jsx
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        密码:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        密码应该包含至少 18 个字符
      </p>
    </>
  );
}
```

### 为多个相关元素生成 ID

```jsx
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>名字：</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>姓氏：</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

### 为所有生成的 ID 指定共享前缀 

如果你在单个页面上渲染多个独立的 React 应用程序，请在 `createRoot` 或 `hydrateRoot` 调用中将 identifierPrefix 作为选项传递。这确保了由两个不同应用程序生成的 ID 永远不会冲突

```jsx
import { createRoot } from 'react-dom/client';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

### 为什么 useId 比递增计数器更好
useId 的主要好处是 React 确保它能够与 服务端渲染一起工作。 在服务器渲染期间，你的组件生成输出 HTML。随后，在客户端，hydration 会将你的事件处理程序附加到生成的 HTML 上。由于 hydration，客户端必须匹配服务器输出的 HTML。

使用递增计数器很难保证这一点，因为客户端组件被 hydrate 处理后的顺序可能与服务器 HTML 的顺序不匹配。调用 useId 可以确保 hydration 正常工作，以及服务器和客户端之间的输出相匹配。

在 React 内部，调用组件的“父路径”生成 useId。这就是为什么如果客户端和服务器的树相同，不管渲染顺序如何，“父路径”始终都匹配。


## useSyncExternalStore

在组件顶层调用 useSyncExternalStore 以从外部 store 读取值。
```jsx
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

参数
- `subscribe`：一个函数，接收一个单独的 `callback` 参数并把它订阅到 store 上。当 store 发生改变，它应当调用被提供的 callback。这会导致组件重新渲染。`subscribe` 函数会返回清除订阅的函数。
- `getSnapshot`：一个函数，返回组件需要的 store 中的数据快照。在 store 不变的情况下，重复调用 getSnapshot 必须返回同一个值。如果 store 改变(`Object.is`)，React 就会重新渲染组件
- `getServerSnapshot`：一个函数，返回 store 中数据的初始快照。它只会在服务端渲染时，以及在客户端进行服务端渲染内容的 hydration 时被用到。快照在服务端与客户端之间必须相同，它通常是从服务端序列化并传到客户端的。如果你忽略此参数，在服务端渲染这个组件会抛出一个错误。

返回值
- 该 store 的当前快照

### 把逻辑抽取到自定义 Hook

```jsx
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

### 服务端渲染支持 
如果你连接到一个浏览器特有的 API，因为它在服务端不存在，所以是不可行的， 你需要传一个 `getServerSnapshot` 函数作为第三个参数给 `useSyncExternalStore`

```jsx
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getServerSnapshot() {
  return true; // 服务端生成的 HTML 总是显示“在线”
}
// 确保客户端初始渲染与服务端渲染时 getServerSnapshot 返回完全相同的数据。例如，如果在服务端 getServerSnapshot 返回一些预先载入的 store 内容，你就需要把这些内容也传给客户端。一种方法是在服务端渲染时，生成 <script> 标签来设置像 window.MY_STORE_DATA 这样的全局变量，并在客户端 getServerSnapshot 内读取此全局变量。
```



### 注意事项

+ 如果在重新渲染时传入一个不同的 subscribe 函数（如组件内声明的函数），React 会用新传入的 subscribe 函数重新订阅该 store。你可以通过在组件外声明 subscribe 来避免
+ getSnapshot 不要总是返回不同的对象
```jsx
function getSnapshot() {
  // 🔴 getSnapshot 不要总是返回不同的对象
  return {
    todos: myStore.todos
  };
}
```
+  subscribe 函数每次重新渲染都被调用
```jsx
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🔴 总是不同的函数，所以 React 每次重新渲染都会重新订阅
  // ✅ 你可以把subscribe 提到组件外部 或者包在 useCallback 里面
  function subscribe() {
    // ...
  }
}
```

## useActionState（todo）
## useOptimistic（todo）
## use(todo)
