---
title: "pg中如何查询Geometry类型字段的坐标系"
tags: ['database']
date: '2021-07-09'
---

## 查询坐标系的方式

如没有显示指定 geometry(${geometryType},3857)

```sql
-- 查询到的坐标系是正确
select ST_SRID(the_geom_webmercator) from data.t_caa6d99c6eb14495b2238b4c0d56f051

-- 查询到的坐标系是0
select Find_SRID('data','t_bcccd400c5bc8025aa0eed5fd5816de5','the_geom_webmercator');
select * from geometry_columns where f_table_name = 't_bcccd400c5bc8025aa0eed5fd5816de5e'
```
