---
title: "defineProperty"
tags: ['js']
date: '2021-07-09'
---
Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

```
Object.defineProperty(obj, prop, descriptor)
```
obj:要在其上定义属性的对象。
prop:要定义或修改的属性的名称。
descriptor:将被定义或修改的属性描述符。
描述符可以有以下属性：
+ configurable：当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false
+ enumerable： 当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中，default：false
+ value： 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined
+ writable： 当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。
+ get： 一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象（由于继承关系，这里的this并不一定是定义该属性的对象
+ set： 一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。

@return:传递给函数的对象。

## example
```js
// 数组拦截
/**
 * 
 * @param {array} data 
 */
function observe(data) {
    if (!Array.isArray(data)) {
        return;
    }
    // 取出所有数组遍历
    data.forEach(function(val,index) {
        Object.defineProperty(data, index, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function() {
                return val;
            },
            set: function(newVal) {
                console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
                val = newVal;
            }
        });
	});
};


// 对象拦截
/**
 * 
 * @param {object} data 
 */
function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    // 取出所有属性遍历
    Object.keys(data).forEach(function(key) {
        let val = data[key]
        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function() {
                return val;
            },
            set: function(newVal) {
                console.log('哈哈哈，监听到值变化了 ', val, ' --> ', newVal);
                val = newVal;
            }
        });
	});
};

// Proxy监视对象包括数组变化
//必须针对`Proxy实例`（上例是proxy对象）进行操作才能触发
function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    return new Proxy(data, {
        set(target, key, value, receiver) {
            console.log('哈哈哈，监听到值变化了 ', receiver[key], ' --> ', value);
            return Reflect.set(target, key, value, receiver);
        },
        get(target, name, value, receiver) {
            return Reflect.get(target, name, value, receiver);
        }
    })
}

```