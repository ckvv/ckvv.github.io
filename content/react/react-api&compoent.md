---
title: "React API & 组件"
tags: ['React']
date: "2024-08-25"
---

# API
react 包还导出了一些其他的 API，这些 API 对于创建组件非常有用

## createContext
可以创建一个 context，你可以将其提供给子组件，通常会与 useContext 一起配合使用。

## forwardRef
允许组件将 DOM 节点作为 ref 暴露给父组件。

## lazy 

允许你延迟加载组件，直到该组件需要第一次被渲染。

```jsx
lazy(load)
```

参数 
- `load`: 一个返回 Promise 或另一个 thenable（具有 then 方法的类 Promise 对象）的函数。React 不会在你尝试首次渲染返回的组件之前调用 load 函数。在 React 首次调用 load 后，它将等待其解析，然后将解析值的 .default 渲染为 React 组件。返回的 Promise 和 Promise 的解析值都将被缓存，因此 React 不会多次调用 load 函数。如果 Promise 被拒绝，则 React 将抛出拒绝原因给最近的错误边界处理。

返回值 
- lazy 返回一个 React 组件，你可以在 fiber 树中渲染。当懒加载组件的代码仍在加载时，尝试渲染它将会处于 暂停 状态。使用 <Suspense> 可以在其加载时显示一个正在加载的提示。

```jsx
import { lazy } from 'react';
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
// 此代码依赖于 动态 import()，因此可能需要你的打包工具或框架提供支持。使用这种模式要求导入的懒加载组件必须作为 default 导出。

<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
</Suspense>
```

### 不要在其他组件 内部 声明 lazy 组件

```jsx
import { lazy } from 'react';

// ✅ Good: 将 lazy 组件声明在组件外部
// const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // 🔴 Bad: 这将导致在重新渲染时重置所有状态
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

## memo 

React 通常在其父组件重新渲染时重新渲染一个组件。你可以使用 memo 创建一个组件，当它的父组件重新渲染时，只要它的新 props 与旧 props 相同时，React 就不会重新渲染它。这样的组件被称为 记忆化的（memoized）组件。通常 useMemo 与 useCallback 一起配合使用。

### 参考

```jsx
memo(Component, arePropsEqual?)
```

参数 
- `Component`：要进行记忆化的组件。memo 不会修改该组件，而是返回一个新的、记忆化的组件。它接受任何有效的 React 组件，包括函数组件和 forwardRef 组件。
- `arePropsEqual`：一个函数，接受两个参数：组件的前一个 props 和新的 props。如果旧的和新的 props 相等，即组件使用新的 props 渲染的输出和表现与旧的 props 完全相同，则它应该返回 true。否则返回 false。通常情况下，你不需要指定此函数。默认情况下，React 将使用 `Object.is` 比较每个 prop。

返回值 
memo 返回一个新的 React 组件。它的行为与提供给 memo 的组件相同，只是当它的父组件重新渲染时 React 不会总是重新渲染它，除非它的 props 发生了变化。

### 当 props 没有改变时跳过重新渲染 

通过使用 `memo`，只要其 props 没有改变，React 就不需要重新渲染。**即使使用 memo，如果它自己的 state 或正在使用的 context 发生更改，组件也会重新渲染**。

```jsx
export const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});
```

### 最小化 props 的变化 

useMemo 避免父组件每次都重新创建该对象
```jsx
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

