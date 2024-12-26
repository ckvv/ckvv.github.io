---
title: "React Hook State"
tags: ['React']
date: "2024-08-24"
---

## useState

在函数组件中存储内部 state

```jsx
const [state, setState] = useState(initialState);
```

参数:

- `initialState`: state初始值, 如果传递函数作为 `initialState`，则它将被视为初始化函数。它应该是纯函数，不应该接受任何参数，并且应该返回一个任何类型的值。当初始化组件时，React 将调用你的初始化函数，并将其返回值存储为初始状态。

返回值:

- `state`: 当前的 state
- `setState`: 更新 state 的方法, 它接收一个新的 state 值并将组件的一次重新渲染加入队列。如果你的更新函数返回值与当前 state 完全相同，则随后的重渲染会被完全跳过

### 基础用法

这个例子用来显示一个计数器。当你点击按钮，计数器的值就会增加

```jsx
function Counter(props) {
  const [count, setCount] = useState(props.initialCount);

  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      count is:
      {' '}
      {count}
    </button>
  );
}
Counter.defaultProps = {
  initialCount: 10,
};
```

值得注意的是，类似class 组件中的`setState`,在我们执行`setCount`时count的值不是立即更新的，而是在下一个重渲染时才会更新，后调用的 `setCount()` 将覆盖同一周期内先调用 setCount 的值。

```jsx
// 所以如在同一周期内多次执行setCount
setCount(count + 1);
setCount(count + 2);
setCount(count + 1);
// 这相当于setCount(count + 1);
```

因此count数仅增加一,解决办法可以参考`函数式更新`

### 更新状态中的对象和数组

当你想要更新一个对象时，你需要创建一个新的对象（或者将其拷贝一份）

```jsx
const [position, setPosition] = useState({
  x: 0,
  y: 0
});

setPosition({
  x: e.clientX,
  y: e.clientY
});

setPosition({
  ...position,
  y: e.clientY
});
```

### 使用 Immer 编写简洁的更新逻辑

由 Immer 提供的 draft 是一种特殊类型的对象，被称为 Proxy，它会记录你用它所进行的操作。这就是你能够随心所欲地直接修改对象的原因所在！从原理上说，Immer 会弄清楚 draft 对象的哪些部分被改变了，并会依照你的修改创建出一个全新的对象。

```jsx
import { useImmer } from 'use-immer';

const [person, updatePerson] = useImmer({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});

updatePerson((draft) => {
  draft.name = e.target.value;
});
```

### 函数式更新

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给State Hook 的更新函数，该回调函数将接收先前的 state，并返回一个更新后的值。

```jsx
setCount(count => count + 1);
```

```jsx
setCount(count => count + 1);
setCount(count => count + 2);
setCount(count => count + 1);
// 这相当于setCount(count + 4);
```

与 class 组件中的 `setState` 方法不同，`setState` 不会自动合并更新对象。你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。

```jsx
const [people, setPeople] = useState({
  age: 18,
  name: '小红',
});

setPeople({
  age: people.age + 1,
});

// 不会自动合并更新对象
// people {age: 18}

setPeople(prevState => {
  ..prevState,
  age: prevState.age + 1,
});

// people {age: 19, name: '小红'}
```

### 惰性初始 state

`initialState` 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略。如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用（在严格模式中，React 将两次调用初始化函数）。

