---
title: JsonWebToken
tags: ["Node.js", "JsonWebToken"]
date: "2021-07-09"
---

## 什么是 JSON Web Token？

JSON Web Token（JWT）是一个开放标准（RFC 7519），它定义了一种紧凑且独立的方式，用于在各方之间用 SON 对象安全地传输信息。此信息可以通过数字签名进行验证和信任。 JWT 可以使用加密算法（使用 HMAC 算法）或使用 RSA 或 ECDSA 的公钥/私钥对进行签名。

## 什么时候应该使用 JSON Web 令牌

以下是 JSON Web 令牌有用的一些场景：

- 授权：这是使用 JWT 的最常见方案。一旦用户登录，每个后续请求将包括 JWT，允许用户访问该令牌允许的路由，服务和资源。 Single Sign On 是一种现在广泛使用 JWT 的功能，因为它的开销很小，并且能够在不同的域中轻松使用。

- 信息交换：JSON Web 令牌是在各方之间安全传输信息的好方法。因为 JWT 可以签名 - 例如，使用公钥/私钥对 - 您可以确定发件人是他们所说的人。此外，由于使用标头和有效负载计算签名，您还可以验证内容是否未被篡改。

## JSON Web 令牌结构

JSON Web Tokens 由`.`分隔的三个部分组成，它们是：

- 头
- 有效载荷
- 签名
  因此，JWT 通常如`xxxxx.yyyyy.zzzzz`所示.

## 头

标头通常由两部分组成：令牌的类型，即 JWT，以及正在使用的签名算法，例如 HMAC SHA256 或 RSA。

```
{
  "alg": "HS256",
  "typ": "JWT"
}
```

然后，这个 JSON 被编码为 Base64Url，形成 JWT 的第一部分。

## 有效载荷

令牌的第二部分是有效负载，其中包含声明。声明是关于实体（通常是用户）和其他数据的声明。有三种类型:registered、public、private claims.

- registered：这些是一组预定义声明，不是强制性的，但建议使用，以提供一组有用的，可互操作的声明。其中一些是： iss（发行人）， exp（到期时间），sub（主题）， aud（观众）等。
- public：这些可以由使用 JWT 的人随意定义。但为避免冲突，应在 IANA JSON Web 令牌注册表中定义它们，或者将
  其定义为包含防冲突命名空间的 URI。
- private claims： 这是创建共享使用它们同意并既不是当事人之间的信息自定义声明注册或公众的权利要求

然后，有效负载经过 Base64Url 编码，形成 JSON Web 令牌的第二部分。

> 请注意，对于签名令牌，此信息虽然可以防止被篡改，但任何人都可以读取。除非加密，否则不要将秘密信息放在 JWT 的有效负载或头元素中。

## 签名

要创建签名部分，您必须采用编码标头，编码的有效负载，秘密，标头中指定的算法，并对其进行签名。
例如，如果要使用 HMAC SHA256 算法，将按以下方式创建签名：

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

签名用于验证消息在此过程中未被更改，并且，在使用私钥签名的令牌的情况下，它还可以验证 JWT 的发件人是否是它所声称的人。

- 结果

输出是三个由点分隔的 Base64-URL 字符串，可以在 HTML 和 HTTP 环境中轻松传递，而与基于 XML 的标准（如 SAML）相比更加紧凑。

```
//原始
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1NjIxMzQ0MDIsImV4cCI6MTU2MjEzNDQ2Mn0.dzH7ogImjrWX8Qc-arXHFFjgF8YcO_KBi7BCgcmQUGk

//Base64 解码后
{"alg":"HS256","typ":"JWT"}{"foo":"bar","iat":1562134402,"exp":1562134462}�~耉��e�AϚ�q�8����b��rd

```

## 使用 jsonwebtoken 登录

在身份验证中，当用户使用其凭据成功登录时，将返回 JSON Web 令牌。由于令牌是凭证，因此必须非常小心以防止出现安全问题。一般情况下，您不应该将令牌保留的时间超过要求。

每当用户想要访问受保护的路由或资源时，用户代理应该使用承载模式发送 JWT，通常在 Authorization 标头中。标题的内容应如下所示：

```
Authorization: Bearer <token>
```

在某些情况下，这可以是无状态授权机制。服务器的受保护路由将检查 Authorization 标头中的有效 JWT ，如果存在，则允许用户访问受保护资源。如果 JWT 包含必要的数据，则可以减少查询数据库以进行某些操作的需要，尽管可能并非总是如此。

如果在标 Authorization 头中发送令牌，则跨域资源共享（CORS）将不会成为问题，因为它不使用 cookie。

> 请注意，使用签名令牌，令牌中包含的所有信息都会向用户或其他方公开，即使他们无法更改。这意味着您不应该在令牌中放置秘密信息。

## node 中使用

## jwt.sign(payload, secretOrPrivateKey, [options, callback])

- Returns: JsonWebToken 字符串
- payload：应该是表示有效 JSON 的对象文字，缓冲区或字符串。
- secretOrPrivateKey : 是一个字符串，缓冲区或对象，包含 HMAC 算法的秘密或 RSA 和 ECDSA 的 PEM 编码私钥。如果是带密码的私钥，则可以使用对象{key，passphrase}（基于加密文档），在这种情况下，请确保传递算法选项。

```
var jwt = require('jsonwebtoken');

var token = jwt.sign({ foo: 'bar' }, 'private-key',{ expiresIn: 1 *600000 });

```

## jwt.verify(token, secretOrPrivateKey, [options, callback])

- token: JsonWebToken string
- secretOrPrivateKey : 是一个字符串，缓冲区或对象，包含 HMAC 算法的秘密或 RSA 和 ECDSA 的 PEM 编码私钥。如果是带密码的私钥，则可以使用对象{key，passphrase}（基于加密文档），在这种情况下，请确保传递算法选项。

```
jwt.verify(token, 'private-key', function(err, decoded) {
    console.log('err:',err);
    console.log('decoded:',decoded);
});
```
