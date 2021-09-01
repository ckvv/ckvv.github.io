---
title: '浏览器中获取宽、高相关的属性'
tags: ['css', 'web']
---

我们可能需要针对宽屏和高屏编写不同代码，下面我总结一下从浏览器中获取宽、高相关的属性

# css
如果宽高屏不设计具体逻辑代码，我们可以采用css的`@media`媒体查询的方式判断;

## orientation

> 宽度和高度相等时会被判断为纵向

```css
  /* viewport 处于纵向，即高度大于等于宽度 */
  @media (orientation: portrait) {
  }
  /* viewport 处于横向，即宽度大于高度。 */
  @media (orientation: landscape) {
  }
```

## aspect-ratio

利用宽高比我们也可以判断宽高屏，当如果同时满足后面的样式会覆盖前面，所以下面当宽高相等时生效的是`@media (aspect-ratio: 1/1) {}`

```css
/* 最大宽高比 */
  @media (max-aspect-ratio: 1/1){
  }
/* 最小宽高比 */
  @media (min-aspect-ratio: 1/1) {
  }
/* 指定宽高比 */
  @media (aspect-ratio: 1/1) {
  }
```

# js

## window

`innerHeight` `innerWidth` `outerHeight` ` outerWidth` 获取浏览器窗口的视口（viewport）高度、宽度（以像素为单位）

![img](https://developer.mozilla.org/@api/deki/files/213/=FirefoxInnerVsOuterHeight2.png)

## screen

height: 以像素为单位返回屏幕的高度  

width:  以像素为单位返回屏幕的宽度. 

orientation: 返回当前屏幕的转向. 

availHeight: 指定屏幕的高度（以像素为单位）减去操作系统显示的永久或半永久用户界面功能，例如 Windows 上的任务栏. 

## element

### getComputedStyle

返回一个[`CSSStyleDeclaration`](https://developer.mozilla.org/zh-CN/docs/Web/API/CSSStyleDeclaration) ，它暴露了样式信息和各种与样式相关的方法和属性。

### getBoundingClientRect

方法返回元素的大小及其相对于视口的位置,如果是标准盒子模型，元素的尺寸等于`width/height` + `padding` + `border-width`的总和。如果`box-sizing: border-box`，元素的的尺寸等于 `width/height`

![rect](https://mdn.mozillademos.org/files/15087/rect.png)

### getClientRects

返回值是ClientRect对象集合，该对象是与该元素相关的CSS边框， 每个ClientRect对象包含一组描述该边框的只读属性——left、top、right和bottom，单位为像素，这些属性值是相对于视口的top-left的， 对于行内元素，元素内部的每一行都会有一个边框；对于块级元素，如果里面没有其他元素，一整块元素只有一个边框



### style

`style` 属性对于完全了解应用在元素上的样式没有用处，因为它仅表示在元素的内联样式属性中设置的 CSS 声明，而不是来自其他地方的样式规则的声明，例如 <head> 中的样式规则部分或外部样式表。要获取元素的所有 CSS 属性的值，您应该改用 `getComputedStyle()`

### clientHeight、clientWidth

对于没有定义CSS或者内联布局盒子的元素为0，否则，它是元素内部的高度(单位像素)，包含内边距(padding)，但不包括水平滚动条、边框和外边距(margin)。

### scrollHeight、scrollWidth

包括由于溢出导致的视图中不可见内容，等于该元素在不使用滚动条的情况下为了适应视口中所用内容所需的最小高度，没有垂直滚动条的情况下，scrollHeight值与元素视图填充所有内容所需要的最小值[`clientHeight`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/clientHeight)相同。包括元素的padding，但不包括元素的border和margin。scrollHeight也包括 [`::before`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::before) 和 [`::after`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::after)这样的伪元素。
