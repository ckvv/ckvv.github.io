---
title: "pg的数据库配置"
tags: ['database']
date: '2021-07-09'
---

config一般文件在数据data目录下面如:`/usr/local/var/postgres`，如果你忘记了目录地址可以`SHOW data_directory;`查询出来,或者

```sql
select setting from pg_settings where name = 'config_file'; 

-- 查询配置
table pg_hba_file_rules
-- 使配置生效
SELECT pg_reload_conf();
```

[pg_hba.conf文件介绍](http://www.postgres.cn/docs/9.4/auth-pg-hba-conf.html)

## pg_hba.conf文件

客户端认证是由一个配置文件(通常名为pg_hba.conf)控制的， 它存放在数据库集群的数据目录里。HBA的意思是"host-based authentication"， 也就是基于主机的认证。在initdb初始化数据目录的时候， 它会安装一个缺省的pg_hba.conf文件。不过我们也可以把认证配置文件放在其它地方； 参阅hba_file配置参数。
g_hba.conf文件的常用格式是一组记录，每行一条。空白行将被忽略， 井号#开头的注释也被忽略。记录不能跨行存在。 一条记录是由若干用空格和/或制表符分隔的字段组成。如果字段用引号包围，那么它可以包含空白。 在数据库、用户或地址文件中引用一个关键词（如，all 或 replication） 使这个词失去它的特殊含义，只是用这个名字匹配一个数据库、用户或主机。

每条记录声明一种连接类型、一个客户端 IP 地址范围(如果和连接类型相关的话)、 一个数据库名、一个用户名字、对匹配这些参数的连接使用的认证方法。第一条匹配连接类型、 客户端地址、连接请求的数据库名和用户名的记录将用于执行认证。这个处理过程没有 "跨越"或者"回头"的说法：如果选择了一条记录而且认证失败， 那么将不再考虑后面的记录。如果没有匹配的记录，那么访问将被拒绝。

每条记录可以是下面七种格式之一

```
local      database  user  auth-method  [auth-options]
host       database  user  address  auth-method  [auth-options]
hostssl    database  user  address  auth-method  [auth-options]
hostnossl  database  user  address  auth-method  [auth-options]
host       database  user  IP-address  IP-mask  auth-method  [auth-options]
hostssl    database  user  IP-address  IP-mask  auth-method  [auth-options]
hostnossl  database  user  IP-address  IP-mask  auth-method  [auth-options]
``

## demo 
```

## 允许在本机上的任何用户使用 Unix 域套接字(本地连接的缺省)

## 以任何数据库用户身份连接任何数据库

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

local   all             all                                     trust

## 和上面相同，但是使用的是回环的(loopback)TCP/IP 连接

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

host    all             all             127.0.0.1/32            trust

## 和上面一行相同，但是用的是独立的子网掩码字段

#

## TYPE  DATABASE        USER            IP-ADDRESS      IP-MASK             METHOD

host    all             all             127.0.0.1       255.255.255.255     trust

## 在IPv6上相同

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

host    all             all             ::1/128                 trust

## 和上面相同，但是使用一个主机名（通常包括IPv4 和 IPv6）

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

host    all             all             localhost               trust

## 允许 IP 地址为 192.168.93.x 的任何主机与 "postgres" 数据库相连

## 用与他们在自己的主机上相同 ident 的用户名标识他自己(通常是他的操作系统用户名)

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

host    postgres        all             192.168.93.0/24         ident

## 允许来自主机 192.168.12.10 的用户提供了正确的口令之后与 "postgres" 数据库连接

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

host    postgres        all             192.168.12.10/32        md5

## 允许来自在example.com域里的主机的用户在提供了正确的口令之后与任意数据库连接

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

host    all             all             .example.com            md5

## 如果前面没有其它 "host" 行，那么下面两行将拒绝所有来自 192.168.54.1 的连接请求(因为前面的记录先匹配)

## 但是允许来自互联网上其它任何地方的有效的 GSSAPI 认证的连接

## 零掩码引起不考虑主机 IP 的任何位。因此它匹配任何主机

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

host    all             all             192.168.54.1/32         reject
host    all             all             0.0.0.0/0               gss

## 允许来自 192.168.x.x 的任何用户与任意数据库连接，只要他们通过 ident 检查

## 但如果 ident 说该用户是 "bryanh" 且他要求以 PostgreSQL 用户 "guest1" 连接

## 那么只有在 pg_ident.conf 里有 "omicron" 的映射说 "bryanh" 允许以 "guest1" 进行连接时才真正可以进行连接

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

host    all             all             192.168.0.0/16          ident map=omicron

## 如果下面是用于本地连接的仅有的三行，那么它们将允许本地用户只和同名数据库连接

## 只有管理员和 "support" 角色里的成员例外，他们可以连接到任何数据库

## $PGDATA/admins 文件列出了那些允许与所有数据库连接的用户名

## 在所有情况下都需要口令

#

## TYPE  DATABASE        USER            ADDRESS                 METHOD

local   sameuser        all                                     md5
local   all             @admins                                 md5
local   all             +support                                md5

## 上面最后两行可以合起来写成一行

local   all             @admins,+support                        md5

## 数据库字段也可以使用列表和文件名

local   db1,db2,@demodbs  all                                   md5

```
> 一个用户要想成功连接到特定的数据库，不仅需要通过pg_hba.conf的检查， 还必须要有该数据库上的CONNECT权限。如果希望限制哪些用户能够连接到哪些数据库， 赋予/撤销CONNECT权限通常比在pg_hba.conf中设置规则简单。
