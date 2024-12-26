---
title: 面试总结
draft: true
date: '2021-07-09'
---

# 自我介绍

<https://www.zhipin.com/web/geek/resume>

## 对公司有什么想要了解的

# 问答

## 做过最满意的项目是什么？

上传、job任务

可以从以下几方面介绍

+ 项目背景
+ 为什么要做这件事情？
+ 最终达到什么效果？
+ 你处于什么样的角色，起到了什么方面的作用？
+ 在项目中遇到什么技术问题？具体是如何解决的？
+ 如果再做这个项目，你会在哪些方面进行改善？

## 最近有了解哪些前沿知识

+ typescritp
+ Vue3.0
+ WebAssembly
+ worker_threads
+ graphql
+ pwa

# js

## 知识点

`string` `array` `object` `funcion` `原型` `异步`

## js继承的各种实现以及优缺点

+ 通过prototype指定
+ `Object.setPrototypeOf`
+ 用 `Object.create`实现类继承
+ ES6的`extends`

## javascript 连等赋值问题

```javascript
let a = { n: 1 };
const b = a; // 持有a，以回查
a.x = a = { n: 2 };
alert(a.x);// --> undefined
alert(b.x);// --> {n:2}
```

`.`运算优先于`=`赋值运算，因此此处赋值可理解为

1. 声明a对象中的x属性，用于赋值，此时b指向a，同时拥有未赋值的x属性
2. 对a对象赋值，此时变量名a改变指向到对象{n:2}
3. 对步骤1中x属性，也即a原指向对象的x属性，也即b指向对象的x属性赋值

## array reduse 实现map方法

不用reduse实现：

```javascript
Array.prototype.map = function (fun) {
  const mapArr = [];
  for (const val of this) {
    mapArr.push(fun.call(null, val));
  }
  return mapArr;
}

  [1, 2, 3].map(val => val);
```

使用reduse实现：

```javascript
Array.prototype.map = function (fun) {
  const mapArr = [];
  this.reduce((accumulator, currentValue, index) => {
    mapArr.push(fun.call(null, this[index]));
  }, null);
  return mapArr;
};
```

## 实现一个无限查找素数的方法

使用生成器函数

```javascript
function* getShu() {
  let num = 1;
  function isShu(num) {
    let isShu = true;
    for (let i = 2; i <= num / 2; i++) {
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

自定义的迭代器对象

```javascript
// ES6写法
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

使用闭包

```javascript
function getShu() {
  let num = 0;
  function isShu(num) {
    let isShu = true;
    for (let i = 2; i <= num / 2; i++) {
      if (num % i === 0) {
        isShu = false;
        break;
      }
    }
    return isShu;
  }

  return function () {
    do {
      num++;

      if (isShu(num)) {
        return num;
      }
    } while (true);
  };
}
```

## 多维数组求和，请用能想到的最简洁的方法将以下数据求和 ?

```js
[1, 2, [3, 4], [[5, 6]], 7].flat(Infinity).reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, null);
```

## 请写一个function，输入为arr，输出为arr1 ?

```javascript
const arr = [
  {
    id: 1,
    source: [
      { name: 'hello1', text: 'word1' },
      { name: 'hello2', text: 'word2' },
      { name: 'hello3', text: 'word3' }
    ]
  },
  {
    id: 2,
    source: [
      { name: 'name1', text: '11' },
      { name: 'name2', text: '22' },
    ]
  }
];
const arr1 = [
  { id: 1, source: { name: 'hello1/hello2/hello3', text: 'word1/word2/word3' } },
  { id: 2, source: { name: 'name1/name2', text: '11/22' } }
];
```

```javascript
function formatArr(arr) {
  return arr.map((val) => {
    // console.log(val)
    return {
      id: val.id,
      source: val.source.reduce((accumulator, currentValue) => {
        return {
          name: `${accumulator.name}/${currentValue.name}`,
          text: `${accumulator.text}/${currentValue.text}`
        };
      }, {
        name: '',
        text: ''
      })
    };
  });
}
```

## class URLSearchParams {} 语法实现一个该接口 ? polyfill，需实现下面列举的要求

```javascript
// 构造函数支持传 ? URL 参数 ?
searchParams = new URLSearchParams('foo=1&bar=2');

// 构造函数也支持传入一个包含参数键值对的对 ?
searchParams = new URLSearchParams({ foo: '1', bar: '2' });

// 实例支持 get()、set()、has()、append() 四个方法
console.log(searchParams.get('foo')); // "1"
searchParams.set('foo', '10');
console.log(searchParams.has('bar')); // true
searchParams.append('foo', '100');

// 实例支持 toString() 方法
console.log(searchParams.toString()); // "foo=10&bar=2&foo=100"
// 实例支持 for-of 迭代
for (const [key, value] of searchParams) {
  console.log([key, value]);
  // ["foo", "10"]
  // ["bar", "2"]
  // ["foo", "100"]
}
```

```javascript
class URLSearchParams {
  constructor(params) {
    this.params = this.formatParams(params);
  };

  formatParams(params = {}) {
    if (typeof params === 'string') {
      const objParams = {};
      params.split('&').forEach((val) => {
        if (val) {
          const [key, value] = val.split('=');

          if (key in objParams) {
            objParams[key].push(value);
          } else {
            objParams[key] = [value];
          }
        }
      });
      return objParams;
    }
    return params;
  }

  get(key) {
    return this.params[key];
  }

  set(key, value) {
    this.params[key] = [value];
  }

  has(key) {
    return key in this.params;
  }

  append(key, value) {
    if (this.has(key)) {
      this.params[key].push(value);
    } else {
      this.set(key, value);
    }
  }

  toString() {
    let strParams = '';
    for (const key in this.params) {
      if (this.params[key]) {
        this.params[key].forEach((val) => {
          strParams += `${key}=${val}&`;
        });
      }
    }
    return strParams.substring(0, strParams.length - 1);
  }

  *[Symbol.iterator]() {
    for (const key in this.params) {
      for (const val of this.params[key]) {
        yield [key, val];
      }
    }
  }
}
```

## 使用原生js+css3写出一个简单的轮播图

