---
title: "postgres有用的sql"
tags: ["Database"]
date: "2021-07-09"
---

## 数据库迁移备份

备份：`pg_dump -U postgres -d myDBname -f dump.sql`
还原：

pg_dump -U postgres -d g-default -f g-default.sql

忽略某些 schema
psql -N data -N public_data -d g-default -U postgres -f g-default.sql

将 mydb 数据库转储到一个 SQL 脚本文件：`pg_dump mydb > db.sql`
将上述脚本导入一个(新建的)数据库 newdb：`psql -d newdb -f db.sql`

将数据库转储为自定义格式的归档文件`pg_dump -Fc mydb > db.dump`
将数据库转储为目录格式归档：`pg_dump -Fd mydb -f dumpdir`
将数据库转储为目录格式归档，并行 5 个 worker 工作：`pg_dump -Fd mydb -j 5 -f dumpdir`
将归档文件导入一个(新建的)数据库 newdb：`pg_restore -d newdb db.dump`

转储一个名为 mytab 的表：`pg_dump -t mytab mydb > db.sql`
转储 detroit 模式中所有以 emp 开头的表， 但是不包括 employee*log 表：`pg_dump -t 'detroit.emp*' -T detroit.employee_log mydb > db.sql`
转储所有以 east 或 west 开头并以 gsm 结尾的模式， 但是不包括名字中含有 test 模式：`pg_dump -n 'east*gsm' -n 'west*gsm' -N '*test*' mydb > db.sql`
同上，不过这一次使用正则表达式的方法：`pg_dump -n '(east|west)*gsm' -N '*test*' mydb > db.sql`
转储所有数据库对象，但是不包括名字以 ts*开头的表：`pg_dump -T 'ts_*' mydb > db.sql`

在-t 等选项中指定大写字母或大小写混合的名字必须用双引号界定， 否则将被自动转换为小写(参见匹配模式)。 但是因为双引号在 shell 中有特殊含义，所以必须将双引号再放进单引号中。 这样一来，要转储一个大小写混合的表名，你就需要像下面这样：`pg_dump -t "\"MixedCaseName\"" mydb > mytab.sql`

## 系统

- 拷贝 csv 到数据库

```sql
copy testtable1 from '/1542783012050.CSV'  with delimiter ',' csv header;
```

- 查看是否存在索引

```sql
select * from pg_indexes where tablename='log';

select * from pg_statio_all_indexes where relname='log';
```

- 检测 postgre 是否存在某张表
<!-- SELECT EXISTS ( SELECT 1 FROM pg_tables WHERE  schemaname = 'public' AND tablename = 'geohey_version')  -->

```sql
SELECT to_regclass('core.job');

CREATE OR REPLACE FUNCTION public.__judge_function_exist( funname text )
RETURNS text
AS $$
DECLARE
 function_result text;
BEGIN
    select proname into function_result
    from pg_proc
    where proname = funname limit 1 ;

    return function_result;
END;
$$ LANGUAGE plpgsql;
```

## 功能

- 查看不同值

```sql
select distinct st_geometrytype(the_geom_webmercator) from data.t_640fd1e07b9611e9948a898c1d7e1ea0
```

- 删除某 schema 下所有表

```sql
DROP FUNCTION public.__my_del_schema_table(text);

 CREATE OR REPLACE FUNCTION public.__my_del_schema_table(
  schemaname1 text)
    RETURNS record
    LANGUAGE 'plpgsql'

     COST 100
     VOLATILE
 AS $BODY$
 DECLARE
  tabname record;
BEGIN
   FOR tabname IN (SELECT tablename FROM pg_tables WHERE schemaname = schemaname1)
 LOOP
  EXECUTE 'DROP TABLE IF EXISTS ' || schemaname1 || '.' || quote_ident(tabname.tablename) || ' CASCADE';
  END LOOP;
 return tabname;
END;
 $BODY$;

```

- 批量更改数据库坐标系

```sql
CREATE OR REPLACE FUNCTION __batch_srid()
returns text
AS $$
DECLARE
    alter_content text;
 v_msg     TEXT;
BEGIN

    for alter_content in SELECT 'alter table ' || f_table_schema || '.' || f_table_name || ' alter column the_geom_webmercator type geometry(' || type || ',3857) using st_setsrid(the_geom_webmercator,3857);' FROM geometry_columns where f_geometry_column='the_geom_webmercator' and srid>900000
    LOOP
        raise info 'alter_content:%',alter_content;
        EXECUTE alter_content;
    END LOOP;

    RETURN null;
--以下是对异常的处理
EXCEPTION
 WHEN others THEN GET STACKED DIAGNOSTICS
            v_msg     = MESSAGE_TEXT;
            RAISE INFO 'EXCEPTION:%', v_msg;
       return null;
END;
$$ LANGUAGE plpgsql;
```

## 创建只读的用户

1. 首先，授予连接访问权限：

```sql
GRANT CONNECT ON DATABASE table_name TO username;
```

2. 然后授予模式使用

```sql
GRANT USAGE ON SCHEMA public TO username;
对于特定的表格
GRANT SELECT ON table_name TO username;
对于多个表
GRANT SELECT ON ALL TABLES IN SCHEMA public TO username;
```

3. 如果您希望将来自动授予对新表的访问权限，则必须更改默认值：

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO username;
```

## 时间

显示当前数据库时区

```sql
show timezone
```
