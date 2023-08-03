---
title: "GitHub"
tags: ['GitHub', 'Git']
date: '2023-08-23'
---

GitHub基于账号用户名和密码的身份验证已被删除，常用的clone 方法有以下两种

# 通过访问令牌

首先在<https://github.com/settings/tokens>生成访问令牌，然后当Git提示您输入密码时，输入该令牌即可。
>访问令牌较长，且仅展示一次, 需另存起来使用

# 通过SSH URL

SSH URL提供通过SSH（一种安全协议）对Git存储库的访问。您必须在计算机上生成SSH密钥对，并将公钥添加到您在 [GitHub.com](https://github.com/settings/ssh/new) 上的帐户。

## 生成SSH密钥对
执行 `ssh-keygen`生成两个文件
私钥: `/root/.ssh/id_rsa` 
公钥:`/root/.ssh/id_rsa.pub`

## 配置RSA 公钥
https://github.com/settings/ssh/new

## 使SSH 克隆代码

```shell
git clone git@github.com:*/*.git
```


# 参考文献
+ <https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls>