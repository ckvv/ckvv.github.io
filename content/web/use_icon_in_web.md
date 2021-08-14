---
title: 谈谈Web项目中图标的方式
tags: ['web','icon']
---

谈谈Web项目中图标的方式

# 单个图标

我们可以选择单独引用图标文件如png、svg等等，这种方式缺点显而易见，图标多了之后不方便维护
# 字体文件
通过[font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face),我们可以指定一个用于显示文本的自定义字体，字体文件内部类似一个`svg`我们可以在字体文件里面随便定义这些字符的形状，

!(font)[https://img.alicdn.com/tps/TB1GfUJJFXXXXabXpXXXXXXXXXX-598-574.png]

通过对应字体文件的字体编码我们就可以使用这些图标了,如下面是一个`close`图标

```css
<i class="iconfont">&#xe64f;</i>
```

这样有个明显的缺点就是图标不直观，我们很难根据`&#x33;`知道它是什么图标，我们可以通过提前定义好对应图标css的`::before`的content，将其改造成自定义class引用的方式

```css
.icon-close:before{
	content: "\e64f"
}
```

然后我们在页面中可以这样使用

```html
<span class="iconfont icon-close"></span>
```

因为是字体格式所以这种方式使用图标有以下特点

- 兼容性最好，支持ie6+，及所有现代浏览器。
- 支持按字体的方式去动态调整图标大小，颜色等等。
- 不支持多色。

# symbol 引用

[symbol](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/symbol) 元素用来定义一个图形模板对象，它可以用一个[use](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/use)元素实例化。一个`symbol`元素本身是不呈现的。只有`symbol`元素的实例（亦即，一个引用了`symbol`的 [use](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/use)元素）才能呈现，如

```html
  <svg>
    <!-- symbol definition  NEVER draw -->
    <symbol id="sym01" viewBox="0 0 150 110">
      <circle cx="50" cy="50" r="40" stroke-width="8" stroke="red" fill="red" />
      <circle cx="90" cy="60" r="40" stroke-width="8" stroke="green" fill="white" />
    </symbol>

    <!-- actual drawing by "use" element -->
    <use xlink:href="#sym01" x="0" y="0" width="100" height="50" />
    <use xlink:href="#sym01" x="0" y="50" width="75" height="38" />
    <use xlink:href="#sym01" x="0" y="100" width="50" height="25" />
  </svg>
```

`symbol`的作用域是全局的我们也可以在svg中单独使用如

```html
  <svg>
    <!-- symbol definition  NEVER draw -->
    <symbol id="sym01" viewBox="0 0 150 110">
      <circle cx="50" cy="50" r="40" stroke-width="8" stroke="red" fill="red" />
      <circle cx="90" cy="60" r="40" stroke-width="8" stroke="green" fill="white" />
    </symbol>
  </svg>
  <svg>
    <use xlink:href="#sym01" x="0" y="0" width="100" height="50" />
  </svg>
```

我们还通过一些技巧，支持像字体那样，通过`font-size`,`color`来调整样式。



常用的图标库有阿里的[iconfont](https://www.iconfont.cn/)，字节的[IconPark](https://iconpark.oceanengine.com/)，`iconfont`保护上面三种使用方式，字节的`iconpark`只支持symbol引用的方式,并且



# todo