```jsx
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

### 跳过 state 更新

如果您将 State Hook 更新为与当前状态相同的值，React 将跳过子组件的渲染及 effect 的执行。（React 使用 [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 来比较 state）

如下面由于`Object.is`对比前后两次的state值未改变(引用内存中的同一个对象),所以未触发组件的更新。

```jsx
function CountButton() {
  const countObj = {
    value: 18
  };
  const [count, setCount] = useState(countObj);
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          countObj.value++;
          console.log(countObj);
          setCount(countObj);
          // setCount({...countObj}); 如果想要触发更新可以这样做
        }}
      >
        count is:
        {' '}
        {count.value}
      </button>
    </div>
  );
}
```

### 使用 key 重置 state 状态

当在相同的位置渲染相同的组件时，React 会保留状态。通过 key 传递给 组件，每当 key 变化时，React 将重新创建 DOM，并 重置 组件和它的所有子组件的 state

```jsx
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ 当 key 变化时，该组件内的 comment 或其他 state 会自动被重置
  const [comment, setComment] = useState('');
  // ...
}
```

### 存储前一次渲染的信息

当你在渲染期间调用 set 函数时，React 将在你的组件使用 return 语句退出后立即重新渲染该组件，**并在渲染子组件前进行**。这样，子组件就不需要进行两次渲染。你的组件函数的其余部分仍会执行（然后结果将被丢弃）。如果你的条件判断在所有 Hook 调用的下方，可以提前添加一个 return; 以便更早地重新开始渲染。

```jsx
export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);

  // 在渲染时调用 set 函数时，它必须位于条件语句中，例如 prevCount !== count，并且必须在该条件语句中调用 setPrevCount(count)。否则，你的组件将在循环中重新渲染
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && (
        <p>
          The count is
          {trend}
        </p>
      )}
    </>
  );
}
```

### 存储一个函数

你不能像这样把函数放入状态

```jsx
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```
React 认为 someFunction 是一个 初始化函数，而 someOtherFunction 是一个 更新函数，于是它尝试调用它们并存储结果。要实际 存储 一个函数，你必须在两种情况下在它们之前加上 `() =>`。然后 React 将存储你传递的函数。

```jsx
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```

### 注意事项

+ set 函数 仅更新 下一次 渲染的状态变量。如果在调用 set 函数后读取状态变量，则 仍会得到在调用之前显示在屏幕上的旧值。
+ 如果你提供的新值与当前 state 相同（由 Object.is 比较确定），React 将 跳过重新渲染该组件及其子组件。
+ React 会批量处理状态更新。它会在所有事件处理函数运行 并调用其 `set` 函数后更新屏幕。这可以防止在单个事件期间多次重新渲染。如果你需要强制 React 更早地更新屏幕，例如访问 DOM，你可以使用 `flushSync`
+ 在渲染期间，只允许在当前渲染组件内部调用 set 函数。React 将丢弃其输出并立即尝试使用新状态重新渲染。你可以使用它来存储 先前渲染中的信息
+ 在严格模式中（开发环境），React 将 两次调用你的更新函数

## useReducer

对于拥有许多状态更新逻辑的组件来说，过于分散的事件处理程序可能会令人不知所措。对于这种情况，你可以将组件的所有状态更新逻辑整合到一个外部函数中, 这个函数叫作 reducer。

```tsx
useReducer(reducer, initialArg, init?)
```

参数
- reducer `(state, action) => state`：用于更新 state 的纯函数。参数为 `state` 和 `action`，返回值是更新后的 state。state 与 action 可以是任意合法值。
- initialArg：用于初始化 state 的任意值。初始值的计算逻辑取决于接下来的 init 参数。
- init：用于计算初始值的函数。如果存在，使用 `init(initialArg)` 的执行结果作为初始值，否则使用 `initialArg`。

返回值
- 当前的 state。初次渲染时，它是 init(initialArg) 或 initialArg （如果没有 init 函数）。
- dispatch `(action) => void` 函数。用于更新 state 并触发组件的重新渲染

在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 `useReducer` 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 `dispatch` 而不是回调函数 。

> `dispatch` 不会在重新渲染之间变化,所以可以安全地从 `useEffect` 或 `useCallback` 的依赖列表中省略 `dispatch`

### 基础用法

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count:
      {' '}
      {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
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
const initialState = { count: 1 };
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      // ❌ Object.is 判断返回state相同，所以将跳过子组件的渲染及副作用的执行
      state.count++;
      return state;
    case 'decrement':
      state.count--;
      return state;
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count:
      {' '}
      {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

### 避免重新创建初始值

与`useState`类似

```jsx
// 每一次渲染的时候都会被调用
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
}
```

你可以通过给  useReducer 的第三个参数传入 初始化函数 来解决这个问题：

```jsx
function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
}
```
