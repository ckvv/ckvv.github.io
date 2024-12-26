---
title: "React Hook 性能"
tags: ['React']
date: "2024-08-24"
---

## useMemo

把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

### 参考

```jsx
const cachedValue = useMemo(calculateValue, dependencies?)
```

参数
- `calculateValue`：要缓存计算值的函数。它应该是一个没有任何参数的纯函数，并且可以返回任意类型。React 将会在首次渲染时调用该函数
- `dependencies`: 如果 dependencies 没有发生变化，React 将直接返回相同值。否则，将会再次调用 calculateValue 并返回最新结果，然后缓存该结果以便下次重复使用

返回值
- 不带参数调用 calculateValue 的结果, 如果依赖项没有发生改变，它将返回上次缓存的值

### 注意事项

- 传入 `useMemo` 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴
- 如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值。
- **你只可以把 `useMemo` 作为性能优化的手段，但不要把它当成语义上的保证。**将来，React 可能会选择“遗忘”以前的一些 memoized 值并在下次渲染时重新计算它们
- 你不能在循环语句或条件语句中调用它
- 在严格模式下，为了 帮你发现意外的错误，React 将会 调用你的计算函数两次

```jsx
// 当a&b不变时返回memoizedValue（引用不变）
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### 基础用法

```jsx
function CountButton() {
  const [label, setLabel] = useState('');
  const [count, setCount] = useState(0);
  // 如果依赖项label不变memoizedValue不会重新计算
  const memoizedValue = useMemo(() => {
    return label.toUpperCase();
  }, [label]);
  return (
    <div>
      lable:
      {' '}
      <input type="text" onChange={e => setLabel(e.target.value)} />
      {memoizedValue}
      <button type="button" onClick={() => setCount(count + 1)}>
        count is:
        {' '}
        {count}
      </button>
    </div>
  );
}
```

### 跳过组件的重新渲染

```jsx
// 当一个组件重新渲染时，React 会递归地重新渲染它的所有子组件
export default function TodoList({ todos, tab, theme }) {
  // 每当主题发生变化时，这将是一个不同的数组……
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... 所以List的props永远不会一样，每次都会重新渲染 */}
      <List items={visibleTodos} />
    </div>
  );
}
```

`useMemo` 中，你可以确保它在重新渲染之间具有相同值，直到依赖项发生变化
```jsx
export default function TodoList({ todos, tab, theme }) {
  // 告诉 React 在重新渲染之间缓存你的计算结果...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...所以只要这些依赖项不变...
  );

  return (
    <div className={theme}>
      {/* ... List 也就会接受到相同的 props 并且会跳过重新渲染 */}
      <List items={visibleTodos} />
    </div>
  );
}

// 你也可以将 <List /> JSX 节点本身包裹在 useMemo 中
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

## useCallback

在组件顶层调用 useCallback 以便在多次渲染中缓存函数, 该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用`引用相等性`去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

### 参考

```jsx
useCallback(fn, dependencies);
```

参数
- `fn`：在多次渲染中需要缓存的函数, React 不会调用此函数，而是返回此函数。你可以自己决定何时调用以及是否调用
- `dependencies`: 函数内部需要使用到的所有组件内部值的 依赖列表，在其变化时会重新调用回调函数

返回值
- 在初次渲染时，返回 fn 函数，在之后的渲染中, 如果依赖没有改变，返回上一次渲染中缓存的 fn 函数；否则返回这一次渲染传入的 fn

注意事项
- 如果你忘记使用依赖数组，useCallback 每一次都将返回一个新的函数

