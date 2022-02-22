---
title: "流读取json"
tags: ['node']
date: '2021-07-09'
---

流读取json需要用到两个库`JSONStream`和`es`

## JSONStream

流JSON.parse

```
JSONStream.parse("JSONPath表达式")

```
> JSONPath表达式
JSONPath表达式始终引用JSON结构，其方式与XPath表达式与XML文档结合使用的方式相同。由于JSON结构通常是匿名的，并且不一定具有“根成员对象”，因此JSONPath假定$分配给外部对象的抽象名称
例子：
```
$.store.book[0].title
$['store']['book'][0]['title']
```
XPath和JSONPath语法

| XPath | JSONPath         | Description                                                  |
| ----- | ---------------- | :----------------------------------------------------------- |
| /     | $                | the root object/element                                      |
| .     | @                | the current   object/element                                 |
| /     | . or []          | child operator                                               |
| ..    | n/a              | parent operator                                              |
| //    | ..               | recursive descent.   JSONPath borrows this syntax from E4X.  |
| *     | *                | wildcard. All   objects/elements regardless their names.     |
| @     | n/a              | attribute access. JSON   structures don't have attributes.   |
| []    | []               | subscript operator. XPath uses it to iterate over element collections and for predicates. In Javascript and JSON it is the native array operator.|
| \|    | [,]              | Union operator in XPath   results in a combination of node sets. JSONPath allows alternate names or   array indices as a set. |
| n/a   | [start:end:step] | array slice operator   borrowed from ES4.                    |
| []    | ?()              | applies a filter (script)   expression.                      |
| n/a   | ()               | script expression, using   the underlying script engine.     |
| ()    | n/a              | grouping in Xpath                                            |







```

const fs = require('fs');
var es = require('event-stream')
const JSONStream = require('JSONStream');

let i = 0

const readStream = fs.createReadStream(`data/test.json`, {});
const writeStream = fs.createWriteStream('./result.text', {});

//去掉分割符号
// readStream.pipe(es.split(',')).pipe(writeStream);

//替换
// readStream.pipe(es.replace('{','【')).pipe(writeStream);

// 打印每行内容
// readStream.pipe(es.split()).pipe(es.mapSync((data) => {
//     console.log(data)
// }));

// 过滤
// readStream.pipe(es.split()).pipe(es.filterSync((data) => {
//     console.log(data)
//     return data > -3;
// })).pipe(writeStream);

// 配合jsonstream
// readStream.pipe(JSONStream.parse('name.*.name')).pipe(es.mapSync((data) => {
//     console.log(data)
// })).pipe(writeStream);


// let stream = JSONStream.parse('name.*.name..');
let stream = JSONStream.parse(["name", true, "name", true]);
readStream.pipe(stream).pipe(es.mapSync((data) => {
    // console.log(data)
})).pipe(writeStream);

stream.on('data', function (data) {
    console.log(data);
});
```
