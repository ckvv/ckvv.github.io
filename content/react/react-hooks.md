---
title: "React Hooks 入门"
tags: ['react', 'hooks']
date: "2022-02-21"
---

在React中，如果在编写函数组件并需要向其添加一些 state，以前的做法是必须将其它转化为 class。通过一个实例化的`class`，保存组件的`state`等状态，对于每一次更新只需要调用`render`方法就可以。但是 [Class组件](https://reactjs.org/docs/react-component.html)在变得复杂之后会变得难以维护。

在`function`组件中，没有一个状态去保存这些信息，每一次函数上下文执行，所有变量，常量都重新声明，执行完毕，再被垃圾机制回收。为了保存一些状态,执行一些副作用钩子,React 16.8新增了`React Hooks`，去帮助记录组件的状态，处理一些额外的副作用。通过`React Hook` 可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 React 特性。

Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，`useState` 是允许你在 React 函数组件中添加 state 的 Hook。你可以在现有的函数组件中使用 Hook，所以通常来说`hook`使得在组件之间复用状态逻辑变得方便、更容易实现代码的关注点分离。

# Hooks API

## useState

在函数组件中存储内部 state

```jsx
const [state, setState] = useState(initialState);
```

参数:

- `initialState`: state初始值

返回值:

- `state`: 当前的 state
- `setState`: 更新 state 的方法, 它接收一个新的 state 值并将组件的一次重新渲染加入队列。如果你的更新函数返回值与当前 state 完全相同，则随后的重渲染会被完全跳过

### 基础用法

这个例子用来显示一个计数器。当你点击按钮，计数器的值就会增加

```jsx
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

值得注意的是，类似class 组件中的`setState`,在我们执行`setCount`时count的值不是立即更新的，而是在下一个重渲染时才会更新，后调用的 setCount() 将覆盖同一周期内先调用 setCount 的值。

```jsx
// 所以如在同一周期内多次执行setCount
setCount(count + 1);
setCount(count + 2);
setCount(count + 1);
// 这相当于setCount(count + 1);
```

因此count数仅增加一,解决办法可以参考`函数式更新`

### 函数式更新

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给State Hook 的更新函数，该回调函数将接收先前的 state，并返回一个更新后的值。

```jsx
setCount((count) => count + 1);
```

```jsx
setCount(count => count + 1);
setCount(count => count + 2);
setCount(count => count + 1);
// 这相当于setCount(count + 4);
```

> 与 class 组件中的 `setState` 方法不同，`setState` 不会自动合并更新对象。你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。
>
> ```jsx
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

`initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用。

```jsx
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

### 跳过 state 更新

如果您将 State Hook 更新为与当前状态相同的值，React 将跳过子组件的渲染及 effect 的执行。（React 使用 [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 来比较 state。）

如下面由于`Object.is`对比前后两次的state值未改变(引用内存中的同一个对象),所以未触发组件的更新。

```jsx
function CountButton() {
  const countObj = {
    value: 18
  };
  const [count, setCount] = useState(countObj)
  return (
    <div>
      <button type="button" onClick={() => {
          countObj.value ++;
          console.log(countObj);
          setCount(countObj);
            // setCount({...countObj}); 如果想要触发更新可以这样做
        }}>
          count is: {count.value}
        </button>
    </div>
  )
}
```

## useEffect

该 Hook 接收一个包含命令式、且可能有副作用代码的函数。在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。使用 `useEffect` 完成副作用操作。

通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作。React 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 DOM 更新之后调用它。同时你也可以使用多个effect hook，React 将按照 effect 声明的顺序依次调用组件中的*每一个* effect。

### 基础用法

```jsx
function CountButton() {
  const [count, setCount] = useState(0);

  useEffect(()=>{
    console.log(count);
  });
  return (
    <button type="button" onClick={() => setCount(count+1)}>
        count is: {count}
    </button>
  );
}

// 挂载时初始count为0，此时打印0
// 点击button，count + 1, 此时组件更新，useEffect再次执行，此时打印1
```

### 清除 effect副作用

通常，组件卸载时需要清除 effect 创建的诸如订阅或计时器 ID 等资源。要实现这一点，`useEffect` 函数需返回一个清除函数。

```jsx
// 每秒更新时间
function DateLabel() {
  const [date, setCount] = useState(new Date().toLocaleString());

  // 在执行 effect 之前会先执行上一个 effect的清除函数
  useEffect(()=>{
    const timeout = setTimeout(()=>{
      setCount(new Date().toLocaleString());
    }, 1000);
    // 清除函数会在组件卸载前执行
    return () => {
      clearTimeout(timeout);
    }
  });
  return (
    <label>
      当前时间是: {date}
    </label>
  );
}
```

为防止内存泄漏，清除函数会在组件卸载前执行。另外，如果组件多次渲染（通常如此），则**在执行下一个 effect 之前，上一个 effect 就已被清除**。在上述示例中，意味着组件的每一次更新都会创建新的订阅。若想避免每次更新都触发 effect 的执行，请参阅`effect 的执行时机`。

### effect 的执行时机

 `useEffect` 会在浏览器绘制后延迟执行，在任何新的渲染前执行。React 将在组件更新前刷新上一轮渲染的 effect。因此不应在函数中执行阻塞浏览器更新屏幕的操作。

```jsx
function CountBtn() {
  const [count, setCount] = useState(0);
    // 在useEffect之前调用
  console.log('函数中;useEffect前',count);

  useEffect(()=>{
    // Dom 已经变化
    console.log(document.querySelector('.count-btn').textContent);
  });

  // 在useEffect之前调用
  console.log('函数中;useEffect后',count);

  return (
    <button className='count-btn' onClick={() => setCount(count => count +1)}>
      当前count: {count}
    </button>
  );
}
```

### effect 的条件执行

默认情况下，effect 会在每轮组件渲染完成后执行。这样的话，一旦 effect 的依赖发生变化，它就会被重新创建。

如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React **跳过**对 effect 的调用，

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

- 请确保数组中包含了**所有外部作用域中会随时间变化并且在 effect 中使用的变量**，否则你的代码会引用到先前渲染中的旧变量。

- 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组作为第二个参数。effect 内部的 props 和 state 就会一直拥有其初始值。
  
  ```jsx
  function Count() {
    const [count, setCount] = useState(0);
  
    useEffect(()=>{
      const timeout = setInterval(()=>{
        // 点击button后虽然count改变但是count依然为0
        console.log(count);
      }, 1000);
      return () => {
        clearInterval(timeout);
      }
    }, []);
    return (
      <button onClick={() => setCount(count + 1)}>
        当前count: {count}
      </button>
    );
  }
  ```

## useContext

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。调用了 `useContext` 的组件总会在 context 值变化时重新渲染。如果重渲染组件的开销较大，你可以 [通过使用 memoization 来优化](https://github.com/facebook/react/issues/15156#issuecomment-474590693)。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext` provider 的 context `value` 值。即使祖先使用 [`React.memo`](https://react.docschina.org/docs/react-api.html#reactmemo) 或 [`shouldComponentUpdate`](https://react.docschina.org/docs/react-component.html#shouldcomponentupdate)，也会在组件本身使用 `useContext` 时重新渲染。

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

## useReducer

[`useState`](https://react.docschina.org/docs/hooks-reference.html#usestate) 的替代方案。它接收一个形如 `(state, action) => newState` 的 reducer，并返回当前的 state 以及与其配套的 `dispatch` 方法。

在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为[你可以向子组件传递 `dispatch` 而不是回调函数](https://react.docschina.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 。

> `dispatch` 不会在重新渲染之间变化,所以可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `dispatch`

### 基础用法

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

### 惰性初始化

你可以选择惰性地创建初始 state。为此，需要将 `init` 函数作为 `useReducer` 的第三个参数传入，这样初始 state 将被设置为 `init(initialArg)`

```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init);
// state = init(initialArg);
```

### 跳过 dispatch

与`useState`类似，如果 Reducer Hook 的返回值与当前 state 相同，React 将跳过子组件的渲染及副作用的执行。

```jsx
const initialState = {count: 1};
function reducer(state, action) {
  console.log(state);
  switch (action.type) {
    case 'increment':
        // Object.is 判断返回state相同，所以将跳过子组件的渲染及副作用的执行
      state.count ++;
      return state;
    case 'decrement':
      state.count --;
      return state;
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

## useCallback

把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用`引用相等性`去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

```jsx
//当a&b不变时返回同一个memoizedCallback（引用不变）
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
// ``useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`
```

> 依赖项数组不会作为参数传给回调函数。虽然从概念上来说它表现为：所有回调函数中引用的值都应该出现在依赖项数组中。未来编译器会更加智能，届时自动创建数组将成为可能

### 基础用法

下面的例子中如果`const getLabel = () => label.toUpperCase();` 当count改变时会导致CountButton重新渲染，每次都会重新声明`getLabel`函数导致传递给Label组件的引用发生改变，引起不必要的渲染。

```jsx
import { useCallback, useState, useEffect } from "react";

function Label({getLabel}) {
  useEffect(()=>{
    //如果getLabel引用改变会导致useEffect执行
    console.log('useEffect: getLabel')
  }, [getLabel]);
  return(
    <label> { getLabel() } </label>
  )
}

function CountButton() {
  let [ label, setLabel ] = useState('');
  let [ count, setCount ] = useState(0);
  // 如果label未改变每次重新渲染，返回的getLabel引用值相同
  const getLabel = useCallback(() => {
    return label.toUpperCase();
  }, [label]);
  return (
    <div>
      lable: <input type="text" onChange={(e) => setLabel(e.target.value)}/>
      <button type="button" onClick={() => setCount(count + 1)}>
          count is: {count}
      </button>
      <Label getLabel={ getLabel }/>
    </div>
  );
}

export default CountButton;
```

## useMemo

把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

- 传入 `useMemo` 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴

- 如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值。

- **你只可以把 `useMemo` 作为性能优化的手段，但不要把它当成语义上的保证。**将来，React 可能会选择“遗忘”以前的一些 memoized 值并在下次渲染时重新计算它们

```jsx
//当a&b不变时返回memoizedValue（引用不变）
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### 基础用法

```jsx
function CountButton() {
  let [ label, setLabel ] = useState('');
  let [ count, setCount ] = useState(0);
  // 如果依赖项label不变memoizedValue不会重新计算
  const memoizedValue = useMemo(()=>{
    console.log('useMemo');
    return label.toUpperCase();
  }, [label]);
  return (
    <div>
      lable: <input type="text" onChange={(e) => setLabel(e.target.value)}/>
      {memoizedValue}
      <button type="button" onClick={() => setCount(count + 1)}>
          count is: {count}
      </button>
    </div>
  );
}
```

## useRef

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（`initialValue`）。返回的 ref 对象在组件的整个生命周期内保持不变。

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
// `.current` 属性改变不会引发组件重新渲染
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

## useImperativeHandle

`useImperativeHandle` 可以让你在使用 `ref` 时自定义暴露给父组件的实例值。`useImperativeHandle` 应当与 [`forwardRef`](https://react.docschina.org/docs/react-api.html#reactforwardref) 一起使用：

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

## useLayoutEffect

其函数签名与 `useEffect` 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，`useLayoutEffect` 内部的更新计划将被同步刷新。

尽可能使用标准的 `useEffect` 以避免阻塞视觉更新。

### 基础用法

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

# 关于hooks的问题

## Hooks的原理

React 保持对当前渲染中的组件的追踪。多亏了 [Hook 规范](https://zh-hans.reactjs.org/docs/hooks-rules.html)，我们得知 Hook 只会在 React 组件中被调用（或自定义 Hook —— 同样只会在 React 组件中被调用）。

每个组件内部都有一个「记忆单元格」列表。它们只不过是我们用来存储一些数据的 JavaScript 对象。当你用 `useState()` 调用一个 Hook 的时候，它会读取当前的单元格（或在首次渲染时将其初始化），然后把指针移动到下一个。这就是多个 `useState()` 调用会得到各自独立的本地 state 的原因。

```js
// 每次执行一个`hooks`函数，都产生一个`hook`对象，里面保存了当前`hook`信息,
// 然后将每个`hooks`以链表形式串联起来，并赋值给`workInProgress`的`memoizedState`。
// 也就证实了上述所说的，函数组件用`memoizedState`存放`hooks`链表。
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,

    baseState: null,
    baseQueue: null,
    queue: null,

    next: null,
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```

所以一旦在条件语句中声明`hooks`，在下一次函数组件更新，`hooks`链表结构，将会被破坏，`current`树的`memoizedState`缓存`hooks`信息，和当前`workInProgress`不一致，如果涉及到读取`state`等操作，就会发生异常

## Hooks的使用限制

### 只在最顶层使用 Hook

**不要在循环，条件或嵌套函数中调用 Hook，** 确保总是在你的 React 函数的最顶层调用他们。遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 `useState` 和 `useEffect` 调用之间保持 hook 状态的正确。参考`Hooks的原理`

> 如果我们想要有条件地执行一个 effect，可以将判断放到 Hook 的*内部*：
>
> ```js
> useEffect(function persistForm() {
>   // 👍 将条件判断放置在 effect 中
>   if (name !== '') {
>     localStorage.setItem('formData', name);
>   }
> });
> ```

### 只在 React 函数中调用 Hook

**不要在普通的 JavaScript 函数中调用 Hook**你可以：

- ✅ 在 React 的函数组件中调用 Hook
- ✅ 在自定义 Hook 中调用其他 Hook

遵循此规则，确保组件的状态逻辑在代码中清晰可见。

### 自定义 Hook 必须以 “`use`” 开头

这个约定非常重要。不遵循的话，由于无法判断某个函数是否包含对其内部 Hook 的调用，React 将无法自动检查你的 Hook 是否违反了 [Hook 的规则](https://zh-hans.reactjs.org/docs/hooks-rules.html)。

# 参考文档

- <https://zh-hans.reactjs.org/docs/hooks-reference.html>

- <https://zhuanlan.zhihu.com/p/376914196>
