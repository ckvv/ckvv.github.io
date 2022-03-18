---
title: "CSS实现字体阴影效果"
date: "2022-03-18"
---

## shadow

对于阴影我们一般可以设置以下几种效果

+ 水平偏移：正值向右偏移阴影，而负值向左偏移。
+ 垂直偏移：正值向上偏移阴影，而负值向下偏移。
+ 模糊半径：阴影的长度。长度越长，阴影就越大越轻。没有负值。
+ 传播半径：这是另一个长度值，较大的值会导致更大、更长的阴影。
+ 颜色：这定义了阴影的颜色，就像我们为 CSS 颜色属性所做的那样。
+ inset：默认值（初始）会产生阴影。使用 inset 值移动元素框架内的阴影，从而产生内部阴影（只有`box-shadow`支持）

## [box-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-shadow)

一般来说，提到实现阴影效果，我们首先想到的是`box-shadow`，但是这个属性只能用在盒模型上，为了显示立体感如弹框、按钮等。

```html
<p style="box-shadow: 0 0 10px red;">HelloWorld</p>
```

<p style="box-shadow: 0 0 10px red;">HelloWorld</p>

## text-shadow

与`box-shadow`不同的是，`text-shadow`只能用在文本上

```html
<p style="font-size: 2em;text-shadow: 0 0 0.4em red;">HelloWorld</p>
```

<p style="font-size: 2em;text-shadow: 0 0 0.4em red;">HelloWorld</p>

阴影越大越淡，我们可以通过叠加多个`shadow`加深阴影颜色

```html
  <p style="font-size: 2em;text-shadow: 0 0 0.4em red, 0 0 0.4em red, 0 0 0.4em red">HelloWorld</p>
```

<p style="font-size: 2em;text-shadow: 0 0 0.4em red, 0 0 0.4em red, 0 0 0.4em red">HelloWorld</p>

## drop-shadow

与`box-shadow`类似

```html
  <p style="font-size: 2em;filter:drop-shadow(0 0 0.4em red);">HelloWorld</p>
```

  <p style="font-size: 2em;filter:drop-shadow(0 0 0.4em red);">HelloWorld</p>

阴影越大越淡，与`box-shadow`不同的是,随着叠加`drop-shadow`它的范围会逐渐变大

```html
<p style="font-size: 2em;filter:drop-shadow(0 0 0.4em red) drop-shadow(0 0 0.4em red) drop-shadow(0 0 0.4em red);">HelloWorld</p>
```

<p style="font-size: 2em;filter:drop-shadow(0 0 0.4em red) drop-shadow(0 0 0.4em red) drop-shadow(0 0 0.4em red);">HelloWorld</p>

## text-stroke

是`text-stroke-width`及`text-stroke-color`的缩写,设置文本的描边宽度颜色,当描边过宽时会覆盖字体本身的颜色。

```html
<p style="font-size: 2em; -webkit-text-stroke: 0.06em red;">HelloWorld</p>
```

<p style="font-size: 2em; -webkit-text-stroke: 0.06em red;">HelloWorld</p>
