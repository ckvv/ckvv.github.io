---
title: "react hooks 入门"
tags: ['react', 'hooks']
date: "2022-02-21"
---

在React中，如果你在编写函数组件并意识到需要向其添加一些 state，以前的做法是必须将其它转化为 class。但是 [Class组件](https://reactjs.org/docs/react-component.html)在变得复杂之后会变得难以维护, 通过`React Hook` (React 16.8 的新增特性) 可以让你在不编写 `class` 的情况下使用 `state` 以及其他的 React 特性。

Hook 是一个特殊的函数，它可以让你“钩入” React 的特性。例如，`useState` 是允许你在 React 函数组件中添加 state 的 Hook。现在你可以在现有的函数组件中使用 Hook，所以通常来说`hook`使得在组件之间复用状态逻辑变得便捷、逻辑也更清晰。

# Hooks API
## useState
在函数组件中存储内部 state
```js
const [state, setState] = useState(initialState);
```
参数:
- `initialState`: state初始值

返回值: 
- `state`: 当前的 state
- `setState`: 更新 state 的方法, 它接收一个新的 state 值并将组件的一次重新渲染加入队列。如果你的更新函数返回值与当前 state 完全相同，则随后的重渲染会被完全跳过

### 基础用法

这个例子用来显示一个计数器。当你点击按钮，计数器的值就会增加

```js
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

```js
// 所以如在同一周期内多次执行setCount
setCount(count + 1);
setCount(count + 2);
setCount(count + 1);
// 这相当于setCount(count + 1);
```

因此count数仅增加一,解决办法可以参考`函数式更新`



### 函数式更新

如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给State Hook 的更新函数，该回调函数将接收先前的 state，并返回一个更新后的值。

```js
setCount((count) => count + 1);
```

```js
setCount(count => count + 1);
setCount(count => count + 2);
setCount(count => count + 1);
// 这相当于setCount(count + 4);
```

> 与 class 组件中的 `setState` 方法不同，`setState` 不会自动合并更新对象。你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果。
>
> ```js
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

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

### 跳过 state 更新

如果您将 State Hook 更新为与当前状态相同的值，React 将跳过子组件的渲染及 effect 的执行。（React 使用 [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 来比较 state。）



如下面由于`Object.is`对比前后两次的state值未改变(引用内存中的同一个对象),所以未触发组件的更新。

```js
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

```js
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

```js
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

```js
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

```js
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新

```

+ 请确保数组中包含了**所有外部作用域中会随时间变化并且在 effect 中使用的变量**，否则你的代码会引用到先前渲染中的旧变量。

+ 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组作为第二个参数。effect 内部的 props 和 state 就会一直拥有其初始值。

  ```js
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
### 基础用法
## useReducer
### 基础用法
## useCallback
### 基础用法
## useMemo
### 基础用法
## useRef
### 基础用法
## useImperativeHandle
### 基础用法
## useLayoutEffect
### 基础用法
## useDebugValue
### 基础用法



# 关于hooks
## Hooks的原理
## Hooks的使用限制
## React Hooks与Vue3 Composition API的区别
## React 是如何把对 Hook 的调用和组件联系起来的