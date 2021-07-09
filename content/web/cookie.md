---
title: '浏览器处理cookie'
tags: ['js']
---

## 设置cookie

```js
function setCookie(options) {
  const { name, data } = options;
  const age = options.age || 24 * 3600000;
  const domain = options.domain || window.location.hostname;
  document.cookie = `${name}=${data}; path=/; max-age=${age}; domain=${domain}`;
}
```

## 获取cookie


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

## 删除cookie
设置cookie过期时间小于当前时间，那么就会删除该cookie`"token=; expire=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`

### cookie无法删除
不能删除cookie一般有以下两种情况
## 可以获取cookie
`document.cookie`可以拿到cookie，一般是因为path或者domain写错了导致的

## 获取到到cookie为空
cookie存在但是`document.cookie`拿到的cookie为空，可能是因为cookie设置了HttpOnly，如果HTTP响应头中包含HttpOnly标志，只要浏览器支持HttpOnly标志，客户端脚本就无法访问cookie，并且无法设置该cookie。客户端脚本代码尝试读取包含HttpOnly标志的cookie，如果浏览器支持HttpOnly，则返回一个空字符串作为结果。这样能够阻止恶意代码（通常是XSS攻击）将cookie数据发到攻击者网站。
如果要删除cookie需要通过发一个退出到请求，通过后端达到删除cookie的目的。