接受单独的值而不是整个对象
```jsx
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

接受一个布尔值，表示是否存在某个值，而不是值本身

```jsx
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```
### 自定义比较函数
你可以提供一个自定义比较函数，React 将使用它来比较旧的和新的 props，而不是使用浅比较。

```jsx
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  // 在新的 props 与旧的 props 具有相同的输出时返回 true；否则应该返回 false
  return Object.is(oldProps, newProps);
}
```

## startTransition 

startTransition 可以让你在不阻塞 UI 的情况下更新 state， startTransition 与 useTransition 非常相似，但它不提供 isPending 标志来跟踪一个 transition 是否正在进行。你可以在 useTransition 不可用时调用 startTransition。例如，在组件外部（如从数据库中）使用 startTransition

```jsx
startTransition(scope)
```

参数
- `scope`：调用一个或多个 set 函数 来更新 state 的函数。React 会立即调用没有参数的 scope，并将在 scope 函数调用期间，调度所有的 state，并将同步更新标记为 transition。

返回值
- 无

注意事项
- startTransition 没有提供一种跟踪 transition 是否处于待定状态的方法。为了在 transition 进行时显示一个待定状态的指示器，你需要使用 useTransition
- 传递给 startTransition 的函数必须是同步的。React 会立即执行此函数，将其执行期间发生的所有 state 更新标记为 transition。
- 一个被标记为 transition 的 state 更新时将会被其他 state 更新打断。例如，如果你在 transition 内部更新图表组件，但在图表重新渲染时在输入框中打字，则 React 将先处理输入 state 更新，之后才会重新启动对图表组件的渲染工作。
- 如果有多个正在进行的 transition，当前 React 会将它们集中在一起处理。这是一个限制，在未来的版本中可能会被移除。

### 将 state 更新标记为非阻塞 transition
transition 可以让用户界面在慢速设备上保持更新响应。例如，如果用户单击一个选项卡后又改变主意并单击另一个选项卡，则可以在第一次重新渲染完成之前执行此操作而无需等待。
```jsx
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

## 组件
React 提供了一些内置的组件，你可以在 JSX 中使用它们

## Fragment
通常使用 <>...</> 代替，它们都允许你在不添加额外节点的情况下将子元素组合。

```jsx
<>
  <OneChild />
  <AnotherChild />
</>
```

## Profiler
允许你编程式测量 React 树的渲染性能

参数 
- id：字符串，用于标识正在测量的 UI 部分。
- onRender：onRender 回调函数，当包裹的组件树更新时，React 都会调用它。它接收有关渲染内容和所花费时间的信息。

```jsx
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>

function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // 对渲染时间进行汇总或记录...
}
```

## StrictMode
帮助你在开发过程中尽早地发现组件中的常见错误

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

严格模式启用了以下仅在开发环境下有效的行为：
- 组件将 重新渲染一次，以查找由于非纯渲染而引起的错误。
- 组件将 重新运行 Effect 一次，以查找由于缺少 Effect 清理而引起的错误。
- 组件将被 检查是否使用了已弃用的 API。

## Suspense
允许在子组件完成加载前展示后备方案

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

参数
- `children`：真正的 UI 渲染内容。如果 children 在渲染中被挂起，Suspense 边界将会渲染 fallback。
- `fallback`：真正的 UI 未渲染完成时代替其渲染的备用 UI，它可以是任何有效的 React 节点。后备方案通常是一个轻量的占位符，例如表示加载中的图标或者骨架屏。当 children 被挂起时，Suspense 将自动切换至渲染 fallback；当数据准备好时，又会自动切换至渲染 children。如果 fallback 在渲染中被挂起，那么将自动激活最近的 Suspense 边界。

注意事项
- 如果 Suspense 正在展示 React 组件树中的内容，那么当再次被挂起时，除非导致此处更新是由 startTransition 或 useDeferredValue 引起，否则 Suspense 将展示 fallback
- 只有启用了 Suspense 的数据源才会激活 Suspense 组件， 1.支持 Suspense 的框架如 Relay 和 Next.js， 2.使用 lazy 懒加载组件代码，3.使用 use 读取 Promise 的值。（Suspense 无法 检测在 Effect 或事件处理程序中获取数据的情况）

### 逐步加载内容 

```jsx
// 调整之后，Biography 不需要“等待” Albums 加载完成就可以展示。

<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>

// 1.如果 Biography 没有加载完成，BigSpinner 会显示在整个内容区域的位置。
// 2.一旦 Biography 加载完成，BigSpinner 会被内容替换。
// 3.如果 Albums 没有加载完成，AlbumsGlimmer 会显示在 Albums 和它的父级 Panel 的位置。
// 4.最后，一旦 Albums 加载完成，它会替换 AlbumsGlimmer。
```

### 在新内容加载时展示过时内容

延迟值和 transition 都可以让你避免显示 Suspense 后备方案，而是使用内联指示器。transition 将整个更新标记为非紧急的，因此它们通常由框架和路由库用于导航。另一方面，延迟值在你希望将 UI 的一部分标记为非紧急，并让它“落后于” UI 的其余部分时非常有用

```jsx
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{ opacity: isStale ? 0.5 : 1 }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```