```jsx
// ``useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`
function ProductPage({ productId, referrer, theme }) {
  // 在多次渲染中缓存函数
  const handleSubmit = useCallback((orderDetails) => {
    post(`/product/${productId}/buy`, {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // 只要这些依赖没有改变

  return (
    <div className={theme}>
      {/* ShippingForm 就会收到同样的 props 并且跳过重新渲染 */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

> 依赖项数组不会作为参数传给回调函数。虽然从概念上来说它表现为：所有回调函数中引用的值都应该出现在依赖项数组中。未来编译器会更加智能，届时自动创建数组将成为可能

### 跳过组件的重新渲染

下面的例子中如果`const getLabel = () => label.toUpperCase();` 当count改变时会导致CountButton重新渲染，每次都会重新声明`getLabel`函数导致传递给Label组件的引用发生改变，引起不必要的渲染。

```jsx
import { useCallback, useEffect, useState } from 'react';

function Label({ getLabel }) {
  useEffect(() => {
    // 如果getLabel引用改变会导致useEffect执行
    console.log('useEffect: getLabel');
  }, [getLabel]);
  return (
    <label>
      {' '}
      { getLabel() }
      {' '}
    </label>
  );
}

export function CountButton() {
  const [label, setLabel] = useState('');
  const [count, setCount] = useState(0);
  // 如果label未改变每次重新渲染，返回的getLabel引用值相同
  const getLabel = useCallback(() => {
    return label.toUpperCase();
  }, [label]);
  return (
    <div>
      lable:
      {' '}
      <input type="text" onChange={e => setLabel(e.target.value)} />
      <button type="button" onClick={() => setCount(count + 1)}>
        count is:
        {' '}
        {count}
      </button>
      <Label getLabel={getLabel} />
    </div>
  );
}
```

### 防止频繁触发 Effect

```jsx
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ 仅当 roomId 更改时更改, 避免每一次渲染中都会发生改变

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ 仅当 createOptions 更改时更改
}

// 最好消除对函数依赖项的需求
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ 无需使用回调或函数依赖！
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 仅当 roomId 更改时更改
}
```

### 优化自定义 Hook
自定义 Hook，返回的任何函数最后包裹在 `useCallback` 中

```jsx
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

## useTransition

### 参考

```jsx
const [isPending, startTransition] = useTransition();
```

参数
- 无

返回值
- `isPending` 告诉你是否存在待处理的 transition。
- `startTransition` 函数(**必须是同步的**)，你可以使用此方法将状态更新标记为 transition （缓慢的重新渲染不会冻结用户界面）。

注意事项
- useTransition 是一个 Hook，因此不能在组件外部调用
- 传递给 startTransition 的函数不会被延迟执行， 但是在它运行的同时安排的任何状态更新都被标记为 transition

```jsx
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);

// 1 2 3
```

### 将状态更新标记为非阻塞的 transition

transition 可以使用户界面的更新在慢速设备上仍保持响应性。通过 transition，UI 仍将在重新渲染过程中保持响应性。例如用户点击一个选项卡，但改变了主意并点击另一个选项卡，他们可以在不等待第一个重新渲染完成的情况下完成操作。
```jsx
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ……
}
```

### 在 transition 中更新父组件

由于父组件的状态更新在 onClick 事件处理程序内，所以该状态更新会被标记为 transition, 由于更新选定选项卡被标记为了 transition，因此它不会阻止用户交互
```jsx
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>;
  }
  // isPending 布尔值来向用户表明当前处于 transition 中
  if (isPending) {
    return <b className="pending" style={{ color: 'red' }}>{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}
    >
      {children}
    </button>
  );
}
```

### 在 transition 中无法更新输入框内容

这是因为 transition 是非阻塞的，但是在响应更改事件时更新输入应该是同步的。如果想在输入时运行一个 transition，那么有两种做法：

- 声明两个独立的状态变量：一个用于输入状态（它总是同步更新），另一个用于在 transition 中更新。这样，便可以使用同步状态控制输入，并将用于 transition 的状态变量（它将“滞后”于输入）传递给其余的渲染逻辑。
- 或者使用一个状态变量，并添加 useDeferredValue，它将“滞后”于实际值，并自动触发非阻塞的重新渲染以“追赶”新值。

```jsx
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ 不应将受控输入框的状态变量标记为 transition
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

## useDeferredValue

延迟更新 UI 的某些部分, 被推迟的“后台”渲染是可中断的。例如，如果你再次在输入框中输入，React 将会中断渲染，并从新值开始重新渲染。React 总是使用最新提供的值。

### 参考

```jsx
const deferredValue = useDeferredValue(value);
```

参数
- value：你想延迟的值，可以是任何类型

返回值
- 在组件的初始渲染期间，返回的延迟值将与你提供的值相同。但是在组件更新时，React 将会先尝试使用旧值进行重新渲染（因此它将返回旧值），然后再在后台使用新值进行另一个重新渲染（这时它将返回更新后的值）

### 延迟渲染 UI 的某些部分

当你的 UI 某个部分重新渲染很慢、没有简单的优化方法，同时你又希望避免它阻塞其他 UI 的渲染时，使用 useDeferredValue 很有帮助。

```jsx
// 有一个文本框和一个组件（例如图表或长列表），在每次按键时都会重新渲染
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}

const SlowList = memo(({ text }) => {
  // ...
});
```

当这些 props 不同 时，并且实际上需要展示不同的视觉输出时，页面会变得很慢,主要的性能问题在于，每次你输入内容时，SlowList 都会接收新的 props，并重新渲染整个树结构，这会让输入感觉很卡顿。使用 useDeferredValue 能够优先更新输入框（必须快速更新），而不是更新结果列表（可以更新慢一些）

```jsx
// 这并没有让 SlowList 的重新渲染变快。然而，它告诉 React 可以将列表的重新渲染优先级降低，这样就不会阻塞按键输入
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

### React Compiler (React 编译器)

为了优化应用程序，React Compiler 之前 我们需要通过useMemo、useCallback 和 React.memo 等 API 你可以告诉 React 如果它们的输入没有改变，你的应用程序的某些部分就不需要重新计算，从而减少了更新的工作。虽然功能强大，但很容易忘记应用记忆化或错误地应用它们。
React Compiler 是一个新的实验性编译器, 编译器利用其 JavaScript 和 React 规则的知识来自动记住组件和 hook 中的值或值组。如果它检测到规则的破坏，它将自动跳过这些组件或 hook，并继续安全地编译其他代码。

在 Vite 中启用
```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const ReactCompilerConfig = { /* ... */ };
export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ['babel-plugin-react-compiler', ReactCompilerConfig],
          ],
        },
      }),
    ],
  };
});

// 现在打开 React Devtools （v5.0+） 即可看到组件旁边显示 “Memo ✨ ”
```

其他用法参考官网<https://react.dev/learn/react-compiler>
