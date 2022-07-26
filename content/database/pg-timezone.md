---
title: "pg中的数据库时区"
tags: ["Database"]
date: "2021-07-09"
---

## 原因

系统主机与数据库时间不一致；
数据库配置文件中 timezone 与镜像系统里面设置的时区不一致

## 解决办法

修改数据库/var/lib/postgresql/data/postgresql.conf 中的 timezone 或者镜像时区保持一致后重启数据库

timestamp with time zone，内部存储的值始终为 UTC（通用协调时间，传统上称为格林威治标准时间）。具有指定显式时区的输入值将使用该时区的适当偏移量转换为 UTC。如果输入字符串中未指定时区，则假定它位于系统的 timezone 参数指示的时区中，并使用区域的偏移量转换为 UTC 。当一个 timestamp with time zone 值被输出，它总是从 UTC 转换成当前 timezone 区域，并作为在该区域中的本地时间显示。

## 步骤

查看数据库时区

```
show time zone;
```

查看系统时间与时区

```sql
date
Thu Nov 19 09:39:58 CST 2015
date -R
Thu, 19 Nov 2015 09:40:33 +0800
```

视图 pg_timezone_names 保存了所有可供选择的时区

```sql
select * from pg_timezone_names;
```

查看配置文件中时区设置，要想永久生效，此时需要修改配置文件

```
[grep timezone postgresql.conf
log_timezone = 'US/Pacific'
timezone = 'US/Pacific'
```

修改完配置时重新加载

```
[postgres@rudy_01 ~]$ pg_ctl reload
server signaled
[postgres@rudy_01 ~]$ psql
postgres=# show time zone;
TimeZone
```