（技能拓展：可配置自动滚动，自动滚动间隔，自动滚动时间，根据index滚动到指定卡）?

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<style>
    #test1 {
        width: 400px;
        height: 300px;
    }

    #test2 {
        width: 200px;
        height: 150px;
    }

    .swiper-container {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .swiper-container .swiper-list-container {
        width: 100%;
        height: 100%;
    }

    .swiper-container .swiper-item {
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
    }

    .swiper-container .swiper-item-active {
        opacity: 1;
    }

    .swiper-container .swiper-option-container {
        width: 100%;
        position: absolute;
        bottom: 0px;
        text-align: center;
    }

    .swiper-container .swiper-option-container .swiper-option {
        width: 100%;
        border-radius: 50%;
        width: 8px;
        height: 8px;
        background-color: gray;
        border: 3px solid white;
        display: inline-block;
        cursor: pointer;
        margin: 2px;
    }

    .swiper-container .swiper-option-container .swiper-option-active {
        background-color: blue;
    }
</style>

<body>
    <h1>自动播放</h1>
    <div id="test1"></div>
    <h1>不自动播放</h1>
    <div id="test2"></div>
</body>

<script>
    class Carousel {
        constructor(container, {
            rollingTime = 1000,
            interval = 5000,
            isAuto = true,
            data,
        } = {}) {

            this.container = document.getElementById(container);
            if (!this.container) {
                throw `找不到容器:${container}`;
            }

            if (!Array.isArray(data) || data.find((val) => {
                    return !val.img;
                })) {
                throw `数据不合法`;
            }

            this.data = data;
            this.rollingTime = rollingTime;
            this.interval = Math.max(rollingTime, interval);
            this.curentIndex = 0;
            this.isAuto = isAuto;
            this.timeInterval = null;

            this.init();

            if (this.isAuto) {
                this.mountInterval();
            }
        }
        init() {
            let swiperListContainer = document.createElement('div');
            swiperListContainer.className = 'swiper-list-container';
            let swiperOptionContainer = document.createElement('div');
            swiperOptionContainer.className = 'swiper-option-container';

            this.data.forEach((val, index) => {
                let swiperItem = document.createElement('div');

                swiperItem.dataset.index = index;
                swiperItem.style.backgroundImage = `url(${val.img})`;
                swiperItem.style.transition = `${this.rollingTime}ms`;

                let swiperOption = document.createElement('span');

                if (index == this.curentIndex) {
                    swiperItem.className = 'swiper-item swiper-item-active';
                    swiperOption.className = 'swiper-option swiper-option-active';
                } else {
                    swiperItem.className = 'swiper-item';
                    swiperOption.className = 'swiper-option';
                }
                swiperOption.dataset.index = index;

                swiperListContainer.appendChild(swiperItem);
                swiperOptionContainer.appendChild(swiperOption);
            });

            let swiperContainer = document.createElement('div');
            swiperContainer.className = 'swiper-container';
            swiperContainer.appendChild(swiperListContainer);
            swiperContainer.appendChild(swiperOptionContainer);

            this.container.appendChild(swiperContainer);

            swiperOptionContainer.onclick = (event) => {
                if ('index' in event.target.dataset) {
                    this.switchByIndex(event.target.dataset.index);
                };
            };
        }
        switchByIndex(index) {
            if (this.curentIndex == index) return;
            let curentNode = this.container.querySelector(`.swiper-item-active`);
            let selectNode = this.container.querySelector(`[data-index='${index}']`);
            curentNode.classList.remove('swiper-item-active');
            selectNode.classList.add('swiper-item-active');

            this.container.querySelector('.swiper-option-container .swiper-option-active').classList.remove(
                'swiper-option-active');
            this.container.querySelector(`.swiper-option-container [data-index='${index}']`).classList.add(
                'swiper-option-active');

            this.curentIndex = index;
        }
        mountInterval() {
            this.timeInterval = setInterval(() => {
                if (this.curentIndex + 1 >= this.data.length) {
                    this.switchByIndex(0);
                }else{
                    this.switchByIndex(this.curentIndex * 1 + 1);
                }
            }, this.interval);
        }
        destroyInterval(){
            clearInterval(this.timeInterval);
        }
    }

    new Carousel('test1', {
        rollingTime: 1500,
        interval: 2000,
        isAuto: true,
        data: [{
            img: 'http://img5.imgtn.bdimg.com/it/u=3449157411,2917314348&fm=26&gp=0.jpg'
        }, {
            img: 'http://img4.imgtn.bdimg.com/it/u=3183049068,3696301874&fm=26&gp=0.jpg'
        }, {
            img: 'http://c.hiphotos.baidu.com/baike/pic/item/bf096b63f6246b6096802320e1f81a4c500fa2dc.jpg'
        }, {
            img: 'http://img3.imgtn.bdimg.com/it/u=971222215,2004826118&fm=26&gp=0.jpg'
        }]
    });

    let t2 = new Carousel('test2', {
        rollingTime: 1000,
        isAuto: false,
        data: [{
            img: 'http://img4.imgtn.bdimg.com/it/u=3183049068,3696301874&fm=26&gp=0.jpg'
        }, {
            img: 'http://c.hiphotos.baidu.com/baike/pic/item/bf096b63f6246b6096802320e1f81a4c500fa2dc.jpg'
        }, {
            img: 'http://img3.imgtn.bdimg.com/it/u=971222215,2004826118&fm=26&gp=0.jpg'
        }]
    });
</script>

</html>
```

## 用html、css和js模拟实现一个下拉框

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<script src="http://at.alicdn.com/t/font_1732595_0gqoiwrkwpm6.js"></script>
<style>
    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }

    .select-wrapper {
        border: 1px solid black;
        width: 216px;
        height: 40px;
        position: relative;
    }

    .select-wrapper .text-wrapper {
        display: inline-block;
        width: 160px;
        height: 100%;
        line-height: 40px;
        padding-right: 24px;
        padding-left: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .select-wrapper span {
        position: absolute;
        height: 100%;
        right: 0;
        line-height: 40px;
        margin: 0 12px;
    }

    .select-wrapper span:hover {
        cursor: pointer;
    }

    .select-wrapper .option-wrapper {
        margin: 4px 0;
        background-color: white;
        border: 1px solid black;
    }

    .select-wrapper .option-wrapper .option-item {
        cursor: pointer;
        padding: 4px 12px;
        line-height: 34px;
    }

    .select-wrapper .option-wrapper .option-item-actived {
        background-color: gray;
    }

    .select-wrapper .option-wrapper .option-item:hover {
        cursor: pointer;
        background-color: gray;
    }
</style>

<body>
    <div class="select-wrapper">
        <div class="text-wrapper"></div>
        <span class="icon-wrapper">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiala"></use>
            </svg>
        </span>
        <div class="option-wrapper" style="display: none;">
            <div class="option-item">北京</div>
            <div class="option-item">上海</div>
            <div class="option-item">广州</div>
        </div>
    </div>
</body>
<script>
    function selectShow() {
        if (this.querySelector('use').getAttribute('xlink:href') === '#icon-shangla') {
            this.querySelector('use').setAttribute('xlink:href', '#icon-xiala');
            this.parentNode.querySelector('.option-wrapper').style.display = 'none';
        } else {
            this.querySelector('use').setAttribute('xlink:href', '#icon-shangla');
            this.parentNode.querySelector('.option-wrapper').style.display = '';
        }
    }

    function selectItems(event) {
        this.parentNode.querySelector('use').setAttribute('xlink:href', '#icon-xiala');
        this.style.display = 'none';

        if (this.querySelector('.option-item-actived')) {
            this.querySelector('.option-item-actived').classList.remove('option-item-actived');
        }
        event.target.classList.add('option-item-actived');
        this.parentNode.querySelector('.text-wrapper').innerText = event.target.innerText;
    }

    document.querySelectorAll('.icon-wrapper').forEach(dom => {
        dom.onclick = selectShow;
    });
    document.querySelectorAll('.option-wrapper').forEach(dom => {
        dom.onclick = selectItems;
    });
</script>

</html>
```

## a == 1 && a == 2 && a == 3 为true

```javascript
let a = {
    num:1,
    toString() {
        return this.num++;
    }
}

let a = {
    num:1,
    valueOf() {
        return this.num++;
    }
}

let a = {
    num:1,
    [Symbol.toPrimitive]() {
        return this.num++;
    }
}
```

## js不用递归实现斐波那契数列

```javascript
function getFibonacci(n) {
  if (n < 3) {
    return 1;
  }
  const resArr = [1, 1].concat(Array.from({ length: n - 2 }));
  for (let i = 2; i < n; i++) {
    resArr[i] = resArr[i - 1] + resArr[i - 2];
  }
  return resArr[n - 1];
}
```

## 实现链式操作如下代码

```javascript
test().add().log()
# ps:  链式操作参 ?
#  ?(new  Pormise().then().catch())
#  ?($(this).eq().find())
```

```javascript
function test() {
  class test {
    add() {
      return this;
    }

    log() {
      return this;
    }
  }
  return new test();
}
```

## 给定有序数组array和数字n，找出n在array中起始位置的下标和终止位置的下标

使用indexOf和lastIndexOf

```javascript
function search(arr, number) {
  const startIndex = arr.indexOf(number);
  const lastIndex = arr.lastIndexOf(number);
  return [startIndex, lastIndex];
}
```

不使用indexOf和lastIndexOf

```javascript
function search(arr, number) {
  function indexOf(arr, number) {
    let staIndex = 0;
    let endIndex = arr.length;
    let midelIndex = staIndex + Math.floor((endIndex - staIndex) / 2);
    do {
      if (staIndex + 1 >= endIndex) {
        if (arr[endIndex] === number) {
          return endIndex;
        }
        if (arr[staIndex] === number) {
          return staIndex;
        }
        return -1;
      }
      if (arr[midelIndex] < number) {
        staIndex = midelIndex;
        midelIndex = staIndex + Math.floor((endIndex - staIndex) / 2);
      } else {
        endIndex = midelIndex;
        midelIndex = staIndex + Math.floor((endIndex - staIndex) / 2);
      }
    } while (true);
  }

  function lastIndexOf(arr, number) {
    let staIndex = 0;
    let endIndex = arr.length;
    let midelIndex = staIndex + Math.round((endIndex - staIndex) / 2);
    do {
      if (staIndex + 1 >= endIndex) {
        if (arr[staIndex] === number) {
          return staIndex;
        }
        if (arr[endIndex] === number) {
          return endIndex;
        }

        return -1;
      }
      if (arr[midelIndex] <= number) {
        staIndex = midelIndex;
        endIndex = endIndex;
        midelIndex = staIndex + Math.round((endIndex - staIndex) / 2);
      } else {
        endIndex = midelIndex;
        midelIndex = staIndex + Math.round((endIndex - staIndex) / 2);
      }
    } while (true);
  }

  const startIndex = indexOf(arr, number);
  const lastIndex = lastIndexOf(arr, number);
  return [startIndex, lastIndex];
}

const arr = [1, 2, 3, 4, 4, 4, 5, 6, 7];
console.log(search(arr, 3));
```

## 实现继承的方式

## Reflect&Proxy

## defineProperty

## 迭代器

## 字符串、数组、对象、正则

## 函数声明和函数表达式

函数声明

```javascript
function say() {
  console.log('函数声明');
}
```

函数表达式

```javascript
const say = function () {
  console.log('函数表达式');
};
```

javascript解释器中存在一种变量声明被提升的机制，也就是说**函数声明**会被提升到作用域的最前面，
而用**函数表达式**创建的函数是在运行时进行赋值，且要等到表达式赋值完成后才能调用

## 不能使用任何循环控制语句和迭代器实现一个0到1000的数组赋值

```javascript
Array.from(Array.from({ length: 1000 }), (val, index) => {
  return index;
});
// 或者
function getFillingArr(length) {
  class iteratorCla {
    constructor(length) {
      this.start = 0;
      this.end = length;
    }

    next() {
      this.start++;
      return {
        done: this.start > this.end,
        value: this.start - 1
      };
    }

    [Symbol.iterator]() {
      return this;
    }
  }
  return new Array(...new iteratorCla(length));
}
```

## “get1_install2_app3_list4_by5_android6”（每个单词后面总会携带一个数字，只有偶数才删掉），我不用循环只用正则怎么实现输出”get1InstallApp3ListBy5Android”？

```javascript
const str = 'get1_install2_app3_list4_by5_android6';

const res = str.replace(/(\d)_?([a-z])?/g, (match, p1, p2) => {
  return `${p1 % 2 === 0 ? '' : p1}${p2 ? p2.toUpperCase() : ''}`;
});
// output： get1InstallApp3ListBy5Android
console.log(res);
```

## 深拷贝

数组和对象的深拷贝

```javascript
function deepCopy(p, c) {
  var c = c || {};
  for (const i in p) {
    if (typeof p[i] === 'object') {
      c[i] = Array.isArray(p[i]) ? [] : {};
      deepCopy(p[i], c[i]);
    } else {
      c[i] = p[i];
    }
  }
  return c;
}
```

## 动态规划求斐波那契数

动态规划背后的基本思想非常简单。大致上，若要解一个给定问题，我们需要解其不同部分（即子问题），再根据子问题的解以得出原问题的解。通常许多子问题非常相似，为此动态规划法试图仅仅解决每个子问题一次，从而减少计算量：一旦某个给定子问题的解已经算出，则将其记忆化存储，因此，下一次出现相同的子问题时，无需重新计算其解决方案，只需查找先前计算的解决方案即可，从而节省了计算时间。这种做法在重复子问题的数目关于输入的规模呈指数增长时特别有用。

```javascript
function fibnacci2(n, memo = []) {
  if (n == 0 || n == 1) {
    return 1;
  }
  if (memo[n]) {
    return memo[n];
  }
  memo[n] = fibnacci2(n - 1, memo) + fibnacci2(n - 2, memo);
  return memo[n];
}
```

## 数组排序-快排

选一基准元素，依次将剩余元素中小于该基准元素的值放置其左侧，大于等于该基准元素的值放置其右侧；然后，取基准元素的前半部分和后半部分分别进行同样的处理；以此类推，直至各子序列剩余一个元素时，即排序完成

```javascript
function kuaipai(data) {
  if (!data || data.length == 1) {
    return;
  }
  const iData = data[0];
  const leftData = [];
  const rightData = [];
  for (let i = 0; i < length; i++) {
    if (data[i] > iData) {
      rightData.push(data[i]);
    } else {
      leftData.push(data[i]);
    }
  }
  data = leftData.concat(rightData);
}
```

## 数组排序-冒泡

依次比较相邻两元素，若前一元素大于后一元素则交换之，直至最后一个元素即为最大；然后重新从首元素开始重复同样的操作，直至倒数第二个元素即为次大元素；依次类推。如同水中的气泡，依次将最大或最小元素气泡浮出水面。

```javascript
function maopao(data) {
  let isLoop = true;
  const length = data.length;
  do {
    isLoop = false;
    for (let i = 0; i < length; i++) {
      if (data[i] > data[i + 1]) {
        const iData = data[i];
        data[i] = data[i + 1];
        data[i + 1] = iData;
        isLoop = true;
      }
    }
  } while (isLoop);
}
```

## 二叉树遍历-深度优先

对每一个可能的分支路径深入到不能再深入为止

```javascript
// 深度优先算法，不断地沿着顶点的深度方向遍历
function foreachTreeS(treeData) {
  if (treeData && treeData.left) {
    foreachTreeS(treeData.left);
  }
  if (treeData && treeData.right) {
    foreachTreeS(treeData.right);
  }
}
```

## 二叉树遍历-广度优先

从上往下对每一层依次访问，在每一层中，从左往右（也可以从右往左）访问结点，访问完一层就进入下一层，直到没有结点可以访问为止

```javascript
// 广度优先
function foreachTreeG(treeData) {
  const my_queue = [treeData];
  while (my_queue.length) {
    const node = my_queue.shift();
    console.log(node.name);
    if (node.left) {
      my_queue.push(node.left);
    }
    if (node.right) {
      my_queue.push(node.right);
    }
  }
}
```

## 找出两个对象不一致的是哪个变量

返回的格式类似：”root变量-父变量-…-不一致的变量”的字符串；

```javascript
const isObj = val => val && typeof val === 'object';
const isArr = arr => Array.isArray(arr);
const isNaN = Number.isNaN;

function compare(val1, val2) {
  let diff = '';

  if (isArr(val1) && isArr(val2)) {
    if (val1.length === val2.length) {
      for (let index = 0; index < val1.length; index++) {
        diff = compare(val1[index], val2[index]);
        if (diff) {
          return `数组下标${index}-${diff}`;
        }
      }
      return;
    } else {
      return `数组长度不一致`;
    }
  }

  if (isNaN(val1) && isNaN(val2)) {
    return;
  }

  if ((typeof val1 === 'function' && typeof val2 === 'function')
    || (val1 instanceof Date && val2 instanceof Date)
    || (val1 instanceof RegExp && val2 instanceof RegExp)
    || (val1 instanceof String && val2 instanceof String)
    || (val1 instanceof Number && val2 instanceof Number)) {
    if (val1.toString() !== val2.toString()) {
      return `不一致的变量${val1}和${val2}`;
    }
    return;
  }

  if (typeof val1 === 'object' && typeof val2 === 'object') {
    // mixin两个对象的key
    const mixinKeys = new Set([...Object.keys(val1), ...Object.keys(val2)]);
    for (const key of mixinKeys) {
      if (key in val1 && key in val2) {
        // console.log(val1[key])
        diff = compare(val1[key], val2[key]);
        if (diff) {
          return `${key}-${diff}`;
        }
      } else {
        return `包含不同的key:${key}`;
      }
    }
    return;
  }

  if (val1 !== val2) {
    return `不一致的变量${val1}和${val2}`;
  }
}

const obj1 = {
  name: 'ck',
  age: 18,
  arr: [1, 2, {
    ob: '3'
  }],
  child: {
    name: 'ck',
    age: '18',
    n: Number.NaN,
    ch: [1, 'yyy', {
      date1: new Date(0),
      date2: new Date(0)
    }],
  },
};
const obj2 = {
  name: 'ck',
  age: 18,
  arr: [1, 2, {
    ob: '3'
  }],
  child: {
    name: 'ck',
    age: '18',
    n: Number.NaN,
    ch: [1, 'yyy', {
      date1: new Date(0),
      date2: new Date(1995, 5, 20)
    }]
  },

};

// output： child-ch-数组下标2-date2-不一致的变量Thu Jan 01 1970 08:00:00 GMT+0800 (CST)和Tue Jun 20 1995 00:00:00 GMT+0800 (CST)
console.log(compare(obj1, obj2));
```

## 设计一个自由可灵活配置的时间调度器

有a,b,c,d...很多个需要被调度的方法（方法名称的命名可随意），调度有两种形式，一个是顺序调用（例如调度完a后才能调度b），一个是间隔某个时间进行循环调度。用一个统一的方法进行封装可以实现下列的例子：

1，可以为5秒后调用a,3秒后调用b，10秒后调用。c...z方法不执行（不执行的方法可以设计成不传递参数），那么在第14秒的时候开始重新从0秒循环，又变成第一秒后调用a,3秒后调用b，这样循环往复；

2，每间隔6秒调用一次a,每间隔4秒调用一次b，c...z方法不执行；

3，第一秒先执行a，3秒后执行b，但是c却是每间隔3秒执行一次，d是每间隔4秒执行一次，a和b是每4秒进行一次循环；

4，a不执行，b和c每间隔3秒执行一次，d不执行；

```javascript
class Scheduler {
  constructor() {
    this.intervalLoop = [];
    this.intervalLoopOrder = [];
  }

  async delaytime(time) {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, time);
    });
  }

  /**
   * 添加间隔某个时间进行循环调度
   * @param {Function} fun 调度的函数
   * @param {Array} args 调度的函数的参数
   * @param {object} options interval:间隔时间(ms)
   */
  add(fun, args, options = {}) {
    if (!Array.isArray(args)) {
      args = undefined;
    }

    this.intervalLoop.push({
      fun,
      args,
      interval: options.interval,
    });
  }

  /**
   * 添加间隔某个时间顺序调用
   * @param {Array} handlers 包含顺序调用的函数、参数、延迟调用的时间 如 [{funL console.log,args:['hello', 'world'], delay: 1000 }]
   * @param {object} options interval:间隔时间(ms)
   */
  adds(handlers, options = {}) {
    this.intervalLoopOrder.push({
      handlers,
      interval: options.interval,
    });
  }

  /**
   * 触发调度器
   */
  start() {
    this.runIntervalLoop();
    this.runIntervalLoopOrder();
  }

  /**
   * 触发间隔某个时间进行循环调度
   */
  runIntervalLoop() {
    if (!this.intervalLoop.length) {
      return;
    }
    for (const val of this.intervalLoop) {
      if (!val.interval) {
        return;
      }

      setInterval(() => {
        if (!Array.isArray(val.args)) {
          val.args = undefined;
        }
        val.fun.apply(null, val.args);
      }, val.interval);
    }
  }

  async emitHandlersIntervalInOrder(options = {}) {
    const { handlers, interval } = options;
    if (!Array.isArray(handlers) || !handlers.length) {
      return;
    }

    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      timeout = null;
      // 重置
      this.emitHandlersIntervalInOrder(options);
    }, interval);

    const handlerFuns = async (handlers) => {
      for (const handler of handlers) {
        if (!Array.isArray(handler.args)) {
          handler.args = undefined;
        }
        // 保证按顺序调用
        await this.delaytime(handler.delay);
        await handler.fun.apply(null, handler.args);
      }
    };

    do {
      await handlerFuns(handlers);
    } while (timeout);
  }

  /**
   * 触发间隔某个时间顺序调用
   */
  runIntervalLoopOrder() {
    if (!this.intervalLoopOrder.length) {
      return;
    }
    for (const val of this.intervalLoopOrder) {
      this.emitHandlersIntervalInOrder(val);
    }
  }
}

/**

let sche = new Scheduler();

function a (val){
    console.log(`a:${val}`);
}
function b (val,val2){
    console.log(`b:${val},${val2}`);
}
function c (){
    console.log(`c`);
}
function d (){
    console.log(`d`);
}

//1，可以为5秒后调用a,3秒后调用b，10秒后调用。c...z方法不执行（不执行的方法可以设计成不传递参数），那么在第14秒的时候开始重新从0秒循环，又变成第一秒后调用a,3秒后调用b，这样循环往复；
sche.adds([{
    fun: a,
    args: ['参数1'],
    delay: 5000,
},{
    fun: b,
    args: ['参数1','参数2'],
    delay: 3000,
}],{
    interval: 14000
})
sche.start();


//2.每间隔6秒调用一次a,每间隔4秒调用一次b，c...z方法不执行；
sche.add(a,['参数1'],{
    interval: 6000
});

sche.add(b,['参数1','参数2'],{
    interval: 4000
});
sche.start();

//3.第一秒先执行a，3秒后执行b，但是c却是每间隔3秒执行一次，d是每间隔4秒执行一次，a和b是每4秒进行一次循环；
sche.adds([{
    fun: a,
    args: ['参数1'],
    delay: 1000,
},{
    fun: b,
    args: ['参数1','参数2'],
    delay: 3000,
}],{
    interval: 4000
});
sche.start();

//4，a不执行，b和c每间隔3秒执行一次，d不执行；
sche.add(b,null,{
    interval: 6000
});

sche.add(c,null,{
    interval: 4000
});
sche.start();

 *
 */
```

# node

## koa中间件传参数，允许输入参数限制请求

```javascript
function name(methods) {
  return async function (ctx, next) {
    const startDate = new Date();

    if (methods.includes(ctx.request.method)) {
      await next();
    }
    console.log(`time:${new Date() - startDate}`);
  };
}
```

## koa原理

## nodejs如何处理高并发

# css

## css的position

CSS **`position`**属性用于指定一个元素在文档中的定位方式。[`top`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/top)，[`right`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/right)，[`bottom`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/bottom) 和 [`left`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/left) 属性则决定了该元素的最终位置

定位类型

+ **定位元素（positioned element）**是其[计算后](https://developer.mozilla.org/zh-CN/docs/Web/CSS/computed_value)位置属性为 `relative`, `absolute`, `fixed`或 `sticky` 的一个元素（换句话说，除`static`以外的任何东西）。
+ **相对定位元素（****relatively positioned element****）**是[计算后](https://developer.mozilla.org/zh-CN/docs/Web/CSS/computed_value)位置属性为 `relative`的元素。
+ **绝对定位元素（absolutely positioned element）**是[计算后](https://developer.mozilla.org/zh-CN/docs/Web/CSS/computed_value)位置属性为 `absolute` 或 `fixed` 的元素。
+ **粘性定位元素****（****stickily positioned element****）**是[计算后](https://developer.mozilla.org/zh-CN/docs/Web/CSS/computed_value)位置属性为 `sticky` 的元素。

> 绝对定位的元素可以通过指定[`top`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/top)和[`bottom`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/bottom) ，保留[`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height)未指定（即`auto`），来填充可用的垂直空间。它们同样可以通过指定[`left`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/left) 和 [`right`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/right)并将[`width`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/width) 指定为`auto`来填充可用的水平空间。

`static`该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 `top`, `right`, `bottom`, `left` 和 `z-index`属性无效。

`relative`该关键字下，元素先放置在未添加定位时的位置，再在不改变页面布局的前提下调整元素位置（因此会在此元素未添加定位时所在位置留下空白）。position:relative 对 table-*-group, table-row, table-column, table-cell, table-caption 元素无效。

`absolute`元素会被移出正常文档流，并不为元素预留空间，通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。绝对定位的元素可以设置外边距（margins），且不会与其他边距合并。

`fixed`元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。`fixed` 属性会创建新的层叠上下文。当元素祖先的 `transform`, `perspective` 或 `filter` 属性非 `none` 时，容器由视口改为该祖先

`sticky`元素根据正常文档流进行定位，然后相对它的`最近滚动祖先`基于`top`, `right`, `bottom`, 和 `left`的值进行偏移。偏移值不会影响任何其他元素的位置。可以成是`position:relative`和`position:fixed`的结合体，当元素在屏幕内，表现为relative，就要滚出显示器屏幕的时候，表现为fixed。

## css采用的优先级

[https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)

## css有哪些选择器

[https://www.w3school.com.cn/cssref/css_selectors.asp](https://www.w3school.com.cn/cssref/css_selectors.asp)

## 请解释浮动 (Floats) 及其工作原理

[https://ckvv.github.io/public/web/css关于浮动/](https://ckvv.github.io/public/web/css关于浮动/)

## flex有哪些属性

[http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

Webkit内核的浏览器，必须加上-webkit前缀

以下6个属性设置在容器上

+ `flex-direction`属性决定主轴的方向,即项目的水平或垂直的排列方向`row | row-reverse | column | column-reverse`,默认`row`
+ `flex-wrap`属性决定主轴如何换行`nowrap | wrap | wrap-reverse`,默认`nowrap`
+ `flex-flow`属性是flex-direction属性和flex-wrap属性的简写形式` || `，默认`row nowrap`
+ `justify-content`属性定义了项目在主轴上的对齐方式`flex-start | flex-end | center | space-between | space-around`，默认`flex-start`左对齐
+ `align-items`属性定义项目在交叉轴上如何对齐`lex-start | flex-end | center | baseline | stretch`，默认stretch，如果项目未设置高度或设为auto，将占满整个容器的高度
+ `align-content`属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用

以下6个属性设置在项目上

+ `order`属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。
+ `flex-grow`属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不大，如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）。
+ `flex-shrink`属性定义了
+ 的缩小比例，默认为1，即如果空间不足，该项目将缩小
+ `flex-basis`属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小
+ `flex`属性是`flex-grow`, `flex-shrink` 和`flex-basis`的简写，后两个属性可选,该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto),默认值为0 1 auto。
+ `align-self`属性允许单个项目有与其他项目不一样的对齐方式，`auto | flex-start | flex-end | center | baseline | stretch`可覆盖align-items属性,默认值为auto,表示继承父元素的align-items属性，如果没有父元素，则等同于stretch

## grid布局

[http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

Grid 布局则是将容器划分成"行"和"列"，产生单元格，然后指定"项目所在"的单元格

## 浏览器CSS匹配顺序

浏览器CSS匹配不是从左到右进行查找，而是从右到左进行查找。比如`#divBox p span.red{color:red;}`，浏览器的查找顺序如下：先查找html中所有class='red'的span元素，找到后，再查找其父辈元素中是否有p元素，再判断p的父元素中是否有id为divBox的div元素，如果都存在则匹配上。浏览器从右到左进行查找的好处是为了尽早过滤掉一些无关的样式规则和元素

## `display:none` 和`visibilty:hidden`的区别

 `visibility:hidden`属性会使对象不可见，但该对象在网页所占的空间没有改变（看不见但摸得到），等于留出了一块空白区域，而`display:none`属性会使这个对象彻底消失,

## Div居中方式

flex和grid布局都可以轻松实现垂直居中或水平居中

```css
.wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper{
  display: grid;
  justify-items: center;
  align-items: center;
}

//
.wrapper{
  display: flex | grid;
}
.items{
  margin: auto;
}
```

```css
.box{
   width: 600px;
   height: 300px;
   background: lightgreen;
   position: relative;        /*外部元素开启relative定位*/
}
.content{
   background: red;
   position: absolute;       /*内部元素开启absolute定位*/
   top: 50%;                 /*向下移动父级高度的50%*/
   left: 50%;                /*向右移动父级宽度的50%*/
   transform: translate(-50%, -50%);  /*向上、向左移动自身高度、宽度的50%,即完成了*/
}
```

对于有宽度的如100px或者百分比的可以设置

```css
.center{
  position: absolute;
  width: 100px;
  height: 100px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
```

垂直居中方式

+ 利用 **`table-cell`** ，将父级设为 **`display: table-cell;`** 加 **`vertical-align: middle;`** 实现子元素垂直居中

+ 利用相对布局加平移，将子级设为 **`position: relative;`** 加 **`top: 50%;`** 加 **`transform: translateY(-50%);`** 实现子元素垂直居中

+ 通过绝对布局加 margin ，将父级设为 **`position: relative;`** ，加子元素设上下左右均为 **`0`** 并且 **`margin: auto 0;`** 实现子元素垂直居中

水平居中方式

+ 利用父级 **`text-align: center;`** 加子级 **`display: inline-block;`**（只要是`inline-`的都可以）实现子元素水平居中

+ 利用相对布局加平移，将子级设为 **`position: relative;`** 加 **`left: 50%;`** 加 **`transform: translateX(-50%);`** 实现子元素水平居中
+ 将有宽度的子元素左右间距设为 **`auto`** 实现子元素水平居中

# 浏览器

## 浏览器输入URL的展现过程

[http://fex.baidu.com/blog/2014/05/what-happen/](http://fex.baidu.com/blog/2014/05/what-happen/)

[https://div.io/topic/609](https://div.io/topic/609)

## 浏览器的渲染原理

[https://coolshell.cn/articles/9666.html](https://coolshell.cn/articles/9666.html)

## XSS和CSRF攻击

`XSS`跨站脚本攻击是指恶意攻击者往Web页面里插入恶意Script代码，当用户浏览该页之时，嵌入其中Web里面的Script代码会被执行，从而达到恶意攻击用户的目的

关于防范XSS上，

+ 主要就是通过对用户输入的数据做过滤或者是转义，可以使用框架提供的工具类HtmlUtil。

+ 前端在浏览器展示数据的时候，要使用安全的API展示数据。比如使用innerText而不是innerHTML

`SQL注入`SQL语句进行字符串拼接的时候，直接使用未转义的用户输入内容作为变量

防范SQL注入

+ 过滤用户输入参数中的特殊字符

+ 禁止通过字符串拼接sql语句，要严格使用参数绑定来传入参数。

+ 合理使用数据库框架提供的机制。就比如Mybatis提供的传入参数的方式 #{}，禁止使用${}，后者相当于是字符串拼接sql，要使用参数化的语句

`CSRF`跨站请求伪造,在用户并不知情的情况下，冒充用户发送请求，在当前已经登录的web网站上执行恶意操作，比如恶意发帖，修改密码等,大致来看，与XSS有重合的地方，前者是黑客盗用用户浏览器中的登录信息，冒充用户去执行操作。后者是在正常用户请求的HTML中放入恶意代码，XSS问题出在用户数据没有转义，过滤；CSRF问题出现在HTTP接口没有防范不守信用的调用

+ CSRF Token验证，利用浏览器的同源限制，在HTTP接口执行前验证Cookie中的Token，验证通过才会继续执行请求
+ 人机交互，例如短信验证码、界面的滑块

## 怎么处理浏览器兼容性

处理css兼容性

浏览器的前缀，

处理js兼容性自己实现的浏览器不支持的方法

添加写浏览器不支持的方法

## 什么是渐进增强和优雅降级

渐进增强是在保证基本效果的情况下增强效果，优雅降级是保证最恶劣情况下的基本效果

渐进增强(progressive enhancement)：针对低版本浏览器进行构建页面，保证最基本的功能，然后再针对高级浏览器进行效果、交互等改进和追加功能达到更好的用户体验

优雅降级(graceful degradation)：一开始就构建完整的功能，然后再针对低版本浏览器进行兼容

## 前端性能优化

+ 文件合并
+ 文件最小化/文件压缩
+ 使用 CDN 托管
+ 缓存的使用
+ 升级http2.0

## 什么是跨域资源共享 (CORS)？它用于解决什么问题？

## 请解释 `<script>`、`<script async>` 和 `<script defer>` 的区别

[https://www.cnblogs.com/jiasm/p/7683930.html](https://www.cnblogs.com/jiasm/p/7683930.html)

![image](https://user-images.githubusercontent.com/9568094/31619989-a874ae42-b25b-11e7-9a80-e0f644f27849.png)

普通script

文档解析的过程中，如果遇到`script`脚本，就会停止页面的解析进行下载（但是Chrome会做一个优化，如果遇到`script`脚本，会快速的查看后边有没有需要下载其他资源的，如果有的话，会先下载那些资源，然后再进行下载`script`所对应的资源，这样能够节省一部分下载的时间 `@Update: 2018-08-17`）。
资源的下载是在解析过程中进行的，虽说`script1`脚本会很快的加载完毕，但是他前边的`script2`并没有加载&执行，所以他只能处于一个挂起的状态，等待`script2`执行完毕后再执行。
当这两个脚本都执行完毕后，才会继续解析页面。![image](https://user-images.githubusercontent.com/9568094/31621391-39849b1a-b25f-11e7-9301-641b1bc07155.png)

defer

文档解析时，遇到设置了`defer`的脚本，就会在后台进行下载，但是并不会阻止文档的渲染，当页面解析&渲染完毕后。
会等到所有的`defer`脚本加载完毕并按照顺序执行，执行完毕后会触发`DOMContentLoaded`事件。
![image](https://user-images.githubusercontent.com/9568094/31621324-046d4a44-b25f-11e7-9d15-fe4d6a5726ae.png)

async

`async`脚本会在加载完毕后执行。
`async`脚本的加载不计入`DOMContentLoaded`事件统计，也就是说下图两种情况都是有可能发生的

![image](https://user-images.githubusercontent.com/9568094/31621170-b4cc0ef8-b25e-11e7-9980-99feeb9f5042.png)
![image](https://user-images.githubusercontent.com/9568094/31622216-6c37db9c-b261-11e7-8bd3-79e5d4ddd4d0.png)

推荐的应用场景

defer

如果你的脚本代码依赖于页面中的`DOM`元素（文档是否解析完毕），或者被其他脚本文件依赖。
**例：**

1. 评论框
2. 代码语法高亮
3. `polyfill.js`

async

如果你的脚本并不关心页面中的`DOM`元素（文档是否解析完毕），并且也不会产生其他脚本需要的数据。
**例：**

1. 百度统计

# 计算机网络

## HTTP的前世今生

[https://coolshell.cn/articles/9666.html](https://coolshell.cn/articles/9666.html)

## UDP和TCP的区别

## 网络协议及常见状态码

## Dns解析的细节

## tcp三次握手的细节

## 网络七层协议

# 构建工具

## webpack中loader和plugin区别

> loader

用于对模块的源代码进行转换。loader 可以使你在 import 或”加载”模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 import CSS文件！

> plugin

对于plugin，它就是一个扩展器，它丰富了wepack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，例如

run：开始编译 make：从entry开始递归分析依赖并对依赖进行build build-moodule：使用loader加载文件并build模块 normal-module-loader：对loader加载的文件用acorn编译，生成抽象语法树AST program：开始对AST进行遍历，当遇到require时触发call require事件 seal：所有依赖build完成，开始对chunk进行优化（抽取公共模块、加hash等） optimize-chunk-assets：压缩代码 emit：把各个chunk输出到结果文件

# 前端框架

## 剖析vue实现原理，自己动手实现mvvm

[vue实现原理](https://github.com/ckvv/mvvm)

Vue2.0中 将遍历此对象所有的 property，并使用 [`Object.defineProperty`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 把这些 property 全部转为 [getter/setter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#定义_getters_与_setters)。每个组件实例都对应一个 **watcher** 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

![data](https://cn.vuejs.org/images/data.png)

Vue **不能检测**数组和对象的变化。

Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的。

```javascript
const vm = new Vue({
  data: {
    a: 1
  }
});

// `vm.a` 是响应式的

vm.b = 2;
// `vm.b` 是非响应式的
```

对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 `Vue.set(object, propertyName, value)` 方法向嵌套对象添加响应式 property。

```javascript
Vue.set(vm.someObject, 'b', 2);
```

有时你可能需要为已有对象赋值多个新 property在这种情况下，你应该用原对象与要混合进去的对象的 property 一起创建一个新的对象。

```
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
```

对于数组,vuet通过拦截常用的修改数组的办法实现监听，但是Vue 不能检测以下数组的变动：

1. 当你利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
2. 当你修改数组的长度时，例如：`vm.items.length = newLength`

同样的我们可以使用

```
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
//或者
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

## vue自定义插件

[vue插件](https://cn.vuejs.org/v2/guide/plugins.html)
插件通常用来为 Vue 添加全局功能

+ 添加全局方法或者属性。如：vue-custom-element，
+ 添加全局资源：指令/过滤器/过渡等。如 vue-touch
+ 通过全局混入来添加一些组件选项。如 vue-router
+ 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现,消息提醒，event-bus
通过全局方法 Vue.use() 使用插件,Vue.js 的插件应该暴露一个 install 方法。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象：

```javascript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
  };
  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind(el, binding, vnode, oldVnode) {
    }
  });
  // 3. 注入组件选项
  Vue.mixin({
    created() {
    }
  });
  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
  };
};
```

一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 vue-router

## vue自定义指令

[vue文档](https://cn.vuejs.org/v2/guide/custom-directive.html)

有的情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。,一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

+ `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
+ `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
+ `update`：所在组件的 VNode 更新时调用，

+ `componentUpdated`：指令所在组件的 VNode **及其子 VNode** 全部更新后调用。
+ `unbind`：只调用一次，指令与元素解绑时调用。

指令钩子函数会被传入以下参数：

+ `el`：指令所绑定的元素，可以用来直接操作 DOM。

+ ```
  binding
  ```

  ：一个对象，包含以下 property：

  + `name`：指令名，不包括 `v-` 前缀。
  + `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。
  + `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
  + `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。
  + `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。
  + `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。

+ `vnode`：Vue 编译生成的虚拟节点

+ `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

```javascript
<input v-focus="isFocus" />

directives: {
  focus: {
    componentUpdated(el, {
      value
    }) {
      if (value) el.focus();
    }
  },
},
```

## 自定义组件的 v-model

一个组件上的 `v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件,但是像单选框、复选框等类型的输入控件可能会将 `value` attribute 用于[不同的目的](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。`model` 选项可以用来避免这样的冲突

```javascript
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})

//现在在这个组件上使用 v-model
<base-checkbox v-model="lovingVue"></base-checkbox>
```

## vue双向绑定的方法

+ 通过对象传递值，因为对象是引用类型所以

+ 通过监听事件

```javascript
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>

//在一个包含 title prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：
this.$emit('update:title', newTitle)

```

+ 为了方便上面那一种写法，vue提供了[`.sync` 修饰符](https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-修饰符)

```javascript
<text-document :title.sync="doc.title"></text-document>

//同理在一个包含 title prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：
this.$emit('update:title', newTitle)
```

## vue[插槽](https://cn.vuejs.org/v2/guide/components-slots.html)

`<slot>` 允许你像这样合成组件,

```html
<navigation-link url="/profile">
  Your Profile
</navigation-link>

//<navigation-link>
<a
  v-bind:href="url"
  class="nav-link"
>
  <slot></slot>
</a>
```

插槽内可以包含任何模板代码或其它的组件

如果 `<navigation-link>` 的 `template` 中**没有**包含一个 `<slot>` 元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃

`<slot>` 元素有一个特殊的 attribute：`name`。这个 attribute 可以用来定义额外的插槽,一个不带 `name` 的 `<slot>` 出口会带有隐含的名字“default”

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

//在向具名插槽提供内容的时候，我们可以在一个 <template> 元素上使用 v-slot 指令，并以 v-slot 的参数的形式提供其名称：
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <!--等同于
  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>
  -->

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

## 访问父组件

```
this.$parent.<?>
```

## 访问子组建

通过 `ref` 这个 attribute 为子组件赋予一个 ID 引用。例如

```
<base-input ref="usernameInput"></base-input>

this.$refs.usernameInput
```

## [依赖注入](https://cn.vuejs.org/v2/guide/components-edge-cases.html#依赖注入)

使用 `$parent` property 无法很好的扩展到更深层级的嵌套组件上,这也是依赖注入的用武之地，它用到了两个新的实例选项：`provide` 和 `inject`。

`provide` 选项允许我们指定我们想要**提供**给后代组件的数据/方法。如

```javascript
provide: function () {
  return {
    getMap: this.getMap
  }
}
```

然后在任何后代组件里，我们都可以使用 `inject` 选项来接收指定的我们想要添加在这个实例上的 property：

```
inject: ['getMap']
```

## 过滤器

Vue.js 允许你自定义过滤器，过滤器可以串联,可被用于一些常见的文本格式化。过滤器可以用在两个地方：双花括号插值和 `v-bind` 表达式

```html
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```

你可以在一个组件的选项中定义本地的过滤器：

```javascript
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}

//全局的
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

## VUE的生命周期

## vuex的mutation和action的区别，为什么要设立两个而不是直接用mutation操作state

mutation
更改 Vuex 的 store 中的状态的唯一方法是提交 mutation

# 数据库

## redis

redis的数据类型

+ String：

  `SET key value`设置指定 key 的值; `GET key value`获取指定 key 的值;

+ Hash:是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象。Redis 中每个 hash 可以存储 232 - 1 键值对（40多亿）

+ List：列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）

+ Redis 的 Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据。

  Redis 中集合是通过哈希表实现的

+ 有序集合(sorted set)：Redis 有序集合和集合一样也是string类型元素的集合,且不允许重复的成员。不同的是每个元素都会关联一个double类型的分数。redis正是通过分数来为集合中的成员进行从小到大的排序。有序集合的成员是唯一的,但分数(score)却可以重复。

# 其他

[前端笔试题](https://fe.padding.me/#/questions/1)
