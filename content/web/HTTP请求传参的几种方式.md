---
title: 'HTTP请求传参的几种方式'
date: '2022-08-15'
---

前后端通过[HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP)请求穿参的几种方式：

## URL传参(params)

我们可以通过`?`开头并用`&`符号分隔的键 - 值对，同时以 '=' 分隔键和值的URL, 如`http://127.0.0.1:3000?key1=value1&key2=value2`来提供额外参数。为了构造查询字符串，我们可以使用[URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

```js
// Pass in a searc
new URLSearchParams(`key1=value1&key2=value2`);

// Pass in a sequence
new URLSearchParams([["key1", "value1"],["key2", "value2"]]);

// Pass in a record
new URLSearchParams({"key1" : "value1", "key2" : "value2"});

// 通过URL传入的参数都会被隐式地转译为`字符串`, 如果保护有特殊字符将被转译,非字母或数字的字符会被 percent-encoding<https://developer.mozilla.org/en-US/docs/Glossary/percent-encoding>, 相当于调用encodeURIComponent<https://www.rfc-editor.org/rfc/rfc3986#section-1.2.1>, 对于转译后的字符串我们可以用decodeURIComponent解码
new URLSearchParams({"key1" : [1,2,3]}) // key1=1%2C2%2C3 即 key1=1,2,3
new URLSearchParams({"key1" : { age: 18 }}) // key1=%5Bobject+Object%5D 即 key1=[object+Object]
```

如果我们希望传递嵌套的对象可以通过前后端约定一种序列化参数的编码解码方案，如[qs](https://www.npmjs.com/package/qs)

```js
// 在前端对参数编码
Qs.stringify({{"key1" : { age: 18 }}}) // key1%5Bage%5D=18 即 key1[age]=18
// 在后端调用对应的解码函数
Qs.parse(`key1%5Bage%5D=18`) // {"key1":{"age":"18"}}
```

### 设置URL参数的例子

通过`axios`设置URL参数

```js
const instance = axios.create({
  paramsSerializer(params) {
    return Qs.stringify(params);
  },
});

// 或者
axios(`http://127.0.0.1:3000?${Qs.stringify(params)}`)
```

通过`fetch`设置URL参数

```js
fetch(`http://127.0.0.1:3000?${Qs.stringify(params)}`)
```

## header传参

[Headers](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers)允许客户端和服务器通过`request`和`response`传递附加信息，主要用来描述资源或服务器或客户端的行为.

我们可以通过以下方式构造`Headers`

```js
const headers = new Headers();
headers.append('Content-Type', 'application/json');
```

### 例子

通过`axios`设置`Headers`

```js
const instance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  paramsSerializer(params) {
    return Qs.stringify(params);
  },
});

// 或者
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```
通过`fetch`设置`Headers`

```js
fetch('input', {
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
});
```

## Body传参

[Body](https://greenbytes.de/tech/webdav/draft-ietf-httpbis-p1-messaging-26.html#rfc.section.3.3)用于携带该请求或响应的有效负载正文。可以传递任何参数


### form-data

### application/x-www-form-urlencoded
### raw
text/plain
application/json
text/html
application/xml
application/javascript
### binary

