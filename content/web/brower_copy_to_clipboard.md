---
title: 拷贝数据到剪贴板
tags: ['web']
---

介绍几种在浏览器中拷贝数据到剪贴板的方法

## document.execCommand("copy");
拷贝当前选中内容到剪贴板, 该api已经废弃不推荐使用，
```js
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    let msg = document.execCommand("copy");
    if (!msg) {
      throw new Error("Copy filed");
    }
  } finally {
    document.body.removeChild(textArea);
  }
}
```

## navigator.clipboard
剪贴板 Clipboard API 提供了响应剪贴板命令（剪切、复制和粘贴）与异步读写系统剪贴板的能力。从权限 Permissions API 获取权限之后，才能访问剪贴板内容；如果用户没有授予权限，则不允许读取或更改剪贴板内容。该 API 被设计用来取代使用 `document.execCommand()` 的剪贴板访问方式。(基于 HTTP 的网站中包含的脚本则不能获得剪贴板对象)

```js
await navigator.clipboard.writeText(data);
```

## npm package

clipboard, 内部使用的 `document.execCommand()`, 
clipboardy, 该库较重，支持web平台之外的copy

以[clipboard](https://www.npmjs.com/package/clipboard) 为例

```js
function copyData(data) {
  const btn = document.createElement("BUTTON");
  const clipboard = new ClipboardJS(btn, {
    text: () => {
      return data;
    },
  });
  clipboard.on("success", (e) => {
    e.clearSelection();
    clipboard.destroy();
  });
  clipboard.on("error", (e) => {
    e.clearSelection();
    clipboard.destroy();
  });
  btn.click();
}
```