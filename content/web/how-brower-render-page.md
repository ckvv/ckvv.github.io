---
title: "浏览器如何渲染页面"
tags: ["Web"]
date: "2022-02-09"
---

> 参考[https://coolshell.cn/articles/9666.html](https://coolshell.cn/articles/9666.html)

文章是为了说明浏览器如何将 HTML，CSS 和 JavaScript 转换为网站。

## 首先

浏览器是一个可以从远程服务器或者本地磁盘将文件加载、显示、交互的软件。

浏览器有两个重要部分：

渲染引擎（Rendering Engine）：一般习惯称为“浏览器内核”，渲染引擎决定了浏览器如何显示网页的内容以及页面的格式信息。不同的浏览器内核对网页编写语法的解释也有不同如 Gecko（火狐）、Blink（Chrome）、Webkit（Safari）、Trident（IE）等，因此同一网页在不同的内核的浏览器里的渲染效果也可能不同。

JavaScript 引擎：JavaScript 由 ECMAScript，DOM 和 BOM 三者组成，不同浏览器针对 JavaScript 语法和语义标准有多种实现如：

- Chrome 使用 V8 引擎，
- Safari 使用 JavaScriptCore，
- Firefox 使用 SpiderMonkey

## 浏览器接收数据

数据是通过 Internet 以[数据包（Packet）](https://baike.baidu.com/item/%E6%95%B0%E6%8D%AE%E5%8C%85/489739)为单位按字节形式发送到浏览器。浏览器将从硬盘（或网络）中读取 HTML 的原始数据字节转换为字符。

## 从原始字节到 DOM

当浏览器接受到扩展名为.html 时，会将该文件解释为 html 对其进行解析，文件中的每个开始和结束 html 标签会转换为节点如

```html
<div></div>
```

创建这些节点后，然后将这些节点链接到称为 DOM 的树数据结构中。DOM 建立父子关系，相邻的兄弟关系等。每个节点之间的关系都在此 DOM 对象中建立。浏览器必须先将 html 数据的原始字节转换为 DOM，然后才能进行任何操作。

当浏览器接收数据的原始字节并启动 DOM 构造过程时，它还将发出请求以获取链接的样式表。
一旦浏览器开始解析 html，一旦找到文件的 link 标签，浏览器 css 就会同时发出获取请求的请求。

## 从原始字节到 CSSOM

当浏览器收到 CSS 的原始字节时，也会启动 HTML 原始字节的类似过程。将数据的原始字节转换为字符，然后标记化节点，最后还形成 CSS 树结构，称为 CSS 对象模型，简称 CSSOM。
CSS 有一个叫做[Cascade](https://blog.logrocket.com/how-css-works-understanding-the-cascade-d181cd89a4d8/)的东西。级联是浏览器如何确定将哪些样式应用于元素的方式。

由于影响元素的样式可能来自父元素（即通过继承），或者已设置在元素本身上，因此 CSSOM 树结构变得很重要。浏览器必须递归地遍历 CSS 树结构并确定影响特定元素的样式。

## 渲染树

DOM 和 CSSOM 树结构是两个**独立的**结构。DOM 包含有关页面 HTML 元素的关系的所有信息，而 CSSOM 包含有关元素样式的信息。浏览器现在将 DOM 和 CSSOM 树合并为一个称为渲染树(render tree)的东西。渲染树包含有关页面上所有可见 DOM 内容的信息，以及不同节点所需的所有 CSSOM 信息。

> 如果一个元素被 CSS 隐藏，`display; none`例如使用，则该节点将不会在渲染树中表示。隐藏的元素将出现在 DOM 中，但不会出现在渲染树中。原因是渲染树结合了来自 DOM 和 CSSOM 的信息，因此它知道在树中不包括隐藏元素。

构建了渲染树后，浏览器将继续进行下一步，即 布局！

现在，我们在屏幕上拥有所有可见内容的内容和样式信息，但实际上并没有在屏幕上呈现任何内容,浏览器必须计算页面上每个对象的确切大小和位置。此布局步骤对从 DOM 和 CSSOM 接收到的内容和样式，进行了必要的布局计算，并绘制到屏幕上。DOM 和 CSSOM 必须在成功绘制之前构建，所以优化网站的第一条规则是尽快将最重要的 HTML 和 CSS 交付给客户端。

## JavaScript

JavaScript 可以更改 DOM 和 CSSOM。

### Javascript 执行前将停止整个 DOM 构造过程

由于浏览器不确定此特定 Javascript 会做什么，因此通过停止整个 DOM 结构来采取预防措施。每当浏览器遇到`script`标签时，在脚本完成执行之前，将停止整个 DOM 构造过程。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Medium Article Demo</title>
    <link rel="stylesheet" href="style.css" />
  </head>

  <body>
    <p id="header">How Browser Rendering Works</p>
    <div><img src="https://i.imgur.com/jDq3k3r.jpg" /></div>
    <script>
      let header = document.getElementById("header");
      console.log("header is: ", header);
    </script>
  </body>
</html>
```

在`script`标签中，我使用来访问节点的 DOM `id`，`header`然后将其输出到控制台。

让我们将其放在头部，

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Medium Article Demo</title>
    <link rel="stylesheet" href="style.css" />
    <script>
      let header = document.getElementById("header");
      console.log("header is: ", header);
    </script>
  </head>

  <body>
    <p id="header">How Browser Rendering Works</p>
    <div><img src="https://i.imgur.com/jDq3k3r.jpg" /></div>
  </body>
</html>
```

header 变量将解析为`null`。

在 HTML 解析器正在构造 DOM 的过程中，找到了一个`script`标签。在脚本执行完成之前，将停止 DOM 构建：在`script`尝试使用`id`of 访问 DOM 节点时，该节点`header`不存在，因为`body`尚未解析标签及其所有内容。**所以脚本的位置很重要**

这还不是重点

如果将内联提取`script`到外部`app.js`文件，则行为是相同的。DOM 构造仍然停止

```html
<script src="app.js"></script>
```

如果网络速度很慢并且获取需要数秒，那么 DOM 构建也会暂停数秒。

### CSSOM 准备就绪前，将停止执行 Javascript

解析器遇到`script`标签但 CSSOM 尚未准备就绪时，将停止执行 Javascript。这也是为什么一般将 style 标签放在网站上面，script 标签放网站下面的原因。

### 例外

默认情况下，每个脚本都会阻止 DOM 构建，但是，有一种方法可以更改此默认行为。如果将`async`关键字添加到`script`标签，则不会停止 DOM 构建。DOM 构建将继续进行，并且在完成下载并准备就绪后将执行脚本。

尝试下面三种情况页面的渲染有什么不同

> Index.js

```javascript
i = 0;
do {
  i++;
} while (i < 1000000000);
matrix.innerText = i;
```

> Index.html

```html
<div>1</div>
<div id="matrix">
  <script src="./1.js"></script>
</div>
<div>2</div>
```

```html
<div>1</div>
<div id="matrix">
  <script src="./1.js" async></script>
</div>
<div>2</div>
```

```html
<div>1</div>
<div id="matrix">
  <script>
    i = 0;
    do {
      i++;
    } while (i < 1000000000);
    matrix.innerText = i;
  </script>
</div>
<div>2</div>
```

浏览器接收 HTML，CSS 和 JS 字节并将它们转换为屏幕上的渲染像素之间采取的步骤称为**关键渲染路径**。一个经过优化的站点应该进行渐进式渲染，通过优先确定要加载的资源和加载的顺序来尽快加载页面，不会阻塞整个过程。
