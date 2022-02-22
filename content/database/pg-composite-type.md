---
title: "postgre中的复合类型"
tags: ['database']
date: '2021-07-09'
---

## 声明复合类型
Composite Types:复合类型`Composite Types`表示行或记录的结构; 它本质上只是一个字段名称及其数据类型。 PostgreSQL允许复合类型像用简单类型相同的方式使用。 例如，表的列可以声明为复合类型。
语法与CREATE TABLE相当，只是可以指定字段名称和类型; 目前不能包含任何约束（例如NOT NULL）。 请注意，AS关键字是必不可少的; 没有它，系统会认为有一种不同的CREATE TYPE命令，你会得到奇怪的语法错误。
以下是定义复合类型的两个简单示例：

```sql
CREATE TYPE complex AS (
    r       double precision,
    i       double precision
);

CREATE TYPE inventory_item AS (
    name            text,
    supplier_id     integer,
    price           numeric
);
```

定义了类型后，我们可以使用它们：

```sql
CREATE TABLE on_hand (
    item      inventory_item,
    count     integer
);

INSERT INTO on_hand VALUES (ROW('fuzzy dice', 42, 1.99), 1000);


CREATE FUNCTION price_extension(inventory_item, integer) RETURNS numeric
AS 'SELECT $1.price * $2' LANGUAGE SQL;

SELECT price_extension(item, 10) FROM on_hand;
```

每当您创建表时，也会自动创建一个复合类型，其名称与表的名称相同，以表示表的行类型。

```sql
CREATE TABLE inventory_item (
    name            text,
    supplier_id     integer REFERENCES suppliers,
    price           numeric CHECK (price > 0)
);
```

## 给复合类型赋值
要将复合值写为文字常量，将字段值括在括号内并用逗号分隔。 如果它包含逗号或括号，需要在任何字段值周围加上双引号。要使字段为NULL，请在列表中的位置不写任何字符,如果您想要一个空字符串而不是NULL，请写双引号.

```sql
'( val1 , val2 , ... )'
'("fuzzy dice",42,1.99)'
'("fuzzy dice",42,)'
'("",42,)'
```

ROW表达式语法也可用于构造复合值,只要表达式中有多个字段，ROW关键字实际上是可选的，因此可以简化为：

```sql
ROW('fuzzy dice', 42, 1.99)
ROW('', 42, NULL)

('fuzzy dice', 42, 1.99)
('', 42, NULL)
```

<!-- tudo -->
