---
title: "浅谈css动画"
tags: ['web', 'css']

---

本文简单介绍如何定义css动画

# transition

transitions 可以决定哪些属性发生动画效果`transition-property` (明确地列出这些属性,如果省略则包含所有属性)，何时开始` transition-delay` (设置 delay），持续多久`transition-duration` (设置 duration) 以及如何动画`transition-timing-function` (定义*timing function*，比如匀速地或先快后慢)

如下面指定字体大小颜色和字体发生动画效果

```html
.transition-box{
  font-size: 1rem;
  color: red;
  transition: color 2s, font-size 2s;
}

```

transition的发生需要属性被修改时才会触发，比如hover时我们修改字体大小和颜色，如果没有定义transition这些属性会立即修改，

```
.transition-box:hover {
  font-size: 2rem;
  color: green;
}
```


---

<style>
.transition-box{
  font-size: 1rem;
  color: red;
  transition: color 2s, font-size 2s;
}
.transition-box:hover {
  font-size: 3rem;
  color: green;
}
</style>
<div class="transition-box">
  把鼠标放上查看效果
</div>

---

CSS 过渡 由简写属性[ ](https://developer.mozilla.org/en-US/docs/CSS/transition)[`transition`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition) 定义是最好的方式，可以避免属性值列表长度不一，节省调试时间。

也可以用下面子属性来控制过渡的各部分

```css
  transition-property: color, font-size;
  transition-duration: 4s;
  transition-timing-function: ease;
  transition-delay: 0s;
```


## transition的特点

+ 只能在css属性变化时被动触发
+ transition是一次性的，不能重复发生，除非一再触发

+ transition只能定义开始状态和结束状态，不能定义中间状态

# animation

**animation** 属性用来指定一组或多组动画，每组之间用逗号相隔,是 [`animation-name`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-name)，[`animation-duration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-duration), [`animation-timing-function`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function)，[`animation-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay)，[`animation-iteration-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-iteration-count)，[`animation-direction`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-direction)，[`animation-fill-mode`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode) 和 [`animation-play-state`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-play-state) 属性的一个简写属性形式。



首先我们需要先定义一个关键帧`keyframes`, **`@keyframes`** [at-rule](https://developer.mozilla.org/zh-CN/docs/Web/CSS/At-rule) 规则通过在动画序列中定义关键帧（或waypoints）的样式来控制CSS动画序列中的中间步骤。和 [转换 transition](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Transitions) 相比，关键帧 keyframes 可以控制动画序列的中间步骤。

下面定义了一个开始时正常大小，中间时放大1.5倍，结束时回复正常大小

```
@keyframes scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```

下面我们定义了一个button，在`animation`中指定scale，动画世界0.8秒，infinite表示动画播放的次数无限次

```
.animation-btn{
  background-color: #ff2b99;
  border: 0px solid gray;
  color: #fff;
  animation: scale .8s infinite;
  border-radius: 4px;
  width: 120px;
  height: 30px;
  font-size: 16px;
}
```


---

<style>
@keyframes scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.animation-btn{
  background-color: #ff2b99;
  border: 0px solid gray;
  color: #fff;
  animation: scale .8s infinite;
  border-radius: 4px;
  width: 120px;
  height: 30px;
  font-size: 16px;
}
</style>
<button class="animation-btn">AUTO SCALE</button>

---




# 参考

+ https://developer.mozilla.org/en-US/docs/Web/CSS/animation

+ https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Transitions

