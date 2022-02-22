---
title: 组件间样式隔离的几种方案
tags: ['web', 'css']
date: '2022-02-09'
---

CSS即层叠样式表(Cascading Style Sheets）是一种样式表语言，它没有作用域的概念，引入即全局生效的，但一个样式是否起作用由多个因素共同决定，比如：
+ 重要程度
+ 优先级
+ 样式加载顺序
所以当我们在页面中使用时可能会遇到组件间的样式互相影响的情况，特别是引入了多个组件库或者类名命名不规范时，我们就需要对样式进行隔离，这样就可以避免样式冲突。下面我介绍几种方案：

# 类名添加特定的前缀
一般来说，我们会在组件内部使用一个特定的前缀，避免组件之间的样式冲突。比如antd的组件内部的样式，都会使用`ant-`前缀，element-ui的组件内部的样式，都会使用`el-`前缀。 由于原生css的功能太弱鸡了, 我们在实际开发中一般使用css预处理框架如less, sass等，对于这种我们也可以使用一个类似的功能。

## 对于less

```less
// button.less
@name: v-;

.@{name}button {
  background-color: green;
}

// 编译为
// .v-button {
//   background-color: green;
// }
```
重写前缀

```less
@import 'button.less';
@name: k-;

// 编译为
// .k-button {
//   background-color: green;
// }
```




## 对于sass

sass目前版本支持与less类似的写法，但是Sass 团队不鼓励继续使用`@import`规则。 并计划在未来几年逐步淘汰它，作为替代方案，他们推荐使用`@use`规则。详细原因请参考<https://sass-lang.com/documentation/at-rules/import>。

```scss
/* button.scss */
$name: v-;

@mixin configure($name: $name) {
  @if $name {
    $name: $name !global;
  }
}

@mixin styles {
  .#{$name}button {
    background-color: green;
  }
}
```

重写前缀

```scss
@use './button.scss';

@include button.configure(
  $name: k-,
);

@include button.styles;

```

# CSS in JS

CSS-in-JS就是将应用的CSS样式写在JavaScript文件里面, 这样你就可以在CSS中使用一些属于JS的诸如模块声明，变量定义，函数调用和条件判断等语言特性来提供灵活的可扩展的样式定义。CIJ 还没有形成真正的标准，但在接口 API 设计、功能或是使用体验上，不同的实现方案越来越接近，其中最受欢迎的解决方案是styled-components(styled-components本身是为React设计的,可以使用vue-styled-components替代)，它删除了组件和样式之间的映射。这意味着当你定义你的样式时，你实际上是在创建一个普通的 React 组件，它附加了你的样式。并为你的样式生成唯一的类名，`CSS-in-JS`在VUE中用的较少，因为VUE本身提供了类似的组件隔离样式的解决方案，但是在React中，它是一个很好的解决方案。

```jsx
// The Button from the last section without the interpolations
const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

// A new component based on Button, but with some override styles
const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;

render(
  <div>
    <Button>Normal Button</Button>
    <TomatoButton>Tomato Button</TomatoButton>
  </div>
);
```

# Scoped CSS

在VUE中有`Scoped` CSS的概念，当 `<style>` 标签有 scoped 属性时，它的 CSS 只作用于当前组件中的元素。这类似于 Shadow DOM 中的样式封装。通过对组件添加[数据属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*),然后在style中使用[属性选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)让组件的样式只作用于组件。它通过使用 PostCSS 来实现以下转换：

```html
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

转换结果

```html
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

详情参考<https://VUE-loader.vuejs.org/zh/guide/scoped-css.html#scoped-css>

# CSS Modules

[CSS Modules](https://github.com/css-modules/css-modules) 是一个流行的，用于模块化和组合 CSS 的系统.

VUE 3 原生支持了`CSS Modules`,通过在你的 `<style>` 上添加 module 特性, 这个 module 特性指引 Vue Loader 作为名为 $style 的计算属性，向组件注入 CSS Modules 局部对象。它将类名编译成一个独一无二的哈希字符串，来保证样式只在组件内生效。

```html
<template>
  <p :class="$style.red">
    This should be red
  </p>
  <p :class="$style.red">
    This should be red
  </p>
  <p :class="$style.bold">
    This should be bold
  </p>
</template>

<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>
```

转换结果

```html
<template>
  <p class="_red_1cpg3_4">
    This should be red
  </p>
  <p class="_red_1cpg3_4">
    This should be red
  </p>
  <p class="_bold_1cpg3_7">
    This should be bold
  </p>
</template>

<style>
._red_1cpg3_4 {
  color: red;
}
._bold_1cpg3_7 {
  font-weight: bold;
}
</style>
```

# 使用 shadow DOM
不同与VUE,React, Web 提供了一个标准的组件模型Web Components,它将标元素、样式和行为封装起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起， 如下面使用Web Components创建一个button

```js
customElements.define('my-button',
  class extends HTMLElement {
    constructor() {
      super();

      const shadow = this.attachShadow({
        mode: 'open'
      });

      const wrapper = document.createElement('button');
      wrapper.innerText = 'Button';
      const style = document.createElement('style');
      style.textContent = `
      button {
        color: #0B8BF4;
        border-radius: 4px;
      }
    `;
      shadow.appendChild(style);
      shadow.appendChild(wrapper);
    }
  }
);
```