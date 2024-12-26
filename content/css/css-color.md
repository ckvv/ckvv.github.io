---
title: "CSS颜色"
tags: ["CSS"]
date: "2023-03-22"
---

记录一下CSS颜色的相关概念

## alpha
`alpha `表示可以在某种程度上看到背景的颜色，不透明度可以被认为是一种后处理操作。从概念上讲，在元素（包括其后代）渲染成 RGBA 离屏图像后，不透明度设置指定如何将离屏渲染混合到当前合成渲染中。

## 颜色格式

CSS 提供了几种直接指定[`sRGB`](https://w3c.github.io/csswg-drafts/css-color/#numeric-srgb)颜色的方法

### color keyword

CSS 定义了一大组命名颜色，以便可以更轻松地编写和阅读常用颜色。

`red`, `blue`, `green` 等等

`LinkText`, `transparent(透明的黑色)`, `currentColor（代表同一元素上的颜色）`

### rgb（red blue green）

通过调节红、绿、蓝三原色的亮度和色彩来表示颜色。在RGB模型中，每种颜色的取值范围为0-255。

### RGB十六进制表示

将通道作为十六进制数字来指定 `sRGB` 颜色，其值由 3、4、6 或 8 个十六进制数字组

+ 六位`#00ff00`，每两位代表一个通道，其中`00`表示最小值，`ff`（十进制为 255）表示最大值。即`rgb(0 255 0)`
+ 八位`#00ff00cc`，最后一对数字表示`alpha` 即`rgb(0 0 100% / 80%)`
+ 三位`#Of0` 等于 `#00ff00`
+ 四位`#0f0c`等于 `#00ff00cc`

优点

+ 兼容性好

缺点

+ 人类难以直观地判断颜色。例如，很难说出如何改变 RGB 颜色以产生相同色调的较亮变体

### hsl (Hue Saturation Lightness)
模型是一种圆锥模型，通过色调、饱和度和亮度三个参数来描述颜色。在HSL模型中，色相的取值范围为0-360度，饱和度和亮度的取值范围为0-100%。
如: `hsl(50 80% 40%)`  `hsl(50 80% 40% / 25%)`

优点

+ 直观，人们可以猜测他们想要的颜色，然后进行调整。

缺点

+ HSL 相对于 LCH 的缺点是色调操作会改变视觉亮度
+ 色调之间的间隔不均匀（色调角度在感知上并不均匀；颜色在某些区域看起来聚集在一起，而在其他区域则间隔很宽）

### hwb（Hue Whiteness Blackness）

类似于HSL模型的圆锥模型，但是它使用白色和黑色的比例来描述颜色。在HWB模型中，色调的取值范围为0-360度，白色和黑色的取值范围为0-100%

### lab & oklab （（lightness a b）
亮度 通道a( green / magenta) 通道b(blue / yellow )
### lch & oklch （lightness chroma hue）
亮度 色度 色调

### color()

函数color()允许在特定的指定颜色空间中指定颜色，而不是大多数其他颜色函数在其中运行的隐式 `sRGB` 颜色空间
`color(display-p3 1 0.5 0 / 0.5);`

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
