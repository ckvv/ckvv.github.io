---
title: "css关于浮动的知识"
tags: ["CSS"]
date: "2022-02-09"
---

float CSS 属性指定一个元素应沿其容器的左侧或右侧放置，允许**文本和内联元素**环绕它。
当一个元素浮动之后，它会被移出正常的文档流，然后向左或者向右平移，一直平移直到碰到了所处的容器的边框，或者碰到另外一个浮动的元素。

## float 原始用法

float 本意是为了允许文本和内联元素环它如（文字环绕图片）,就像下面一样

```css
.float {
  float: left;
  width: 200px;
  height: 200px;
  background-color: red;
}
```

```html
<div class="wrapper">
  <div class="float"></div>
  <div>
    float本意是为了允许文本和内联元素环它;
    float本意是为了允许文本和内联元素环它;
    float本意是为了允许文本和内联元素环它;
  </div>
</div>
```

## 滥用 float 带来的问题

我们使用 float 浮动做了很多其本职工作以外的事情，使用 float 进行分栏布局、列表排列，但是如果一个元素里**只有浮动元素**，那它的高度会是 0。如果你想要它自适应即包含所有浮动元素，那你需要清除它的子元素。

## 清除浮动的几种办法

### ::after 伪元素

这种方式不会影响任何其他样式，通用性强，覆盖面广，推荐使用

```css
#container::after {
  content: "";
  display: block;
  clear: both;
}
```

类似的可以在元素后面加一个`<div style="clear:both;" ></div>`空元素

### 其他清除浮动方法

> IE 下清除浮动准则很简单，使元素 haslayout 就可以了。如宽度值，高度值，绝对定位，zoom，浮动本身都可以让元素 haslayout。显然，首选 zoom:1;不会干扰任何样式。非 IE 浏览器常用的是 overflow 属性

container 也浮动,这种方式治标不治本总不能一直浮动到 root

```css
#container {
  float: left;
}
```

使用 position: absolute

```css
#container {
  position: absolute;
}
```

使用 overflow 属性

```css
#container {
  overflow: auto|scroll|hidden;
}
```
