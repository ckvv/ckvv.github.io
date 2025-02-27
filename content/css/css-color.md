---
title: "CSS颜色"
tags: ["CSS"]
date: "2023-03-22"
---

记录一下CSS颜色的相关概念

## alpha

`alpha `表示可以在某种程度上看到背景的颜色，不透明度可以被认为是一种后处理操作。从概念上讲，在元素（包括其后代）渲染成 RGBA 离屏图像后，不透明度设置指定如何将离屏渲染混合到当前合成渲染中。

### 透明度变化 rgb(255 0 0 / 1),rgb(255 0 0 / 0))
<div class="w-full h-4" style="background-image:linear-gradient(90deg, rgb(255 0 0 / 1),rgb(255 0 0 / 0))"></div>

## 颜色格式

CSS 提供了几种直接指定[`sRGB`](https://w3c.github.io/csswg-drafts/css-color/#numeric-srgb)颜色的方法

### color keyword

CSS 定义了一大组命名颜色，以便可以更轻松地编写和阅读常用颜色。

`red`, `blue`, `green` 等等

`LinkText`, `transparent(透明的黑色)`, `currentColor（代表同一元素上的颜色）`

### rgb（red blue green）

通过调节红、绿、蓝三原色的亮度和色彩来表示颜色。在RGB模型中，每种颜色的取值范围为0-255。

<div class="w-full h-4" style="background-image:linear-gradient(90deg, rgb(0,0,0),rgb(255,0,0))"></div>

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
如: `hsl(50 0% 40%)`  `hsl(50 80% 40% / 25%)`

#### 色调变化`hsl(0 100% 50%), hsl(360 100% 50%)`
<div class="w-full h-4" style="background-image:linear-gradient(90deg in hsl longer hue, hsl(0 100% 50%), hsl(360 100% 50%))"></div>

#### 饱和度变化`hsl(0 0% 50%), hsl(0 100% 50%)`
<div class="w-full h-4" style="background-image:linear-gradient(90deg in hsl shorter hue, hsl(0 0% 50%), hsl(0 100% 50%))"></div>

#### 亮度变化`hsl(0 100% 0%), hsl(0 100% 100%)`
<div class="w-full h-4" style="background-image:linear-gradient(90deg in hsl shorter hue, hsl(0 100% 0%), hsl(0 100% 100%))"></div>

优点

+ 直观，人们可以猜测他们想要的颜色，然后进行调整。

缺点

+ HSL 相对于 LCH 的缺点是色调操作会改变视觉亮度
+ 色调之间的间隔不均匀（色调角度在感知上并不均匀；颜色在某些区域看起来聚集在一起，而在其他区域则间隔很宽）

### hwb（Hue Whiteness Blackness）

类似于HSL模型的圆锥模型，但是它使用白色和黑色的比例来描述颜色。在HWB模型中，色调的取值范围为0-360度，白色和黑色的取值范围为0-100%

#### 色调变化`hwb(0 0% 0%), hwb(360 0% 0%)`
<div class="w-full h-4" style="background-image:linear-gradient(90deg in hsl longer hue, hwb(0 0% 0%), hwb(360 0% 0%))"></div>

#### 白度变化`hwb(0 0% 0%), hwb(0 100% 0%)`
<div class="w-full h-4" style="background-image:linear-gradient(90deg, hwb(0 0% 0%), hwb(0 100% 0%))"></div>

#### 黑度变化`hwb(0 0% 0%), hwb(0 0% 100%)`

<div class="w-full h-4" style="background-image:linear-gradient(90deg, hwb(0 0% 0%), hwb(0 0% 100%))"></div>


### lab & oklab （（lightness a b）
```
lab(L a b[ / A])
```
+ L(亮度): 数字`0-100`, 百分比`0%-100%`, 0 对应黑色, 100 对应白色
+ a(通道a( green / red)): 数字`-125-125`, 百分比`0%-100%` 表示 绿色(-125) 到 红色(125)的位置
+ b(通道b(blue / yellow )): 数字`-125-125`, 百分比`0%-100%` 表示 蓝色(-125) 到 黄色(125)的位置

#### L变化`lab(0 0% 0%), lab(100 0% 0%)`
<div class="w-full h-4" style="background-image:linear-gradient(90deg, lab(0 0% 0%), lab(100 0% 0%))"></div>

#### a变化`lab(50% 0% 0%), lab(50% 100% 0%)`
<div class="w-full h-4" style="background-image:linear-gradient(90deg, lab(50% 0% 0%), lab(50% 100% 0%))"></div>

#### b变化`lab(50% 0% 0%), lab(50% 0% 100%)`

<div class="w-full h-4" style="background-image:linear-gradient(90deg, lab(50% 0% 0%), lab(50% 0% 100%))"></div>


### lch & oklch （lightness chroma hue）
```
lch(L C H[ / A])
```
+ L(亮度): 数字`0-100`, 百分比`0%-100%`, 0 对应黑色, 100 对应白色
+ C(色度): 数字`0-150`, 百分比`0%-100%`, 该值是颜色色度的度量
+ H(角度): 数字`0-150`, 百分比`0%-100%`, 表示颜色的 `hue` 角度

#### L变化`lch(0% 100% 0), lch(100% 100% 0)`
<div class="w-full h-4" style="background-image:linear-gradient(90deg, lch(0% 100% 0), lch(100% 100% 0))"></div>

#### a变化`lab(50% 0% 0%), lab(50% 100% 0%)`

<div class="w-full h-4" style="background-image:linear-gradient(90deg, lch(50% 0% 0), lch(50% 100% 0))"></div>

#### b变化`lab(50% 0% 0%), lab(50% 0% 100%)`

<div class="w-full h-4" style="background-image:linear-gradient(90deg, lch(50% 50% 0), lch(50% 50% 150))"></div>

# 亮度 色度 色调

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
