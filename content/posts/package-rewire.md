---
title: "rewire库"
tags: ['文章']
date: '2021-07-09'
---

如果模块未导出一些函数，则模块外部的测试代码无法调用该功能。那是由于JavaScript的工作方式，有时我们希望测试局部函数。
[rewire库](https://www.npmjs.com/package/rewire)在模块中添加了一个特殊的setter和getter，因此您可以修改它们的行为以进行更好的单元测试
rewire库功能：

+ 为其他模块或全局变量（如进程）注入模拟
+ 测试私有变量
+ 覆盖模块中的变量

## rewire接口

`rewire(filename: String): rewiredModule`
Returns a rewired version of the module found at filename. Use rewire() exactly like require().

`rewiredModule.__set__(name: String, value: *): Function`
Sets the internal variable name to the given value. Returns a function which can be called to revert the change.

`rewiredModule.__set__(obj: Object): Function`
Takes all enumerable keys of obj as variable names and sets the values respectively. Returns a function which can be called to revert the change.

`rewiredModule.__get__(name: String): *`
Returns the private variable with the given name.

`rewiredModule.__with__(obj: Object): Function<callback: Function>`
Returns a function which - when being called - sets obj, executes the given callback and reverts obj. If callback returns a promise, obj is only reverted after the promise has been resolved or rejected. For your convenience the returned function passes the received promise through.

## 与mocha配合测试私有函数

假如我们有`uitils.js`模块

```js
let name = '小红';

function add(num1, num2) {
    return num1 + num2;
}

function say(info) {
    return `小红 说:${info}`;
}

module.exports = {
    say
}
```

测试模块

```javascript
var assert = require('assert');
const rewire = require('rewire');
let uitils = rewire('./uitils.js');

describe('app', function () {
    it('测试正常导出的模块', () => {
        let {say} = uitils;
        assert.equal(say('你好'),'小红 说:你好')
    });

    it('测试私有函数', () => {
        let add = uitils.__get__('add');
        assert.equal(add(1,2),3)
    });

    it('测试复写变量', () => {
        let {say} = uitils;
        let revert = uitils.__set__('name', '小明');
        
        let name = uitils.__get__('name');
        assert.equal(name, '小明');

        revert();
        assert.equal(uitils.__get__('name'), '小红');

    });  
});
```
