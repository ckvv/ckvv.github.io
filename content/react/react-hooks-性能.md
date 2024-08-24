---
title: "React Hook 性能"
tags: ['React']
date: "2024-08-24"
---

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

## useTransition

## useDeferredValue

