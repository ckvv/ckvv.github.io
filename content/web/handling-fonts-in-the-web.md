---
title: '处理浏览器中的字体常见问题'
tags: ['css', 'web']
date: '2022-02-09'
---

当页面中的标题字数是不定的，并且需要适应各种机型屏幕宽度，可能会遇到下面的需求,

## 字体末尾如何显示省略号

如果显示区域很小，我们可以只设置为单行显示，对于单行文本末尾显示省略号很简单

```css
.wrapper {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

但是如果是显示区域很大,我们需要设置多行的最后一行显示省略号，对于多行文本，常用的方法如下

移动端兼容较好，适用于webkit内核浏览器, 另外对于超出部分的字体仍会显示出来，如下图所示

<div style="width: 100px; height:120px;">
  <div style="width: 100px; height:60px; display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical; ">
    hello
    hello
    hello
    hello
    hello
    hello
    hello
    hello
  </div>
</div>

所以我们一般需要搭配固定高度及`overflow: hidden;`, `line-height`或者`font-size`使用

<div style="width: 100px; height:120px;">
  <div style="width: 100px; height:60px; line-height: 20px; overflow: hidden; display: -webkit-box;-webkit-line-clamp: 3;-webkit-box-orient: vertical; ">
    hello
    hello
    hello
    hello
    hello
    hello
    hello
    hello
  </div>
</div>

```css
.wrapper {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; 
}
```

## 解决多行文字时最后一排文字可能超出边框显示不全问题

对于多行文字，最后一排文字可能超出边框显示不全的情况，对于这种情况我们需要设置外部容器高度为字体高度的整数倍如对于一个高`6em`的容器,我们可以设置他的`line-height`为`3em`, 或者我们设置他的`font-size`为 `2.5em`,并且把`line-height`设置为`1.2`,

## 如何文字大小自适应容器

### 动态修改字体大小

根据不同的字体长度, 设置不同的字体大小； 或者逐渐修改初始字体大小，直到字体容器宽度和高度小于外层包裹的容器宽, 但是由于字体大小有最小值，这种办法对太对的文本也无能为力

### zoom,transform缩放字体容器

我们可以通过外层容器宽高和字体容器宽高计算出需要缩放的比例，通过设置zoom、scale来自适应容器宽高,如:

```html
<div class="auto-size" contenteditable="true" style="border: 1px solid gray; width: 120px; height: 120px;resize: both; overflow: scroll;">
  <span>
    通过拖动右下角,或者增加删除文字查看字体缩放。
  </span>
</div>
<script>
function autoFit(ele) {
    const wrapperSty = ele.getBoundingClientRect();
    const inner = ele.children[0];
    const innerSty = inner.getBoundingClientRect();
    const scale = Math.floor(Math.min(wrapperSty.width / innerSty.width, wrapperSty.height / innerSty.height) * 100) / 100;
    inner.style.zoom = scale;
    // inner.style.display="inline-block"
    // const translate = (1 / scale - 1) / 2 * 100;
    // inner.style.transform = `scale(${scale}) translate(-${translate}%, -${translate}%)`;
}
document.querySelectorAll('.auto-size').forEach(ele => {
  new ResizeObserver(() => {
    autoFit(ele)
    ele.oninput = () => {
      autoFit(ele)
    };
  }).observe(ele);
});
</script>
```

<div class="auto-size" contenteditable="true" style="border: 1px solid gray; width: 120px; height: 120px;resize: both; overflow: scroll; line-height: 1.2">
  <span>
    通过拖动右下角,或者增加删除文字查看字体缩放。
  </span>
</div>

<script>
function autoFit(ele) {
    const wrapperSty = ele.getBoundingClientRect();
    const inner = ele.children[0];
    const innerSty = inner.getBoundingClientRect();
    const scale = Math.floor(Math.min(wrapperSty.width / innerSty.width, wrapperSty.height / innerSty.height) * 100) / 100;
    inner.style.zoom = scale;
}
document.querySelectorAll('.auto-size').forEach(ele => {
  new ResizeObserver(() => {
    autoFit(ele)
    ele.oninput = () => {
      autoFit(ele)
    };
  }).observe(ele);
});
</script>

## svg的viewBox

svg的viewBox属性允许指定一个给定的一组图形伸展以适应特定的容器元素。但是svg并不能很好地处理文本换行，这种方法比较适合单行文本

```html
<svg class="hd" width="100%" height="50" viewBox="0 0 900 50"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <text class="svg-text" x="0" y="20">这个标题很长哦可能一行放不下的怎么办呢这个标题很长哦可能一行放不下的怎么办呢这个标题很长哦可能一行放不下的怎么办呢</text>
</svg>
```

<svg style="width: 100%;" class="hd" width="100%" height="50" viewBox="0 0 900 50"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <text class="svg-text" x="0" y="20">这个标题很长哦可能一行放不下的怎么办呢这个标题很长哦可能一行放不下的怎么办呢这个标题很长哦可能一行放不下的怎么办呢</text>
</svg>
