---
title: "React Hook Ref"
tags: ['React']
date: "2024/08/24"
---

## useRef

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数`initialValue`。返回的 ref 对象在组件的整个生命周期内保持不变, ref 允许组件 保存一些不用于渲染的信息，比如 DOM 节点或 timeout ID。与`state`不同，更新 `ref` 不会重新渲染组件。

### 参考

```jsx
const ref = useRef(initialValue);
```
参数
- `initialValue`: ref 对象的 current 属性的初始值。可以是任意类型的值。这个参数在首次渲染后被忽略

返回值
- `ref`: 返回一个只有一个`current`属性的对象, 初始值为传递的 initialValue。之后可以将其设置为其他值。如果将 ref 对象作为一个 JSX 节点的 ref 属性传递给 React，React 将为它设置 current 属性。
在后续的渲染中，useRef 将返回同一个对象。

注意事项
- 不要在渲染期间写入或者读取 ref.current
- 改变 ref.current 属性时，React 不会重新渲染组件
- 除了 初始化 外不要在渲染期间写入或者读取 ref.current
- 在严格模式下，React 将会 调用两次组件方法

### 通过 ref 操作 DOM

一个常见的用例便是命令式地访问子组件

```jsx
function TextInputWithFocusButton() {
  const inputRef = useRef(null);
  const onButtonClick = () => {
    // 当 React 创建 DOM 节点并将其渲染到屏幕时，React 将会把 DOM 节点设置为 ref 对象的 current 属性
    // 当节点从屏幕上移除时，React 将把 current 属性设置回 null
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputRef.current.focus();
  };
  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

### 保存实例变量

[`useRef()`](https://react.docschina.org/docs/hooks-reference.html#useref) Hook 不仅可以用于 DOM refs。本质上，`useRef` 就像是可以在其 `.current` 属性中保存一个可变值的“盒子”, 类似于一个 class 的实例属性。`useRef()` 和自建一个 `{current: ...}` 对象的唯一区别是，`useRef` 会在每次渲染时返回同一个 ref 对象.

当 ref 对象内容发生变化时，`useRef` 并*不会*通知你。即变更 `.current` 属性不会引发组件重新渲染。

```jsx
function TextInputWithFocusButton() {
  const countRes = useRef(0);
  return (
    <>
      <button onClick={() => {
        console.log(countRes.current);
        countRes.current = countRes.current + 1;
      }}
      >
        Focus the input
      </button>
      {countRes.current}
    </>
  );
}
```

### 获取上一轮的 props 或 state

```js
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return (
    <>
      <h1>
        Now:
        {count}
        , before:
        {prevCount}
      </h1>
      <button onClick={() => setCount(count + 1)}>Add</button>
    </>
  );
}
```

### 回调Ref

如果想要在 React 绑定或解绑 DOM 节点的 ref 时运行某些代码，你也可以传递一个函数。这个函数中接受 React 组件实例或 HTML DOM 元素作为参数,它能助你更精细地控制何时 refs 被设置和解除。

```jsx
function TextInput() {
  let textInput = null;
  // 不需要使用useRef
  const inputRef = (ele) => {
    console.log(ele);
    textInput = ele;
  };
  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={() => {
        console.log(textInput);
      }}
      >
        Focus the input
      </button>
    </>
  );
}
```

使用 ref 回调管理 ref 列表
```jsx
const itemsRef = useRef(null);
function getMap() {
  if (!itemsRef.current) {
    // 首次运行时初始化 Map。
    itemsRef.current = new Map();
  }
  return itemsRef.current;
}

return (
  <li
    key={cat.id}
    ref={node => {
      const map = getMap();
      if (node) {
        // Add to the Map
        map.set(cat, node);
      } else {
        // Remove from the Map
        map.delete(cat);
      }
    }}
  >
)
```

或者
```jsx
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // Add to the Map
    map.set(cat, node);

    return () => {
      // Remove from the Map
      map.delete(cat);
    };
  }}
