---
title: "CSS颜色"
tags: ["CSS"]
date: "2023-03-22"
---

记录一下CSS颜色的相关概念

## alpha 
`alpha `表示可以在某种程度上看到背景的颜色，不透明度可以被认为是一种后处理操作。从概念上讲，在元素（包括其后代）渲染成 RGBA 离屏图像后，不透明度设置指定如何将离屏渲染混合到当前合成渲染中。

## 颜色语法

CSS 提供了几种直接指定[`sRGB`](https://w3c.github.io/csswg-drafts/css-color/#numeric-srgb)颜色的方法

### color keyword

CSS 定义了一大组命名颜色，以便可以更轻松地编写和阅读常用颜色。

`red`, `blue`, `green` 等等

`LinkText`, `transparent(透明的黑色)`, `currentColor（代表同一元素上的颜色）`


### rgb（red blue green）

通过直接指定红、绿和蓝通道来定义 sRGB 颜色。

### RGB十六进制表示

将通道作为十六进制数字来指定 `sRGB` 颜色，其值由 3、4、6 或 8 个十六进制数字组

+ 六位`#00ff00`，每两位代表一个通道，其中`00`表示最小值，`ff`（十进制为 255）表示最大值。即`rgb(0 255 0)`
+ 八位`#00ff00cc`，最后一对数字表示`alpha` 即`rgb(0 0 100% / 80%)`
+ 三位`#Of0` 等于 `#00ff00`
+ 四位`#0f0c`等于 `#00ff00cc`

### hsl (Hue Saturation Lightness)
色调 饱和度 亮度
### hwb（Hue Whiteness Blackness）
色调 白色 黑色 透明度

### lab & oklab （（lightness a b）
亮度 通道a( green / magenta) 通道b(blue / yellow )
### lch & oklch （lightness chroma hue）
亮度 色度 色调

#### color()


## 函数语法

### [旧版函数语法](https://w3c.github.io/csswg-drafts/css-color/#color-syntax-legacy)

`rgb()`、`rgba()`、`hsl()`和`hsla()`为了兼容性也支持旧版函数语法
+ 变量由`,`分隔
+ 不允许使用none值


```css
/* 以下表示 50% 不透明的饱和 sRGB 红色： */
rgba(100%, 0%, 0%, 0.5)
```

### [新版函数语法](https://w3c.github.io/csswg-drafts/css-color/#color-syntax-modern)

+ 变量由` `分隔
+ 可选项由`/`分隔
+ 允许使用`none`值
```css
/* 以下表示 50% 不透明的饱和 sRGB 红色： */
rgba(100% 0% 0% /0.5)
```

> 参考<https://w3c.github.io/csswg-drafts/css-color/#introduction>