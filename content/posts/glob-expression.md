---
title: "glob表达式"
tags: ['tool', 'shell']
date: '2021-07-09'
---

glob表达式是匹配文件路径的表达式。

### glob表达式规则
+ * Matches 0 or more characters in a single path portion
+ ? Matches 1 character
+ [...] Matches a range of characters, similar to a RegExp range. If the first character of the range is ! or + ^ then it matches any character not in the range.
+ !(pattern|pattern|pattern) Matches anything that does not match any of the patterns provided.
+ ?(pattern|pattern|pattern) Matches zero or one occurrence of the patterns provided.
+ +(pattern|pattern|pattern) Matches one or more occurrences of the patterns provided.
+ *(a|b|c) Matches zero or more occurrences of the patterns provided
+ @(pattern|pat*|pat?erN) Matches exactly one of the patterns provided
+ ** If a "globstar" is alone in a path portion, then it matches zero or more directories and subdirectories + searching for matches. It does not crawl symlinked directories.

### glob表达式例子

+ * 能匹配 a.js , x.y , abc , abc/ ，但不能匹配 a/b.js
+ *.* 能匹配 a.js , style.css , a.b , x.y
+ */*/*.js 能匹配 a/b/c.js , x/y/z.js ，不能匹配 a/b.js , a/b/c/d.js
+ ** 能匹配 abc , a/b.js , a/b/c.js , x/y/z , x/y/z/a.b ，能用来匹配所有的目录和文件
+ **/*.js 能匹配 foo.js , a/foo.js , a/b/foo.js , a/b/c/foo.js
+ a/**/z 能匹配 a/z , a/b/z , a/b/c/z , a/d/g/h/j/k/z
+ a/**b/z 能匹配 a/b/z , a/sb/z ，但不能匹配 a/x/sb/z ，因为只有单 ** 单独出现才能匹配多级目录
+ ?.js 能匹配 a.js , b.js , c.js
+  a?? 能匹配 a.b , abc ，但不能匹配 ab/ ，因为它不会匹配路径分隔符
+ [xyz].js 只能匹配 x.js , y.js , z.js ，不会匹配 xy.js , xyz.js 等，整个中括号只代表一个字符
+ [^xyz].js 能匹配 a.js , b.js , c.js 等，不能匹配 x.js , y.js , z.js


### [minimatch](https://www.npmjs.com/package/minimatch)
This is the matching library used internally by npm.
It works by converting glob expressions into JavaScript RegExp objects.

```
var minimatch = require("minimatch")
 
minimatch("bar.foo", "*.foo") // true!
minimatch("bar.foo", "*.bar") // false!
minimatch("bar.foo", "*.+(bar|foo)", { debug: true }) // true, and noisy!
```


