---
title: "前端下载文本"
tags: ['web']
date: '2021-07-09'
---

## 前端保存文本

```javascript
function download( text, filename) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

download("data.txt", "hello word!");　　// 调用
```