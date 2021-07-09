---
title: "pgpool"
tags: ['database']
categories: ['database']
---
## 什么是pgpool
[pgpool-II](https://www.pgpool.net/docs/latest/en/html/example-configs.html) 是一个位于 PostgreSQL 服务器和 PostgreSQL 数据库客户端之间的中间件，它提供以下功能：
+ 连接池
pgpool-II 保持已经连接到 PostgreSQL 服务器的连接，并在使用相同参数（例如：用户名，数据库，协议版本）连接进来时重用它们。它减少了连接开销，并增加了系统的总体吞吐量。
+ 复制
pgpool-II 可以管理多个 PostgreSQL 服务器。激活复制功能并使在2台或者更多 PostgreSQL 节点中建立一个实时备份成为可能，这样，如果其中一台节点失效，服务可以不被中断继续运行。
+ 负载均衡
如果数据库进行了复制，则在任何一台服务器中执行一个 SELECT 查询将返回相同的结果。pgpool-II 利用了复制的功能以降低每台 PostgreSQL 服务器的负载。它通过分发 SELECT 查询到所有可用的服务器中，增强了系统的整体吞吐量。在理想的情况下，读性能应该和 PostgreSQL 服务器的数量成正比。负载均衡功能在有大量用户同时执行很多只读查询的场景中工作的效果最好。
+ 并行查询
使用并行查询时，数据可以被分割到多台服务器上，所以一个查询可以在多台服务器上同时执行，以减少总体执行时间。并行查询在查询大规模数据的时候非常有效。
现有的数据库应用程序基本上可以不需要修改就可以使用 pgpool-II

## start

```shell
## 安装pgpool-ii
brew install pgpool-ii
## 安装扩展
create extension pgpool_recovery;

## If you are using PostgreSQL 9.4 or later, you can skip this section.
create extension pgpool_regclass;

## 修改配置文件

```

## 常用命令
```
<!-- 查看节点 -->
show pool_nodes;
```
## 问题
## could not open pid file as /var/run/pgpool/pgpool.pid
```
mkdir /var/run/pgpool/
sudo chmod -R 777 你的文件夹名
```

pgpool.conf 节点连接方式写错了，重启后show pool_nodes；发现状态依然是down，需要启动pg_pool时加入 -D 移除以前的数据库状态

```
sudo pgpool 
```

