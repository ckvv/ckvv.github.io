---
title: "webpack总结"
tags: ['文章']
---

## loader
webpack 可以使用 [loader](https://www.webpackjs.com/loaders/) 来预处理文件。这允许你打包除 JavaScript 之外的任何静态资源。你可以使用 Node.js 来很简单地编写自己的 loader。loader 通过在 require() 语句中使用 loadername! 前缀来激活，或者通过 webpack 配置中的正则表达式来自动应用;
```js
import Worker from 'worker-loader!./Worker.js';
// 或者
{
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  }
}
```

## 懒加载

## 代码分离

## shimming
一些第三方的库(library)可能会引用一些全局依赖（例如 jQuery 中的 $）。这些库也可能创建一些需要被导出的全局变量。这些“不符合规范的模块”就是 shimming 发挥作用的地方。
使用 `ProvidePlugin` 后，能够在通过 webpack 编译的每个模块中，通过访问一个变量来获取到 package 包。如果 webpack 知道这个变量在某个模块中被使用了，那么 webpack 将在最终 bundle 中引入我们给定的 package。
本质上，我们所做的，就是告诉 webpack……

>如果你遇到了至少一处用到 lodash 变量的模块实例，那请你将 lodash package 包引入进来，并将其提供给需要用到它的模块。
```
plugins: [
new webpack.ProvidePlugin({
    _: 'lodash'
})
]
```

我们还可以使用 ProvidePlugin 暴露某个模块中单个导出值，

```
plugins: [
    new webpack.ProvidePlugin({
        join: ['lodash', 'join']
    })
]
```

一些传统的模块依赖的 this 指向的是 window 对象,当模块运行在 CommonJS 环境下这将会变成一个问题，也就是说此时的 this 指向的是 module.exports。在这个例子中，你可以通过使用 imports-loader 覆写 this：
```
module: {
    rules: [
        {
            test: require.resolve('index.js'),
            use: 'imports-loader?this=>window'
        }
    ]
},
```


> 参考:[webpack](https://www.webpackjs.com)

