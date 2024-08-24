---
title: "React Hook Ref"
tags: ['React']
date: "2024-08-24"
---

## useRef

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数`initialValue`。返回的 ref 对象在组件的整个生命周期内保持不变, ref 允许组件 保存一些不用于渲染的信息，比如 DOM 节点或 timeout ID。与`state`不同，更新 `ref` 不会重新渲染组件。
### 基础用法

一个常见的用例便是命令式地访问子组件

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
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
      }}>Focus the input</button>
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
      <h1>Now: {count}, before: {prevCount}</h1>
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
  const inputRef = (ele)=>{
    console.log(ele);
    textInput = ele;
  };
  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={() => {console.log(textInput)}}>Focus the input</button>
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
  setTodos([ ...todos, newTodo]);
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
<MyInput ref={inputRef} />
```

## useImperativeHandle

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。`useImperativeHandle` 应当与 [`forwardRef`](https://react.docschina.org/reference/react/forwardRef) 一起使用：

```js
useImperativeHandle(ref, createHandle, [deps])
```

### 基础用法

父组件可以调用 `inputRef.current.focus()`。

```jsx
//该渲染函数会将 ref 传递给 <input ref={ref}> 元素。
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} />;
}
FancyInput = forwardRef(FancyInput);

function Wrapper(){
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

### createHandle条件执行

默认情况下，在组建重新渲染后useImperativeHandle中的createHandle 均会执行，为了不必要的性能损失我们可以传入依赖避免不必要的性能损失

```js
useImperativeHandle(ref, () => ({
  count,
  focus: () => {
    inputRef.current.focus();
  }
}), [count]);
```
