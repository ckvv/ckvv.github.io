---
title: "css元素选择器"
tags: ['web', 'css']
date: '2022-02-09'
---

CSS 选择器规定了 CSS 规则会应用到哪些元素上。
## 基本选择器

## 节点选择

CSS 类型选择器按节点名称匹配元素。换句话说，它选择文档中给定类型的所有元素。

```css
/* All <a> elements. */
a {
  color: red;
}
```

## 类选择

该CSS 类选择匹配根据他们的内容元素class属性。

```css
/* All elements with class="spacious" */
.spacious {
  margin: 2em;
}

/* All <li> elements with class="spacious" */
li.spacious {
  margin: 2em;
}

/* All <li> elements with a class list that includes both "spacious" and "elegant" */
/* For example, class="elegant retro spacious" */
li.spacious.elegant {
  margin: 2em;
}
```

## ID选择
CSS ID 选择器会根据该元素的ID属性中的内容匹配元素

```css
/* The element with id="demo" */
#demo {
  border: red 2px solid;
}
```

## 通用选择
(*)就是一个通配选择器.它可以匹配任意类型的HTML元素

```css
*.warning {color:red;}
```

## 属性选择
CSS 属性选择器通过已经存在的属性名或属性值匹配元素

```css
/* 存在title属性的<a> 元素, 如下选择 */
a[title] {
  color: purple;
}

/* 存在href属性并且属性值匹配"https://example.org"的<a> 元素, 如下选择 */
a[href="https://example.org"] {
  color: green;
}

/* 存在href属性并且属性值包含"example"的<a> 元素, 如下选择 */
a[href*="example"] {
  font-size: 2em;
}

/* 存在href属性并且属性值以"#"开始的<a> 元素, 如下选择 */
a[href^="#"] {
  background-color: gold;
}
/* 存在href属性并且属性值结尾是".org"的<a> 元素, 如下选择 */
a[href$=".org"] {
  font-style: italic;
}
```

[attr]
表示带有以 attr 命名的属性的元素。
[attr=value]
表示带有以 attr 命名的属性，且属性值为"value"的元素。
[attr~=value]
表示带有以 attr 命名的属性的元素，并且该属性是一个以空格作为分隔的值列表，其中[至少]一个值匹配"value"。
[attr|=value]
表示带有以 attr 命名的属性的元素，属性值为“value”或是以“value-”为前缀（"-"为连字符，Unicode编码为U+002D）开头。典型的应用场景是用来来匹配语言简写代码（如zh-CN，zh-TW可以用zh作为value）。
[attr^=value]
表示带有以 attr 命名的属性，且属性值是以"value"开头的元素。
[attr$=value]
表示带有以 attr 命名的属性，且属性值是以"value"结尾的元素。
[attr*=value]
表示带有以 attr 命名的属性，且属性值包含有"value"的元素。
[attr operator value i]
表示带有以 attr 命名的属性, 且属性值匹配"value" [忽略属性值大小] 的元素。在带有属性值的属性选型选择器表达式的右方括号, 前添加用空格间隔开的字母i（或I）可以忽略属性值的大小写（ASCII字符范围内的字母）

## 组合选择器

## 相邻兄弟选择器
'+' 操作符选择相邻元素，即第二个节点紧邻着第一个节点，并且拥有共同的父节点。

```css
/* 图片后面紧跟着的段落将被选中 */
img + p {
  font-style: bold;
}

```

## 一般兄弟选择
'~' 操作符选择兄弟元素，也就是说，第二个节点在第一个节点后面的任意位置，并且这俩节点的父节点相同

```css
/* Paragraphs that are siblings of and
   subsequent to any image */
img ~ p {
  color: red;
}
```

## 子选择器
'>' 操作符选择第一个元素的直接子节点。
ul > li 将会匹配`直接`嵌套在 <ul> 元素内的所有 <li> 元素。

```css
/* List items that are children of the "my-things" list */
ul.my-things > li {
  margin: 2em;
}
```
## 后代选择器
' '  (空格) 操作符将选择第一个元素的子代节点。
div span 将匹配 <div> 元素内`所有`的 <span> 元素。

```css
/* List items that are descendants of the "my-things" list */
ul.my-things li {
  margin: 2em;
}
```
## 伪类
伪类 允许基于未包含在文档树中的状态信息来选择元素，详细参考[mdn:伪类](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
a:visited 会匹配所有被访问过的  <a>  元素。

```
selector：伪类{
  适当的属性;
}

li.list-wrapper:nth-child(1), li.list-wrapper:nth-child(2) 
```
## 伪元素
伪元素 表示所有未被包含在HTML的实体。详细参考[mdn:伪元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements）
`按照规范，应该使用双冒号（::）而不是单个冒号（:），以便区分伪类和伪元素。但是，由于旧版本的 W3C 规范并未对此进行特别区分，因此目前绝大多数的浏览器都同时支持使用这两种方式来表示伪元素`
p::first-line 会匹配所有 <p> 元素的第一行。

```css
selector::pseudo-element {
  property: value;
}
```