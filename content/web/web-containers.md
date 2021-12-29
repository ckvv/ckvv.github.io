---
title: 在浏览器中本地运行 Node.js - WebContainers
---

## 起因

在`nodejs.dev`网站看到了一个在线编辑的程序<https://nodejs.dev/learn/introduction-to-nodejs#an-example-nodejs-application> ,起初我以为这是一个类似`codepen`的在线编辑器，通过关键词`webcontainer`, 我发现这是一个在浏览器中本地运行 Node.js程序， 并找到了下面这篇文章<https://blog.stackblitz.com/posts/introducing-webcontainers/>，

> 以面是翻译：

## WebContainers 简介：在浏览器中本地运行 Node.js

[![Eric Simons](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e2877341abd4040b98fab7ea6e977f0~tplv-k3u1fbpfcp-zoom-1.image)**ERIC SIMONS**](https://blog.stackblitz.com/authors/eric-simons)可能2021 年 2 月 20 日[新闻和公告](https://blog.stackblitz.com/categories/news-and-announcements)

你好呀！我们是 StackBlitz，一个专门为 Web 开发量身定制的在线 IDE。在本周的 Google I/O 主题演讲中，您可能已经看到了我们的先睹为快。

今天，我们很高兴地宣布，我们一直在与 Next.js 和 Google 的团队合作开发一项新技术。

几年前，我们意识到网络正走向一个关键的转折点。 WebAssembly 的出现和新的 [功能 API](https://web.dev/fugu-status/) 使编写一个基于 WebAssembly 的操作系统变得可能，它的功能足以运行 Node.js，完全在你的浏览器中。我们设想了一个比本地环境**更快**、**更安全**和**一致**的卓越开发环境，以实现无缝代码协作，而无需设置本地环境。

这听起来有些牵强。但是，如果网络现在为 [平面设计师](https://www.figma.com/blog/webassembly-cut-figmas-load-time-by-3x/)、[视频编辑器](https://www.figma.com/blog/webassembly-cut-figmas-load-time-by-3x/) /web.dev/clipchamp/) 和 [丰富的文档编辑](https://workspaceupdates.googleblog.com/2021/05/Google-Docs-Canvas-Based-Rendering-Update.html)，我们想知道：**开发人员最终有可能\*使用\*网络来\*构建\*网络吗？**

我们决定试一试。我们抱有最好的希望，也期待最坏的结果。两年后（时间过得真快😅），结果出乎意料地惊人。

### 今天我们很高兴地宣布**WebContainers**。

WebContainers 允许您创建全栈 Node.js 环境，这些环境在几毫秒内启动并立即在线和链接共享 - 只需单击一下。该环境加载了 VS Code 强大的编辑体验、完整的终端、npm 等。它还*完全在您的浏览器内*运行，这会产生一些关键优势：

+ **比您的本地环境更快**。构建完成速度最多可提高 20%，软件包安装完成速度比 yarn/npm 快 >= 5 倍。
+ **Node.js 在浏览器中调试**。与 Chrome DevTools 的无缝集成支持原生后端调试，无需安装或扩展。
+ **默认安全**。所有代码执行都发生在*内部*浏览器的安全沙箱中，而不是在远程虚拟机或本地二进制文件上。

![即时全栈 Node.js 环境](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f11ed2b5f5254f019150d18d3fc40113~tplv-k3u1fbpfcp-zoom-1.image)

> 没错：Node.js 运行时本身是有史以来第一次在浏览器中本地运行。

**同样，这些环境不在远程服务器上运行**。相反，每个环境都完全包含在您的 Web 浏览器中。没错：Node.js 运行时本身是有史以来第一次在浏览器中本地运行。

您可以在 [StackBlitz.com](http://stackblitz.com/) 或单击下面的入门项目之一亲自尝试一下。

以毫秒为单位在浏览器中启动 Node.js 项目（不要眨眼！）：

+ [NEXT.JS](https://stackblitz.com/fork/nextjs)
+ [GRAPHQL](https://stackblitz.com/fork/graphql)
+ [HTTP 服务器](https://stackblitz.com/fork/http-server)
+ [NODE.JS STARTER](https://stackblitz.com/fork/node)

截至今天发布，WebContainers 现在处于**公开测试阶段**。当前支持包括 Next.js、GraphQL 和 Vanilla Node.js，我们正在与其他开源项目合作以扩展支持。 （如果您想与我们合作，请查看 [我们的 repo](https://github.com/stackblitz/webcontainer-core/blob/main/Supported_frameworks.md)）。

## 为什么？

设置本地环境是一个巨大的嗡嗡声——特别是如果你想快速制作一个很酷的想法原型，尝试一个新的开源库，创建一个错误再现或与同事合作（“嘿，你能很快在本地查看这个分支吗？ ？”😒）。随着 Web 开发转向像 Next.js 这样的全栈 SSR 和 SSG 工具链，这个问题比以往任何时候都更加普遍。

运行用户提交的代码来复制错误也成为开源维护者和[财富 100 强公司]（https://www.kb.cert.org/vuls/id/319816）的[主要安全风险]（https://www.kb.cert.org/vuls/id/319816） /stackblitz.com/enterprise) 类似，并且这些类型的供应链攻击正在[上升](https://www.zdnet.com/article/supply-chain-hacking-attacks-government-eyes-new-rules -to-tighten-security/)。

StackBlitz 通过利用浏览器内置的数十年的速度和安全创新解决了这些问题。 StackBlitz 中的所有计算都在浏览器安全沙箱中立即发生，并且无法突破到您的本地机器。此模型还解锁了一些关键的开发和调试优势（稍后将详细介绍这些优势）。

#### 代码空间/沙盒/Repls/...怎么样？

传统的在线 IDE 在远程服务器上运行您的整个开发环境，并将结果通过互联网传输回您的浏览器。这种方法的问题在于它几乎没有任何安全优势，并且在几乎所有方面都提供比本地机器更差的体验：启动容器需要几分钟的时间，容易出现网络延迟，无法离线工作，经常导致网络超时，调试冻结/损坏的容器几乎是不可能的，点击刷新只会让您再次连接到损坏的容器。

> StackBlitz 是第一个计算模型对我有意义的在线 IDE。
>
> ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/947802bb7177435ca4b6aa6457b5f313~tplv-k3u1fbpfcp-zoom-1.image)![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bbd1a6ca28584a86a96a295c510f0acf~tplv-k3u1fbpfcp-zoom-1.image )
>
> 汤姆·普雷斯顿-沃纳
>
> GitHub 创始人 & StackBlitz 投资人

## 释放浏览器的力量。

### 使用 Chrome DevTools 进行无缝 Node.js 调试。

事实证明，浏览器非常擅长调试 Javascript。令人震惊，我知道 ;) 通过在浏览器中执行 Node.js，与 Chrome DevTools 的集成“开箱即用”。无需安装，无需扩展，只需在浏览器中进行**本机后端调试**：

![使用 Chrome DevTools 调试 Node.js 代码](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a24bd9dca5dc44d0837a56b0865e9f23~tplv-k3u1fbpfcp-zoom-1.image)

> 能够利用浏览器的内置功能来开发和调试 Next.js 应用程序，这将改变游戏规则。
>
> 我们很高兴与 StackBlitz 团队合作，让开发人员更容易使用 Next.js 和 Vercel。
>
> ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fad1b48890d4b788cb3b9ffeadd697c~tplv-k3u1fbpfcp-zoom-1.image)![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bc8deb57d7547df88b4722d67877cec~tplv-k3u1fbpfcp-zoom-1.image )
>
> 吉列尔莫·劳赫
>
> Vercel 创始人 & Next.js 创始人

### 运行服务器。在您的浏览器中。

是的，实际上。 WebContainers 包括一个映射到浏览器的 ServiceWorker API 的虚拟化 TCP 网络堆栈，使您能够立即按需创建实时 Node.js 服务器，即使您离线也能继续工作。因为它完全在浏览器安全沙箱中运行，所以服务器响应的延迟比 localhost* (!) 少，并保护您的 Web 服务器免受 localhost 抓取攻击：

![在浏览器中运行 API 服务器](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d069a6783fe04f23bef24755024c10a6~tplv-k3u1fbpfcp-zoom-1.image)

### 零足迹。以毫秒为单位启动。

浏览器在执行 Javascript 和 WebAssembly 方面非常快。我们利用它来创建一个不使用服务器资源的即时开发操作系统，并且不会在您的计算机上创建“node_modules”黑洞。

#### 每个页面加载的新鲜环境。

再见，`rm -rf node_modules`！ WebContainer 内置的 npm 客户端速度非常快，以至于它在每次加载页面时都运行全新安装，确保您每次都能获得干净的环境。如果您的环境*确实*出了问题，您可以像处理任何其他网络应用程序一样恢复到干净状态：点击刷新按钮。

![页面加载时的新鲜环境](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b8b4e8918914f4681b5362b93012fe4~tplv-k3u1fbpfcp-zoom-1.image)

### 零延迟。离线工作。

如果在家工作支点教会了我们什么，那就是经常发生网络故障。 ISP 宕机了——很多。使用 StackBlitz，您可以在没有互联网连接的情况下继续工作，无论您是在火车上、飞机上，还是在雨中的后座 uber-ing：

![离线工作](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14d975faf5b14cb98f6a58bff324288c~tplv-k3u1fbpfcp-zoom-1.image)

### 默认安全。

使用 StackBlitz 的新颖计算模型，100% 的代码执行发生在浏览器安全沙箱中。这导致比本地开发环境更快且*更少*限制，同时提供*更多*的安全性，这是一种非常罕见的组合。

事实上，默认的安全状态是如此稳固，以至于我们的嵌入式包管理器是 [第一个公开可用的工具](https://twitter.com/samccone/status/1395421621528064003) 解决了 Sam Saccone 发现的长期未解决的 npm 漏洞 [五年多前](https://www.kb.cert.org/vuls/id/319816)。

##让我们暂停一下。

## 因为这是故事真正令人费解的地方。

> 在 Google I/O 上，我们很高兴展示 StackBlitz 如何使用最新的网络功能来提供一种将网络应用程序和桌面应用程序混淆的体验。
>
> ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc0cb639a6a94e0faf28b3dac50c630c~tplv-k3u1fbpfcp-zoom-1.image)![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99bec72cfd154d0486745bf84ccd560a~tplv-k3u1fbpfcp-zoom-1.image )
>
> 迪翁·阿尔玛尔
>
> Google Chrome 工程总监

“网络”应用程序和“本机”应用程序之间有什么区别？ Chrome 团队一直在发布新的功能 API 来缩小这一差距，而增量正在迅速接近零。

### 桌面级编辑。即时桌面应用安装。

由于 Chrome 的 PWA 功能，安装 StackBlitz 就像单击一样简单。几毫秒后，您就有了一个可以从 Dock 启动的桌面 IDE。您依赖于日常工作效率的按键绑定，如 CMD + W 和 CMD + T “正常工作”。此外，就像在本地一样，您可以在一个完全独立的窗口中打开和调试您的开发服务器。

![桌面 PWA](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c5145cd73c74f41a6e8bbddace33fd3~tplv-k3u1fbpfcp-zoom-1.image)

### 从本地文件系统读取和写入。

Chrome 团队最近发布了 [文件系统访问 API](https://web.dev/file-system-access/)。这使 PWA 能够请求对本地文件系统的某些部分进行持久的读写访问。与 StackBlitz WebContainers 搭配使用，这暗示了一个潜在的未来，不需要节点、npm、git、VS Code 或任何其他安装在硬盘上的东西。您只需要一个网络浏览器：

![本机文件系统访问](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f8457436ddc4764a415594809181e24~tplv-k3u1fbpfcp-zoom-1.image)

*技巧问题：其中哪一个是 StackBlitz，哪一个实际上是 VS Code？* 🙃

## 下一步是什么？

我们将在接下来的一两个季度进行测试，因为我们[与开源维护者合作](https://github.com/stackblitz/webcontainer-core/blob/main/Supported_frameworks.md) 为他们的用户群带来完全兼容性并稳定核心WebContainer技术。之后是功能齐全的 StackBlitz v2。

如果你能：那不是很好吗？

+ 每个 PR 上的开放环境（编辑器 + 实时预览！）。您可以浏览、播放、测试，从而执行真正可靠的代码审查，而无需关闭您正在处理的其他项目。
+ 同时检查多个分支以并排比较它们。 （你会考虑在本地环境中这样做吗？在 StackBlitz 中，这意味着只是打开一个新选项卡）。
+ 直接从浏览器更新您的 Docusaurus 文档或 Gatsby 博客。
+ 从字面上学习任何 JavaScript 前端或后端框架，而无需安装任何东西！

#### 发展。预览。船。 **♾️**

我们与 Vercel 和 Next.js 的合作关系也刚刚开始触及皮毛。为前所未有的无缝开发体验做好准备（抢先体验 [此处](https://stackblitz.com/v2)）。

## 软件开发的未来是光明的。

还有很多工作要做，但我们现在可以自信地说，一个没有本地节点、npm、git 和 VS Code 实例的未来是切实可行的，甚至可以让世界上的软件在以前无法运行的地方运行。

想象一下未来，您可以在 [Cloudflare Workers](https://workers.cloudflare.com/) 等平台的边缘运行 WebContainer，或者在 iPad 上本地运行整个开发环境。如何通过 [WASI](https://wasi.dev/) 在浏览器中运行您最喜欢的 VS Code 扩展，或运行非 Web 原生语言，如 Python、Java 或 R？还有许多未知数有待发现和解决，但我们相信这项技术的未来机会是巨大的。

这些事情可能看起来有点疯狂。而且还有很多不为人知的未知数。但我们认为这个新的未来值得一试。因为，谁知道呢？它最终可能会**出乎意料的惊人**。

------

谢谢阅读！在 [Twitter](https://twitter.com/stackblitz) 上关注我们，随时了解所有激动人心的更新。我们的核心团队今天和明天（5/20 和 5/21）都会在 Twitter Spaces 上进行现场问答。

如果您想了解有关 WebContainer 的更多信息以及如何参与，请查看 [core WebContainer WG repo](https://github.com/stackblitz/webcontainer-core/blob/main/Supported_frameworks.md)。您还可以在此[最近的播客节目](https://www.youtube.com/watch?v=5F9qH-ea5Qk) 上了解更多关于起源故事和更深入的技术细节。

感谢我们在 Vercel 和 Google 的合作伙伴、我们的 [客户](https://stackblitz.com/enterprise) 以及每月使用 StackBlitz 的数百万开发人员。

喜欢您所看到的并希望帮助我们实现 Web 开发未来的愿景吗？转到 [stackblitz.com](https://stackblitz.com/) 并帮助我们完善 Next.js 测试版并[提供反馈](https://github.com/stackblitz/webcontainer-core)。与我们合作[为您最喜欢的开源库带来兼容性](https://github.com/stackblitz/webcontainer-core)。参与帮助 [将世界上的原生二进制文件转换为 WebAssembly](https://github.com/stackblitz/webcontainer-core)。快来加入 [StackBlitz 团队](https://stackblitz.com/careers)。或者，告诉您的朋友有关在浏览器中本机运行的最快、最安全和一致的 Web 开发环境！

最后，我要感谢 StackBlitz 了不起的团队，他们为使这个项目成为现实而不懈努力❤让我们走吧！


