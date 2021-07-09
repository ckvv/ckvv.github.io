---
title: js的prototype
tags: ['js']
---

## 什么是原型链
首先我们需要知道什么是原型，在javascript中，函数可以有属性。 每个函数都有一个特殊的属性叫作原型（prototype）,我们可以添加一些属性到原型上面,然后，我们可以使用 new 运算符来在现在的这个原型基础之上，创建一个的实例。每个实例对象都有一个私有属性（称之为 __proto__ ）指向它的构造函数的原型对象（prototype ）.
当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，以及该对象的原型的原型，依次层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。

## 如何利用原型链实现继承

假设这里有两个类
```javascript
// 交通工具
function Transportation(name){
    this.name = name;

    // 该属性没有定义到原型链上,可以通过Object.keys获取
    this.say = function(){
        console.log(`Transportation： ${this.name}是交通工具`);
    }
}

Object.assign(Transportation.prototype,{
    move : function (){
        console.log(`Transportation: ${this.name} 会移动`);
    },
});


// 汽车
function Car(name){
    // 调用Transportation构造函数，绑定this变量 我们也可以
    // this.name = name;
    Transportation.call(this, name);
}
```

此时Car的原型是
```
new Car() ----> Car.prototype ----> Object.prototype ----> null
```

要实现继承我们需要将该对象的原型指向要继承对象的原型，如
```
new Car() ----> Car.prototype ----> Transportation.prototype ----> Object.prototype ----> null
```

你可能会想到

```
Car.prototype = Transportation.prototype;
```

这样的确可以使用Transportation上面的属性，但是还存在了两个问题
+ 此时car和Transportation共享一个原型对象，我们对Car原型添加的属性也会添加到Transportation上面
+ Car的构造函数指向的是Transportation的构造函数，这些都是不正确的。
如下所示：

```javascript

Car.prototype = Transportation.prototype;

Car.prototype.run = function(){
    console.log(`run:${this.name},${this.constructor.name}`);
};

let car = new Car('car');
let transportation = new Transportation('Transportation');

car.move(); //Transportation: car 会移动
car.run();//run:car,Transportation
transportation.run();//run:Transportation,Transportation
```

针对第一个问题，我们可以创建一个新对象，等于Transportation.prototype，把Car.prototype指向该对象,这里有很多种方式

```javascript
//1
// Object.create()方法使用现有对象作为新创建的对象的原型来创建新对象
Car.prototype = Object.create(Transportation.prototype);


//2
// 空函数F:
function F() {}
// 把F的原型指向Student.prototype:
F.prototype = Transportation.prototype;
// 把PrimaryStudent的原型指向一个新的F对象，F对象的原型正好指向Student.prototype:
Car.prototype = new F();
// 或者
// 需要先初始化
Car.prototype = new Transportation()


//3
//将指定对象的原型（即内部[[Prototype]]属性）设置为另一个对象或为null。
Object.setPrototypeOf(Car.prototype,Transportation.prototype)
//或者
Car.prototype = Object.setPrototypeOf({},Transportation.prototype)


//4
Car.prototype = {
    __proto__: Transportation.prototype
}


// 验证原型:
car.__proto__ === Car.prototype; // true
car.__proto__.__proto__ === Transportation.prototype; // true

// 验证继承关系:
car instanceof Car; // true
car instanceof Transportation; // true

```

针对第二个问题
```
Car.prototype.constructor = Car;
```

## tip
通过下面这种方式方法属性都可以使用，但是原型链不正确
```javascript
// new Car() ----> Car.prototype ----> Object.prototype ----> null

Car.prototype = Object.assign(Transportation,Transportation.prototype);

// 验证原型:
car.__proto__ === Car.prototype; // true
car.__proto__.__proto__ === Transportation.prototype; // false

// 验证继承关系:
car instanceof Car; // true
car instanceof Transportation; // false
```