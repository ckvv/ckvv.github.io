---
title: "React Hook Effect"
tags: ['React']
date: "2024-08-24"
---

## useEffect

每当你的组件渲染时，React 将更新屏幕，然后运行 useEffect 中的代码(屏幕更新渲染之后)

该 Hook 接收一个包含命令式、且可能有副作用代码的函数。在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。使用 `useEffect` 完成副作用操作。

通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作。React 会保存你传递的函数（我们将它称之为 “effect”），并且在执行 DOM 更新之后调用它。同时你也可以使用多个effect hook，React 将按照 effect 声明的顺序依次调用组件中的*每一个* effect。

### 参考

```jsx
useEffect(setup, dependencies?)
```
参数
+ `setup`：处理 Effect 的函数。setup 函数选择性返回一个 清理（cleanup） 函数。当组件被添加到 DOM 的时候，React 将运行 setup 函数。在每次依赖项变更重新渲染后，React 将首先使用旧值运行 cleanup 函数（如果你提供了该函数），然后使用新值运行 setup 函数。在组件从 DOM 中移除后，React 将最后一次运行 cleanup 函数。
+ `dependencies`：setup 代码中引用的所有响应式值的列表。响应式值包括 props、state 以及所有直接在组件内部声明的变量和函数。如果你的代码检查工具 配置了 React，那么它将验证是否每个响应式值都被正确地指定为一个依赖项。依赖项列表的元素数量必须是固定的，并且必须像 [dep1, dep2, dep3] 这样内联编写。React 将使用 `Object.is` 来比较每个依赖项和它先前的值。如果省略此参数，则在每次重新渲染组件之后，将重新运行 Effect 函数。如果传递空数组则仅在 `初始渲染后` 运行(开发环境下除外)。

返回值
undefined

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

```jsx
useEffect(() => {
  // 这里的代码会在每次渲染后执行
});

useEffect(() => {
  // 这里的代码只会在组件挂载后执行
}, []);

useEffect(() => {
  //这里的代码只会在每次渲染后，并且 a 或 b 的值与上次渲染不一致时执行
}, [a, b]);

```

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

### 尽量避免对象和函数依赖。将它们移到组件外或 Effect 内。
如果在渲染过程中创建对象和函数，然后在 Effect 中读取它们，它们将在每次渲染时都不同。这将导致 Effect 每次都重新同步

```jsx
// 在每次重新渲染 ChatRoom 组件时，都会从头开始创建一个新的 options 对象。React 发现 options 对象与上次渲染期间创建的 options 对象是 不同的对象。这就是为什么它会重新同步 Effect（依赖于 options）
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ 所有依赖已声明
}
```

这就是为什么你应该尽可能避免将对象和函数作为 Effect 的依赖。所以，尝试将它们移到组件外部、Effect 内部，或从中提取原始值。

```jsx
// 移到组件外部
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: '音乐'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 所有依赖已声明
  // ...
```

```jsx
// Effect 内部
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 所有依赖已声明
  // ...
```

```jsx
// 从中提取原始值
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>

function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  // 避免依赖对象和函数类型
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 所有依赖已声明
}
```

### 从 Effect 中获取 最新的 props 和 state，而不“响应”它们

```jsx
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

// 仅在 url 更改后记录一次新的页面访问
  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ 所有声明的依赖项
}
```

### 注意事项

+ 如果你的一些依赖项是组件内部定义的对象或函数，或者没有指定依赖现时，可能导致 Effect 过多地重新运行
+ Effect 只在客户端上运行，在服务端渲染中不会运行。

## useLayoutEffect

与 `useEffect` 类似，但它会在所有的 DOM 变更之后，在浏览器执行绘制之前，同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染，`useLayoutEffect` 内部的更新计划将被同步刷新。尽可能使用标准的 `useEffect` 以避免阻塞视觉更新。

```jsx
// 在浏览器重新绘制屏幕之前执行布局测量,避免页面闪烁
  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
```

## useInsertionEffect

在布局副作用触发之前将元素插入到 DOM 中, `useInsertionEffect` 比在 `useLayoutEffect` 或 `useEffect` 期间注入样式更好。因为它会确保 `<style>` 标签在其它 Effect 运行前被注入。

```jsx
useInsertionEffect(setup, dependencies?)
```

### 从 CSS-in-JS 库中注入动态样式

```jsx
// 在你的 CSS-in-JS 库中
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // 同前所述，我们不建议在运行时注入 <style> 标签。
    // 如果你必须这样做，那么应当在 useInsertionEffect 中进行。
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

## useInsertionEffect vs useLayoutEffect vs useEffect 执行时机对比

`useInsertionEffect`：在 React 渲染 DOM 元素之前执行，主要用于注入样式。它的执行时机非常早，在 DOM 还未被插入到页面中时就会被调用。这个钩子函数主要是为了解决在服务器端渲染（SSR）和使用 CSS-in-JS 库时可能出现的闪烁问题。
`useLayoutEffect`：在浏览器完成对 DOM 的更新后，在浏览器执行绘制之前，但在浏览器进行布局和绘制之前执行。这个阶段可以读取和修改 DOM，但是要小心操作，因为如果执行时间过长可能会导致页面卡顿。
`useEffect`：在浏览器完成布局和绘制之后执行。通常用于执行一些副作用操作，比如发送网络请求、订阅事件等。这个钩子函数不会阻塞浏览器的绘制，所以对于不影响用户界面立即显示的操作是比较合适的。
