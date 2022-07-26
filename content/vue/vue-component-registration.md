---
title: 'Vue组件的自动按需引入'
tag: ['Vue']
date: '2021-07-09'
---

在Vue中我们可以通过全局组件、局部注册的方式来使用组件

## 全局注册

通过`app.component`来创建全局组件

```js
import { createApp } from 'vue'
import HelloWorld from './components/HelloWorld'

const app = createApp({})

// 全局注册一个名为hello-wolrd的组件
app.component('hello-wolrd', HelloWorld);
```

一旦我们全局注册了组件，我们就可以在任何地方使用这个组件：`<hello-wolrd/>`  
>值得注意的是全局注册会使Vue失去`TypeScript`的支持, Vue 3 有一个 [PR](https://github.com/vuejs/vue-next/pull/3399) 扩展了全局组件的接口。目前，[Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) 已经支持这种用法，我们可以通过在根目录添加`components.d.ts`文件的方式来添加全对局组件的`TypeScript`的支持

```ts
declare module 'vue' {
  export interface GlobalComponents {
    HelloWorld: typeof import('./src/components/HelloWorld.vue')['default']
  }
}
```

## 局部注册

我们可以直接从文件中引入vue组件使用，

在单文件组件中（SFC）

```vue
<template>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
```

在JSX中

```jsx
import HelloWolrd from './components/HelloWorld.vue'
export default {
  name: "item",
  render(){
    return (
      <HelloWolrd msg="Welcome to Your Vue.js App"/>
    )
  }
}
```

局部注册的组件在其他组件中无法访问，在其父组件或子组件或中均不可用，所以你需要在每个使用该组件的地方重新引入并注册该组件

```js
import HelloWolrd from './components/HelloWorld.vue'
```

但是这种直接导入组件的方式还有一个好处，如果我们导入的组件使用了`typescript`，我们无需任何插件就可以在组件中获得智能提示和类型检查的功能

## 局部自动组册

可以看到局部注册的优点是比较明显的，但是每次使用我们都需要重复导入，但是如果你的组件很多，你的组件注册代码看起来可能比较冗长，我们可以使用`unplugin-vue-components`，自动按需导入组件. 它会按需导入组件，但是不再需要导入和组件注册

> 该插件会自动对使用的组件生成一个`components.d.ts`从而获得`TypeScript`的支持,

安装插件

+ vite

```js
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({ /* options */ }),
  ],
})
```

+ rollup

```js
// rollup.config.js
import Components from 'unplugin-vue-components/rollup'

export default {
  plugins: [
    Components({ /* options */ }),
  ],
}
```

+ webpack

```js
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-vue-components/webpack')({ /* options */ })
  ]
}
```

然后我们可以像往常一样在模板中使用组件，它会自动进行下面的转换

```vue
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
```

转换成

```vue
<template>
  <div>
    <HelloWorld msg="Hello Vue 3.0 + Vite" />
  </div>
</template>

<script>
import HelloWorld from './src/components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
```

默认它会在`src/components`目录下查找组件，我们可以通过`dirs`参数来自定义组件目录，其他配置参考<https://github.com/antfu/unplugin-vue-components#configuration>

## 不同方案对比

|                | 全局注册                  | 局部注册       | unplugin-vue-components       |
| -------------- | ------------------------- | -------------- | ----------------------------- |
| TypeScript支持 | 定义`components.d.ts`文件 | 默认支持       | 自动生成`components.d.ts`文件 |
| 组件作用域     | 全局                      | 局部           | 局部                          |
| 使用方法        | 全局注册后使用            | 局部注册后使用 | 添加插件后使用                |

## 参考

+ <https://v3.cn.vuejs.org/guide/component-registration.html>
+ <https://v3.cn.vuejs.org/guide/typescript-support.html>
+ <https://github.com/antfu/unplugin-vue-components>
