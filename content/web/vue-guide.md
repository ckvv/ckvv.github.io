---
title: vue实践
tags: ['web','vue']
date: '2022-02-09'
---

[参考vue风格指南](https://cn.vuejs.org/v2/style-guide/)
[参考vue编程指南](https://cn.vuejs.org/v2/cookbook/)

## Vue Router

### 路由懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了结合 Vue 的[异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#异步组件)和 [Webpack](https://doc.webpack-china.org/guides/code-splitting-async/#require-ensure-/) 的代码分割功能，轻松实现路由组件的懒加载

## 规范

vue文件内css样式尽量使用局部样式。全局样式可以统一放入静态库由app.vue文件导入

## 注意事项

vue data中的对象状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新

+ 最好提前在你的 store 中初始化好所有所需属性。
+ 当需要在对象上添加新属性时，你应该
使用 `Vue.set(obj, 'newProp', 123)`, 或者
以新对象替换老对象。例如，利用对象展开运算符我们可以这样写：

```js
state.obj = { ...state.obj, newProp: 123 }
```
