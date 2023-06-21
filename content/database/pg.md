---
title: "PostgreSQL"
tags: ["Database"]
date: "2023-06-21"
---

## [排序](https://www.postgresql.org/docs/current/queries-order.html)

`order by`用于对表进行排序

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

SELECT a, b FROM table1 ORDER BY CASE WHEN a >= 0 and b THEN a ELSE -1 END, c;

```

### 中文字段的排序

PostgreSQL 中的 ORDER BY 默认使用的是基于当前数据库的默认排序规则进行排序。在不同的字符集中，汉字的编码可能不一样，比如 UTF8 和 GBK，其中 GBK 大致是按拼音的顺序进行编码的，而 UTF8 则不是。所以如果你的数据库使用了 UTF8 编码，对中文字段进行排序时，得到的并不是按拼音排序的结果。
PostgreSQL 中，中文按拼音排序的编码包括 GB18030, EUC_CN, GBK, BIG5 等。
为了得到拼音排序，

+ 可以使用编码转换后的值来排序，如`convert_to(name,'GBK')`。
+ 在 ORDER BY 子句中指定 COLLATE 子句来指定相应的排序规则。如使用类似语句：

```sql
-- 在这里，"zh_CN.utf8_pinyin" 是一个指定拼音排序规则的语言环境名称。您可以根据需要选择不同的排序规则。
SELECT * FROM table_name ORDER BY column_name COLLATE "zh_CN.utf8_pinyin";
```

## [唯一索引](https://www.postgresql.org/docs/current/indexes-unique.html)

唯一索引索引还可用于强制列值的唯一性，或多个列的组合值的唯一性。

```sql
CREATE UNIQUE INDEX name ON table (column [, ...]) [ NULLS [ NOT ] DISTINCT ];
```

目前，只有 B 树索引可以声明为唯一索引。

当索引被声明为唯一时，不允许多个表行具有相同的索引值。默认情况下，唯一列中的空值不被视为相等，允许列中有多个空值。该NULLS NOT DISTINCT选项修改它并使索引将空值视为相等。多列唯一索引只会拒绝所有索引列在多行中都相等的情况。

当一个索引被声明为唯一时，不允许有多个具有相等索引值的表行。默认情况下，唯一列中的空值被视为不相等，允许在该列中存在多个空值。使用`NULLS NOT DISTINCT`选项可以修改此行为，并使索引将空值视为相等。多列唯一索引只会拒绝在多行中所有索引列都相等的情况。


>当为表定义唯一约束或主键时，PostgreSQL自动创建唯一索引, 无需在唯一列上手动创建索引；这样做只会复制自动创建的索引。

