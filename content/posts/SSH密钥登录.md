---
title: "SSH密钥登录"
tags: ['shell']
date: "2025/07/30"
---

使用 SSH 通过用户名和密码登录时，每次都需手动输入密码，而密码通常是随机生成的复杂字符，不便记忆和输入。
为提高安全性与使用效率，SSH 支持密钥登录方式。它通过一对密钥（公钥和私钥）代替密码进行身份验证，既更安全，也更适合自动化操作。


## 生成密钥对

一对密钥包括：公钥（public key） 和 私钥（private key）。

```shell
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

会在 `~/.ssh/` 目录下生成：
私钥：`id_rsa`（不要泄露）
公钥：`id_rsa.pub`（可以公开分享）

> `ssh-keygen` 在生成密钥对的时候可以选择添加一个密码，这个密码是用来保护你的私钥文件的, 即使别人偷到了你的私钥文件（例如`~/.ssh/id_rsa`），也无法使用它，除非同时知道你的密钥密码,是一种提升 SSH 密钥安全性的方式。

## 将公钥放到远程服务器上

远程服务器上会有一个文件 ~/.ssh/authorized_keys，你需要把你的公钥内容加进去，过程中需要你输入服务器用户密码

```shell
ssh-copy-id user@remote_host
```
你也可以手动将 `~/.ssh/id_rsa.pub` 内容添加到远程主机的 `~/.ssh/authorized_keys` 中。  

## 使用私钥连接服务器

SSH 登录时，客户端会用私钥进行加密，服务器用公钥验证, SSH 默认会按照顺序尝试使用以下几个私钥文件

```shell
~/.ssh/id_rsa
~/.ssh/id_dsa
~/.ssh/id_ecdsa
~/.ssh/id_ed25519
~/.ssh/identity
```

可以使用`- i` 指定私钥文件， 如 `ssh -i /path/to/your/private_key user@hostname`

如果匹配成功，只需要输入私钥密码（如何私钥设置了密码）
