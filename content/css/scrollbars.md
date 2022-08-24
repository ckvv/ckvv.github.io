---
title: "与滚动条相关的属性"
tags: ["css"]
date: "2022-07-27"
---

## 滚动条设置（overflow）
设置当一个元素的内容太大而无法适应 块级格式化上下文 时候该做什么。
可选值: `visible`, `hidden`, `scroll`, `auto`, `overlay`

特别的:
`overlay`: 行为与auto相同，但滚动条绘制在内容之上而不是占用空间。仅在基于 WebKit（例如，Safari）和基于 Blink 的（例如，Chrome 或 Opera）浏览器中受支持。

## 滚动行为（scroll-behavior）

为一个滚动框指定滚动行为

+ auto: 立即滚动
+ smoot: 平滑滚动

## 滚动条样式（伪类选择器）

通过下面几个伪类选择器可以设置滚动条样式

+ `::-webkit-scrollbar`——整个滚动条。
+ `::-webkit-scrollbar-thumb`——滚动条上的滚动滑块。
+ `::-webkit-scrollbar-track`——滚动条轨道。
+ `::-webkit-scrollbar-track-piece`——滚动条没有滑块的轨道部分。
+ `::-webkit-scrollbar-corner`——当同时有垂直滚动条和水平滚动条时交汇的部分。通常是浏览器窗口的右下角。
+ `::-webkit-scrollbar-button`——滚动条上两端的按钮（上下箭头）。
+ `::-webkit-resizer`——出现在某些元素底角的可拖动调整大小的滑块。

可用的属性

+ width: 滚动条宽度
+ height: 滚动条高度
+ background-color: 滚动条背景色
+ border: 滚动条边框
+ border-radius: 滚动条圆角

## 例子

```html
<head>
  <style>
    div::-webkit-scrollbar {
      width: 17px;
      height: 17px;
    }

    div::-webkit-scrollbar-button {
      display: block;
      width: 17px;
      height: 17px;
    }

    div::-webkit-scrollbar-button:decrement:start {
      background-color: lightblue;
      border: 2px solid black;
    }

    div::-webkit-scrollbar-button:increment:start {
      background-color: lightgreen;
      border: 2px solid black;
    }

    div::-webkit-scrollbar-button:decrement:end {
      background-color: orange;
      border: 2px solid black;
    }

    div::-webkit-scrollbar-button:increment:end {
      background-color: brown;
      border: 2px solid black;
    }

    div::-webkit-scrollbar-thumb {
      max-width: 10px;
      max-height: 10px;
      background-color: red;
      border: 2px solid #cccccc;
    }

    div::-webkit-scrollbar-track-piece:decrement {
      background-color: olive;
    }

    div::-webkit-scrollbar-track-piece:increment {
      background-color: pink;
    }
  </style>
</head>

<body>
  <div style="width:200px; height:200px; overflow-y:scroll; overflow-x:hidden">
    Hello<br>
    Hello<br>Hello<br>Hello<br>Hello<br>Hello<br>Hello<br>Hello<br>
    Hello<br>Hello<br>Hello<br>Hello<br>
    Hello<br>Hello<br>Hello<br>Hello<br>
    <span style="white-space:nowrap">Hello world this is a long string and will not wrap.</span>
    Hello<br>Hello<br>Hello<br>Hello<br>
    Hello<br>Hello<br>Hello<br>Hello<br>Hello<br>Hello<br>
    Hello<br>Hello<br>Hello<br>Hello<br>
    Hello<br>Hello<br>Hello<br>Hello<br>Hello<br>Hello<br>
    Hello<br>Hello<br>Hello<br>Hello<br>
    Hello<br>Hello<br>Hello<br>
  </div>
<body>
```
