---
title: 谈谈Web项目中图标的方式
tags: ["Web", "Icon"]
date: "2022-02-09"
---

谈谈 Web 项目中图标的方式

# 单个图标

我们可以选择单独引用图标文件如 png、svg 等等，这种方式缺点显而易见，图标多了之后不方便维护

# 字体文件

通过[font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face),我们可以指定一个用于显示文本的自定义字体，字体文件内部类似一个`svg`我们可以在字体文件里面随便定义这些字符的形状，

![font](https://img.alicdn.com/tps/TB1GfUJJFXXXXabXpXXXXXXXXXX-598-574.png)

通过对应字体文件的字体编码我们就可以使用这些图标了,如下面是一个`close`图标

```css
<i class="iconfont">&#xe64f;</i>
```

这样有个明显的缺点就是图标不直观，我们很难根据`&#x33;`知道它是什么图标，我们可以通过提前定义好对应图标 css 的`::before`的 content，将其改造成自定义 class 引用的方式

```css
.icon-close:before {
  content: "\e64f";
}
```

然后我们在页面中可以这样使用

```html
<span class="iconfont icon-close"></span>
```

因为是字体格式所以这种方式使用图标有以下特点

- 兼容性最好，支持 ie6+，及所有现代浏览器。
- 支持按字体的方式去动态调整图标大小，颜色等等。
- 不支持多色。

# symbol 引用

[symbol](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/symbol) 元素用来定义一个图形模板对象，它可以用一个[use](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/use)元素实例化。一个`symbol`元素本身是不呈现的。只有`symbol`元素的实例（亦即，一个引用了`symbol`的 [use](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/use)元素）才能呈现，如

```html
<svg>
  <!-- symbol definition  NEVER draw -->
  <symbol id="sym01" viewBox="0 0 150 110">
    <circle cx="50" cy="50" r="40" stroke-width="8" stroke="red" fill="red" />
    <circle
      cx="90"
      cy="60"
      r="40"
      stroke-width="8"
      stroke="green"
      fill="white"
    />
  </symbol>

  <!-- actual drawing by "use" element -->
  <use xlink:href="#sym01" x="0" y="0" width="100" height="50" />
  <use xlink:href="#sym01" x="0" y="50" width="75" height="38" />
  <use xlink:href="#sym01" x="0" y="100" width="50" height="25" />
</svg>
```

`symbol`的作用域是全局的我们也可以在 svg 中单独使用如

```html
<svg>
  <!-- symbol definition  NEVER draw -->
  <symbol id="sym01" viewBox="0 0 150 110">
    <circle cx="50" cy="50" r="40" stroke-width="8" stroke="red" fill="red" />
    <circle
      cx="90"
      cy="60"
      r="40"
      stroke-width="8"
      stroke="green"
      fill="white"
    />
  </symbol>
</svg>
<svg>
  <use xlink:href="#sym01" x="0" y="0" width="100" height="50" />
</svg>
```

我们还通过一些 css 技巧，支持 svg 像字体那样，通过`font-size`,`color`来调整样式。

```css
.icon {
  /* em让宽高等于字体大小 */
  width: 1em;
  height: 1em;
  /* 继承父级的 color 属性 */
  fill: currentColor;
}
```

```html
<svg class="icon">
  <use xlink:href="#icon-close"></use>
</svg>
```

# 常用的图标库对比

常用的图标库有阿里的[iconfont](https://www.iconfont.cn/)，字节的[IconPark](https://iconpark.oceanengine.com/)，

## iconfont 特点

- 支持上传自己自己的图标，并将图标按照项目进行管理

- 只支持字体、symbol 引用的方式，并且可以单独下载图标为 svg 或者 png 格式

- 支持通过文件的方式导入可与任何框架配合使用

## iconpark 特点

与 iconfont 不同的是它并没有使用 symbol 引用的方式，而是通过现代框架代码将其编译成了组件，我们可以更方便的对框架图标进行更细粒度的定制，

- 只包含官方提供的 svg 图标，好处是图标风格样式更统一

- 可对图标大小、颜色、线框粗细、端点等属性进行等更定制化的转换
- 可以跨平台导出多种图标组件代码，包括 React、Vue2、Vue3 格式

虽然没有使用 symbol 引用，但多次引用同一图标并不会导致打包后代码增加，在 vue 中字体组件会被编译成下面这张形式。

```js
let dj;
let pj;
let hj;
const mj
    = ((pj = !1),
    (hj = function (e) {
      return Ao(
        'svg',
        {
          width: e.size,
          height: e.size,
          viewBox: '0 0 48 48',
          fill: 'none',
        },
        [
          Ao(
            'path',
            {
              d: 'M9 18V42H39V18L24 6L9 18Z',
              fill: e.colors[1],
            },
            null
          ),
          Ao(
            'path',
            {
              'd': 'M9 42V18L4 22L24 6L44 22L39 18V42H9Z',
              'stroke': e.colors[0],
              'stroke-width': e.strokeWidth,
              'stroke-linecap': e.strokeLinecap,
              'stroke-linejoin': e.strokeLinejoin,
            },
            null
          ),
          Ao(
            'path',
            {
              'd': 'M19 29V42H29V29H19Z',
              'fill': e.colors[3],
              'stroke': e.colors[2],
              'stroke-width': e.strokeWidth,
              'stroke-linejoin': e.strokeLinejoin,
            },
            null
          ),
          Ao(
            'path',
            {
              'd': 'M9 42H39',
              'stroke': e.colors[0],
              'stroke-width': e.strokeWidth,
              'stroke-linecap': e.strokeLinecap,
            },
            null
          ),
        ]
      );
    }),
    {
      name: `icon-${dj = 'home'}`,
      props: [
        'size',
        'strokeWidth',
        'strokeLinecap',
        'strokeLinejoin',
        'theme',
        'fill',
        'spin',
      ],
      setup(e) {
        // 。。。
      },
    });
```

在我们的组件使用的地方如

```html
<home theme="filled" />
```

被编译成了类似下面这种形式的函数调用

```js
P(u, {
  theme: 'filled',
});
```

## 如何选择

对于如何选择这两个方式我们可以考虑以下情况

选择 iconfont

- ui 或者产品想使用自己的图标

- 需要对图标进行管理

- 前端项目非`React、Vue2、Vue3`框架

- 想使用起来更简单更灵活一点

选择 iconpark

- 需要方便对图标进行更定制化设置
- 项目中需要对图标风格进行响应式的更改
