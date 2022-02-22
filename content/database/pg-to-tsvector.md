---
title: "pg 分词"
tags: ['database']
date: '2021-07-09'
---

##  分词例子
to_tsvector()生成的分词带有位置信息，tsvector没有位置信息

```sql
select to_tsvector('陈 锴 A S F a a a 1 2 3 4');
select to_tsvector('simple', '陈 锴 一个 , A apple 12 F a a a 1 2 3 4');
select to_tsvector('english', '陈 锴 一个 , A apple 12 F a a a 1 2 3 4');

`'1':8 '12':3 '2':9 '3':10 '4':11 'a':1,5,6,7 'apple':2 'f':4`


select '陈 锴 一个 , A apple 12 F a a a 1 2 3 4' :: tsvector;

`',' '1' '12' '2' '3' '4' 'A' 'F' 'a' 'apple' '一个' '锴' '陈'`
```

<!-- 字符串每个字符分词`to_tsvector('simple', array_to_string(string_to_array(data_name, null), ''))` -->
<!-- to_tsvector('simple', array_to_string(string_to_array('杭州点数据上传', null), ' '))  @@  to_tsquery(array_to_string(string_to_array('杭州点数据上传', null), ' & ')) -->

<!-- 修复特殊字符转tsquery引起的错误 -->
<!-- to_tsquery(array_to_string(string_to_array(strip(to_tsvector('simple', array_to_string(string_to_array(search, null), ' ')))::text, ' '),'&')) -->