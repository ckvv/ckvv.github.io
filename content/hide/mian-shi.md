---
title: "面试题"
draft: true
date: '2021-07-09'
---

反思自己存在以下问题

+ 相关方法还是掌握的不够熟练，不借助编辑器提示难以下手
+ 遇到相关算法题脑子有些混乱，冷静下来想想还是能写出来
+ 一些至少概念了解但并不十分清楚
+ 缺乏面试经验，脑子有些转不过来
+ 平常没有做相关面试题，面试题还是要刷的

还记起来的面试题大概有以下题目:

## array reduse 实现map方法

做不出来的原因，
对this还是不够熟悉

不用reduse实现：

```javascript
Array.prototype.map = function (fun) {
    let mapArr = [];
    for (let val of this) {
        mapArr.push(fun.call(null, val));
    }
    return mapArr;
}

[1, 2, 3].map((val) => val);
```

使用reduse实现：

```javascript
Array.prototype.map = function (fun) {
    let mapArr = [];
    this.reduce((accumulator, currentValue, index) => {
        mapArr.push(fun.call(null, this[index]));
    },null);
    return mapArr;
}
```

## koa中间件传参数，允许输入参数限制请求

```javascript
function name(methods) {
    return async function(ctx, next){
        let startDate = new Date();

        if (methods.indexOf(ctx.request.method) !== -1) {
            await next();
        }
        console.log(`time:${new Date() - startDate}`);    
    }
}
```

## webpack中loader和plugin区别

### loader

用于对模块的源代码进行转换。loader 可以使你在 import 或"加载"模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！

### plugin

对于plugin，它就是一个扩展器，它丰富了wepack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，例如

run：开始编译
make：从entry开始递归分析依赖并对依赖进行build
build-moodule：使用loader加载文件并build模块
normal-module-loader：对loader加载的文件用acorn编译，生成抽象语法树AST
program：开始对AST进行遍历，当遇到require时触发call require事件
seal：所有依赖build完成，开始对chunk进行优化（抽取公共模块、加hash等）
optimize-chunk-assets：压缩代码
emit：把各个chunk输出到结果文件

## 给定有序数组array和数字n，找出n在array中起始位置的下标和终止位置的下标

使用indexOf和lastIndexOf

```javaScript
function search(arr,number){
    let startIndex = arr.indexOf(number);
    let lastIndex = arr.lastIndexOf(number);
    return [startIndex,lastIndex]
}
```

不使用indexOf和lastIndexOf

```javascript
function search(arr, number) {
    function indexOf(arr, number) {
        let staIndex = 0;
        let endIndex = arr.length;
        let midelIndex = staIndex + Math.floor((endIndex - staIndex)/2);
        do {
            if (staIndex+1 >= endIndex) {
                if (arr[endIndex] === number) {
                    return endIndex;
                }
                if (arr[staIndex] === number) {
                    return staIndex;
                }
                return -1;
            }
            if ( arr[midelIndex] < number) {
                staIndex = midelIndex;
                midelIndex = staIndex + Math.floor((endIndex - staIndex)/2);
            } else {
                endIndex = midelIndex;
                midelIndex = staIndex + Math.floor((endIndex - staIndex)/2);
            }
        } while (true);
    }
    
    function lastIndexOf(arr, number) {
        let staIndex = 0;
        let endIndex = arr.length;
        let midelIndex = staIndex + Math.round((endIndex - staIndex)/2);
        do {
            if (staIndex+1 >= endIndex) {
                if (arr[staIndex] === number) {
                    return staIndex;
                }
                if (arr[endIndex] === number) {
                    return endIndex;
                }
    
                return -1;
            }
            if ( arr[midelIndex] <= number) {
                staIndex = midelIndex;
                endIndex = endIndex;
                midelIndex = staIndex + Math.round((endIndex - staIndex)/2);
            } else {
                endIndex = midelIndex;
                midelIndex = staIndex + Math.round((endIndex - staIndex)/2);
            }
        } while (true);
    }

    let startIndex = indexOf(arr,number);
    let lastIndex = lastIndexOf(arr,number);
    return [startIndex,lastIndex]
}

let arr = [1, 2, 3, 4,4, 4, 5, 6, 7]
console.log(search(arr,3))
```

## 实现一个查找素数的方法

### 使用生成器函数

```javascript
function* getShu() {
    let num = 1;
    function isShu(num) {
        let isShu = true; 
        for (let i = 2; i <= num / 2; i++){
            if (num % i === 0) {
                isShu = false;
                break;
            }
        }
        return isShu;
    }

    do {
        if (isShu(num)) {
            yield num;
        }
        num++;
    } while (true);
}
```

### 自定义的迭代器对象

```javascript
// ES6写法
class genPrime{
    constructor() {
        this.num = 0;
    }
    isShu(num) {
        let isShu = true; 
        for (let i = 2; i <= num / 2; i++){
            if (num % i === 0) {
                isShu = false;
                break;
            }
        }
        return isShu;
    }
    next(){
        do {
            this.num++;
            if (this.isShu(this.num)) {
                return {
                    value: this.num,
                    done: false
                };
            }
        } while (true);
    }
    [Symbol.iterator]() {
        return this;
    }
}

let genPrime = {
    num: 0,
    isShu(num) {
        let isShu = true; 
        for (let i = 2; i <= num / 2; i++){
            if (num % i === 0) {
                isShu = false;
                break;
            }
        }
        return isShu;
    },
    next(){
        do {
            this.num++;
            if (this.isShu(this.num)) {
                return {
                    value: this.num,
                    done: false
                };
            }
        } while (true);
    },
    [Symbol.iterator]() {
        return this;
    }
}
```

### 使用闭包

```javascript
function getShu() {
    let num = 0;
    function isShu(num) {
        let isShu = true; 
        for (let i = 2; i <= num / 2; i++){
            if (num % i === 0) {
                isShu = false;
                break;
            }
        }
        return isShu;
    }

    return function(){
        do {
            num++;

            if (isShu(num)) {
                return num;
            }
        } while (true);
    }
}
```

## flex布局有哪些属性

Webkit内核的浏览器，必须加上-webkit前缀
以下6个属性设置在容器上

+ `flex-direction`属性决定主轴的方向,即项目的水平或垂直的排列方向`row | row-reverse | column | column-reverse`,默认`row`
+ `flex-wrap`属性决定主轴如何换行`nowrap | wrap | wrap-reverse`,默认`nowrap`
+ `flex-flow`属性是flex-direction属性和flex-wrap属性的简写形式`<flex-direction> || <flex-wrap>`，默认`row nowrap`
+ `justify-content`属性定义了项目在主轴上的对齐方式`flex-start | flex-end | center | space-between | space-around`，默认`flex-start`左对齐
+ `align-items`属性定义项目在交叉轴上如何对齐`lex-start | flex-end | center | baseline | stretch`，默认stretch，如果项目未设置高度或设为auto，将占满整个容器的高度
+ `align-content`属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用

以下6个属性设置在项目上

+ `order`属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。
+ `flex-grow`属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不大，如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）。
+ `flex-shrink`属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
+ `flex-basis`属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小
+ `flex`属性是`flex-grow`, `flex-shrink` 和`flex-basis`的简写，后两个属性可选,该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto),默认值为0 1 auto。
+ `align-self`属性允许单个项目有与其他项目不一样的对齐方式，`auto | flex-start | flex-end | center | baseline | stretch`可覆盖align-items属性,默认值为auto,表示继承父元素的align-items属性，如果没有父元素，则等同于stretch
