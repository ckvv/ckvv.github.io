---
title: "如何为带参数的动态路由添加TS类型"
tags: ['TypeScript']
date: "2025/04/17"
---

首先我们先看看什么是带参数的动态路由, 以 `Hono` 路由定义举例, 其中 `:id`, `comment_id` 是一个参数, 路径参数 用冒号 `:` 表示。
当一个路由被匹配时，它的 `param` 的值可以通过在每个路由回调用中以 `c.req.param` 的形式获取出来。

```ts
app.get('/posts/:id/comment/:comment_id', (c) => {
  const id = c.req.param('id') // string
  const param = c.req.param() // { id: string; comment_id: string }
})
```

## 第一步：把路径字符串拆成单个部分（联合类型）

```ts
type Split<T extends string> =
  T extends `${infer _}/${infer Rest}`
    ? T extends `/${infer Next}` // 去掉开头的 `/`
      ? Split<Next>
      : T extends `${infer Part}/${infer Next}`
        ? Part | Split<Next>
        : T
    : T;
```

## 第二步：提取出以 ":" 开头的片段

```ts
type ExtractParamName<T> = T extends `:${infer Param}` ? Param : never;
```


## 把这些参数构造成对象

```ts
type ParamsObject<T extends string> = {
  [K in ExtractParamName<Split<T>>]: string
};
```

到这一步我们已经可以将 `/posts/:id/comment/:comment_id`类型转为 `{ id: string; comment_id: string }` 类型了,  接下来让我们仿照 `hono` API 封装调用

```ts
interface Context<T extends Record<string, string>> {
  req: {
    param(): T;
    param<K extends keyof T>(key: K): string;
  };
}

class Hono {
  get<T extends string>(path: T, callback: (c: Context<ParamsObject<T>>) => void) {

  }
} 

const hono = new Hono();
hono.get('/posts/:id/comment/:comment_id', (c) => {
  const id = c.req.param('id') // string
  const param = c.req.param() // { id: string; comment_id: string }
})
```


## 参考

+ https://hono.dev/docs/api/routing#path-parameter