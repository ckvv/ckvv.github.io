---
title: "order_by的语法"
tags: ["Database"]
date: "2023-01-03"
---

`order by`用于对表进行排序。 详情参见 https://www.postgresql.org/docs/current/queries-order.html

```sql
SELECT select_list
    FROM table_expression
    ORDER BY sort_expression1 [ASC | DESC] [NULLS { FIRST | LAST }]
             [, sort_expression2 [ASC | DESC] [NULLS { FIRST | LAST }] ...]
```

当指定了多个表达式时，后面的值用于根据前面的值对**相等的行**进行排序。
+ 每个表达式后面都可以跟一个可选的`ASC`或`DESC`关键字，以将排序方向设置为升序或降序。
+ 可选参数`NULLS FIRST`可`NULLS LAST`用于确定空值是出现在排序顺序中的非空值之前还是之后。默认(NULLS FIRST)

其中`sort_expression`可以是任何有效的表达式如

```sql
SELECT a, b FROM table1 ORDER BY a + b, c;
```

```sql
SELECT a, b FROM table1 ORDER BY CASE WHEN a >= 0 and b THEN a ELSE -1 END, c;
```