>
```

### 更新 state 后立即访问 ref Dom
在第一次渲染期间，DOM 节点尚未创建，因此 ref.current 将为 null。在渲染更新的过程中，DOM 节点还没有更新。所以读取它们还为时过早, 要解决此问题，你可以强制 React 同步更新（“刷新”）DOM。 为此，从 `react-dom` 导入 `flushSync` 并将 state 更新包裹 到 `flushSync` 调用中：

```jsx
//  flushSync 中的代码执行后，立即同步更新 DOM
flushSync(() => {
  setTodos([...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

### 访问另一个组件的 DOM 节点
默认情况下，React 不允许组件访问其他组件的 DOM 节点。甚至自己的子组件也不行，想要 暴露其 DOM 节点的组件必须选择该行为。

```jsx
// MyInput 组件是使用 forwardRef 声明的。 这让从上面接收的 inputRef 作为第二个参数 ref 传入组件
// MyInput 组件将自己接收到的 ref 传递给它内部的 <input>
// useImperativeHandle可以限制暴露的功能
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

```jsx
<MyInput ref={inputRef} />;
```

### 不要在渲染期间读取、写入 ref

```jsx
function MyComponent() {
  // ...
  // 🚩 不要在渲染期间写入 ref
  myRef.current = 123;
  // ...
  // 🚩 不要在渲染期间读取 ref
  return <h1>{myOtherRef.current}</h1>;
}
```

可以在 事件处理程序或者 Effect 中读取和写入 ref。
```jsx
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ 可以在 Effect 中读取和写入 ref
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ 可以在事件处理程序中读取和写入 ref
    doSomething(myOtherRef.current);
  }
  // ...
}
```

+ React 的渲染过程需要是可预测和确定的。如果在渲染期间允许读取或写入 ref，可能会导致渲染结果的不确定性
+ 读取或写入 ref 可能会触发组件的重新渲染，从而导致无限循环
+ React 通常会对多个状态更新进行批处理，以提高性能。如果在渲染期间允许读取或写入 ref，可能会破坏这种批处理机制。因为 ref 的值不受 React 的状态管理系统控制，直接读取或写入 ref 可能会导致不一致的状态和渲染结果。
+ React 也支持异步更新，例如在使用 setState 或 useState 的回调函数中进行状态更新时，这些更新可能会被延迟执行。如果在渲染期间读取或写入 ref，可能会导致与异步更新的不一致性
+ 便于错误追踪和调试，明确错误来源，

### 避免重复创建 ref 的内容

React 会保存 ref 初始值，并在后续的渲染中忽略它, 如 `const playerRef = useRef(new VideoPlayer())`，虽然 new VideoPlayer() 的结果只会在首次渲染时使用，但是依然在每次渲染时都在调用这个方法

```jsx
function Video() {
  const playerRef = useRef(null);

  // 通常情况下，在渲染过程中写入或读取 ref.current 是不允许的。然而，在这种情况下是可以的，因为结果总是一样的，而且条件只在初始化时执行，所以是完全可预测的。
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
}
```

### 自定义组件的 ref

默认情况下，自定义组件不会暴露它们内部 DOM 节点的 ref。

```jsx
// 一个组件可以指定将它的 ref “转发”给一个子组件
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

## useImperativeHandle

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。`useImperativeHandle` 应当与 [`forwardRef`](https://react.docschina.org/reference/react/forwardRef) 一起使用：

### 参考

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

参数
- `ref`：该 ref 是你从 forwardRef 渲染函数 中获得的第二个参数
- `create`Handle：该函数无需参数，它返回你想要暴露的 ref 的句柄。该句柄可以包含任何类型。通常，你会返回一个包含你想暴露的方法的对象
- `dependencies`：createHandle 代码中所用到的所有反应式的值的列表。 如果一次重新渲染导致某些依赖项发生了改变，或你没有提供这个参数列表，createHandle 将会被重新执行，而新生成的句柄则会被分配给 ref

返回值
undefined

### 基础用法

父组件可以调用 `inputRef.current.focus()`。

```jsx
// 该渲染函数会将 ref 传递给 <input ref={ref}> 元素。
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} />;
});

function Wrapper() {
  const inputRef = useRef();
  // React 会将 <FancyButton ref={ref}> 元素的 ref 作为第二个参数传递给 React.forwardRef 函数中的渲染函数。

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>focus</button>
    </div>
  );
}
```

### createHandle 条件执行

默认情况下，在组建重新渲染后 `useImperativeHandle` 中的 `createHandle` 均会执行，为了不必要的性能损失我们可以传入依赖避免不必要的性能损失

```js
useImperativeHandle(ref, () => ({
  count,
  focus: () => {
    inputRef.current.focus();
  }
}), [count]);
```

### 注意事项

+ **不要滥用 ref**。 你应当仅在你没法通过 prop 来表达 命令式 行为的时候才使用 ref：例如，滚动到指定节点、聚焦某个节点、触发一次动画，以及选择文本等等
+ **如果可以通过 prop 实现，那就不应该使用 ref**：你不应该从一个 Model 组件暴露出 {open, close} 这样的命令式句柄，最好是像 <Modal isOpen={isOpen} /> 这样，将 isOpen 作为一个 prop。副作用 可以帮你通过 prop 来暴露一些命令式的行为。
