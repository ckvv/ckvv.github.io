---
title: "ubuntu添加pgrouting扩展"
tags: ['database', 'pgrouting']
date: '2021-07-09'
---

```
sudo apt-add-repository -y ppa:ubuntugis/ppa
sudo apt-add-repository -y ppa:georepublic/pgrouting
sudo apt-get update
```

ubuntu apt 官方存储库没有pgrouting。所以需要添加存储库
在Ubuntu或Debian上安装软件的众多方法之一是使用PPA（个人包存档），如果要添加新的PPA存储库，则必须以下列方式使用add-apt-repository命令

```
add-apt-repository ppa:some/ppa
```

在Debian中，基本操作系统和 有时 在Ubuntu上，您将看到缺少add-apt-repository命令的错误。

但是如果你尝试使用sudo apt-get install add-apt-repository，它将无法正常工作。
这是因为，你需要安装这个软件包才能安装add-apt-repository。修复`add-apt-repository-command-not-found`错误

```
apt-get update
apt-get install software-properties-common
```

一旦安装了software-properties-common，您现在可以轻松地使用add-apt-repository或apt-add-repository命令来添加PPA

查询pgrouting版本

```
apt search pgrouting
```

安装对应版本的pgrouting

```
apt-get install postgresql-10-pgrouting
```

数据库中添加pgrouting扩展

```
CREATE EXTENSION pgrouting;
```
