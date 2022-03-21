---
title: "手机web端调试"
tags: ['web', 'debug']
date: '2021-12-29'
---


最近使用vue开发的一个应用，在部分手机页面中会出现时而正常时而异常的问题，由手机中调试不如桌面那么方便，想着在网上找找有没有现成的解决方案，大体分三种,下面大概介绍下

### 捕获错误日志将日志发送到服务器查看

前端应用通过[window.onerror](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onerror)事件捕获错误或者重写`console`方法，将日志通过请求发送到后端应用

### 捕获错误日志把日志在前端应用查看

如腾讯的[vConsole](https://github.com/Tencent/vConsole/blob/dev/doc/tutorial_CN.md)，该插件会在页面右下角插入一个按钮，点击可以打开一个类似调试页面的窗口。

主要包括以下功能:

+ 查看 console 日志
+ 查看网络请求
+ 查看页面 element 结构
+ 查看 Cookies、localStorage 和 SessionStorage
+ 手动执行 JS 命令行
+ 自定义插件

使用方法如下：

```javascript
import VConsole from "vconsole";
new VConsole();
```

### 通过某些特殊应用调试

如使用谷歌浏览器的开发者工具远程调试Android和iOS页面，手机和电脑使用usb连接，手机要开启usb调试模式，在电脑端浏览器输入chrome://inspect会打开设备监视页面，这里可以监视到iOS和Android设备
