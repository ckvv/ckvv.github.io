---
title: "浏览器处理cookie"
tags: ["Web", "Cookie"]
date: "2021-07-09"
---

## 设置 cookie

```js
function setCookie(options) {
  const { name, data } = options;
  const age = options.age || 24 * 3600000;
  const domain = options.domain || window.location.hostname;
  document.cookie = `${name}=${data}; path=/; max-age=${age}; domain=${domain}`;
}
```

## 获取 cookie

```js
function getCookie(cookie_name) {
  let value = null;
  let allcookies = document.cookie;
  let cookie_pos = allcookies.indexOf(cookie_name);
  if (cookie_pos != -1) {
    cookie_pos = cookie_pos + cookie_name.length + 1;
    let cookie_end = allcookies.indexOf(";", cookie_pos);
    if (cookie_end == -1) {
      cookie_end = allcookies.length;
    }
    value = unescape(allcookies.substring(cookie_pos, cookie_end));
  }
  return value;
}
```

## 删除 cookie

设置 cookie 过期时间小于当前时间，那么就会删除该 cookie`"token=; expire=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`

### cookie 无法删除

不能删除 cookie 一般有以下两种情况

- 可以获取 cookie

`document.cookie`可以拿到 cookie，一般是因为 path 或者 domain 写错了导致的

- 获取到到 cookie 为空

cookie 存在但是`document.cookie`拿到的 cookie 为空，可能是因为 cookie 设置了 HttpOnly，如果 HTTP 响应头中包含 HttpOnly 标志，只要浏览器支持 HttpOnly 标志，客户端脚本就无法访问 cookie，并且无法设置该 cookie。客户端脚本代码尝试读取包含 HttpOnly 标志的 cookie，如果浏览器支持 HttpOnly，则返回一个空字符串作为结果。这样能够阻止恶意代码（通常是 XSS 攻击）将 cookie 数据发到攻击者网站。
如果要删除 cookie 需要通过发一个退出到请求，通过后端达到删除 cookie 的目的。
