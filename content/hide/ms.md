---
title: "前端开发面试题"
draft: true
date: '2024-07-21'
---

https://vue3js.cn/interview/
# Vue 
+ https://juejin.cn/post/7208005892313579576
+ https://juejin.cn/post/7343484473184698405
+ 响应式原理：track（依赖项跟踪）、trigger更新触发 <https://vuejs.org/guide/extras/reactivity-in-depth.html>
+ 内置组件: Transition TransitionGroup KeepAlive Teleport Suspense
+ 内置指令: v-text v-html v-show v-if v-else v-else-if v-for v-on v-bind v-model v-slot v-pre v-once v-memo v-cloak
+ 自定义指令:
  - (el, binding) => {}, 在 `mounted` 和 `updated` 时都调用
  - el(指令绑定到的元素。这可以用于直接操作 DOM), binding(value,oldValue,arg,modifiers,instance,dir), vnode(绑定元素的底层 VNode)
  - created 在绑定元素的 attribute 前 或事件监听器应用前调用
  - beforeMount 在元素被插入到 DOM 前调用
  - mounted 在绑定元素的父组件 及他自己的所有子节点都挂载完成后调用
  - beforeUpdate 绑定元素的父组件更新前调用
  - updated 在绑定元素的父组件及他自己的所有子节点都更新后调用
  - beforeUnmount 绑定元素的父组件卸载前调用
  - unmounted 绑定元素的父组件卸载后调用
+ 插件: 拥有 install() 方法的对象，也可以直接是一个安装函数本身, `全局组件或自定义指令` `provide` `全局实例属性或方法`
+ 组合式 API: `响应式 API` `生命周期钩子` `依赖注入`
+ 组件封装经验
+ 路由
+ 插槽
+ 状态管理（vuex, pina）
+ Vue 2、Vue 3: TS代码、代码拆分、组合 API、响应式、生命周期、API 增加、减少、编译优化、
+ nextTick: nextTick通过将回调函数添加到异步任务队列中，下次 DOM 更新循环结束之后执行延迟回调
+ 核心: ref、computed、reactive、readonly、watchEffect、watchPostEffect、watchSyncEffect、watch
+ 工具函数: isRef、unref、toRef、toValue、toRefs、isProxy、isReactive、isReadonly
+ 高级: shallowRef、triggerRef、customRef、shallowReactive、shallowReadonly、toRaw、markRaw、effectScope、getCurrentScope、onScopeDispose
+ 生命周期: 每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤，比如设置好数据侦听，编译模板，挂载实例到 DOM，以及在数据改变时更新 DOM。在此过程中，它也会运行被称为生命周期钩子的函数，让开发者有机会在特定阶段运行自己的代码。 beforeCreate, created, onBeforeMount、onMounted、onBeforeUpdate、onUpdated、onBeforeUnmount、onUnmounted、onActivated、onDeactivated、onErrorCaptured、onRenderTracked、onRenderTriggered、onServerPrefetch
+ provide、inject、hasInjectionContext: 将父组件的 provides 对象设置到当前组件实例的 provides 属性的原型对象
+ mixin、extends
+ 双向数据绑定原理
  - 在访问时跟踪依赖、在变更时触发副作用的
  - 当Vue实例化时，会遍历data对象中的每个属性，使用Object.defineProperty为每个属性设置getter和setter。
  - 在模板中，如果使用了数据绑定（例如{{ message }}），Vue会生成一个Watcher对象，将其与对应的DOM元素关联起来。
  - 当数据发生变化时，setter被调用，通知Watcher对象更新视图。
  - 当用户与视图交互，如输入表单元素时，Vue会监听DOM事件，然后通过setter更新数据，从而实现数据模型到视图的同步更新。
  - 当一个对象被包装为响应式对象时，Vue会使用Proxy来代理这个对象，拦截对该对象的读取（get）和修改（set）操作
+ 虚拟 DOM: 高效\灵活：
  - DOM 通过数据结构“虚拟”地表示出来，保存在内存中，然后将真实的 DOM 与之保持同步
  - 运行时渲染器将会遍历整个虚拟 DOM 树，并据此构建真实的 DOM 树。这个过程被称为挂载 (mount)
  - 如果我们有两份虚拟 DOM 树，渲染器将会有比较地遍历它们，找出它们之间的区别，应用到真实的 DOM 上。这个过程被称为更新 (patch)，又被称为“比对”(diffing) 或“协调”(reconciliation)
+ diff函数
- 第⼀个是相同的前置与后置元素的预处理
- 最长递增子序列
+ Vue 组件挂载
  - 编译：Vue 模板被编译为渲染函数：即用来返回虚拟 DOM 树的函数。这一步骤可以通过构建步骤提前完成，也可以通过使用运行时编译器即时完成。
  - 挂载：运行时渲染器调用渲染函数，遍历返回的虚拟 DOM 树，并基于它创建实际的 DOM 节点。这一步会作为响应式副作用执行，因此它会追踪其中所用到的所有响应式依赖。
  - 更新：当一个依赖发生变化后，副作用会重新运行，这时候会创建一个更新后的虚拟 DOM 树。运行时渲染器遍历这棵新树，将它与旧树进行比较，然后将必要的更新应用到真实 DOM 上去。
+ vue 编译优化: `静态提升` `更新类型标记` `树结构打平`
+ 如何实现组件之间的通信: props、事件、ref实例、$parent、$children、Provide 与 Inject、EventBus、Vuex|pina
+ Vue 3 中的动画是如何实现的？
  - Vue 提供了 <Transition> 和 <TransitionGroup> 组件来处理元素进入、离开和列表顺序变化的过渡效果
  - 动态添加 CSS class 来触发动画
  - 动态地给元素绑定样式
  - 基于侦听器的动画
+ Transition 触发条件
  - 由 v-if 所触发的切换
  - 由 v-show 所触发的切换
  - 由特殊元素 <component> 切换的动态组件
  - 改变特殊的 key 属性
+ Transition 实现原理
  - Vue 会自动检测目标元素是否应用了 CSS 过渡或动画。如果是，则一些 CSS 过渡 class 会在适当的时机被添加和移除。
  - 如果有作为监听器的 JavaScript 钩子，这些钩子函数会在适当时机被调用。
  - 如果没有探测到 CSS 过渡或动画、也没有提供 JavaScript 钩子，那么 DOM 的插入、删除操作将在浏览器的下一个动画帧后执行。
  - `v-enter-fro`m`：进入动画的起始状态。在元素插入之前添加，在元素插入完成后的下一帧移除。
  - `v-enter-active`：进入动画的生效状态。应用于整个进入动画阶段。在元素被插入之前添加，在过渡或动画完成之后移除。这个 class 可以被用来定义进入动画的持续时间、延迟与速度曲线类型。
  - `v-enter-to`：进入动画的结束状态。在元素插入完成后的下一帧被添加 (也就是 v-enter-from 被移除的同时)，在过渡或动画完成之后移除。
  - `v-leave-from`：离开动画的起始状态。在离开过渡效果被触发时立即添加，在一帧后被移除。
  - `v-leave-active`：离开动画的生效状态。应用于整个离开动画阶段。在离开过渡效果被触发时立即添加，在过渡或动画完成之后移除。这个 class 可以被用来定义离开动画的持续时间、延迟与速度曲线类型。
  - `v-leave-to`：离开动画的结束状态。在一个离开动画被触发后的下一帧被添加 (也就是 v-leave-from 被移除的同时)，在过渡或动画完成之后移除。
+ ref vs reactive: `有限的值类型` `不能替换整个对象` `对解构操作不友好`
+ vue vs react
  - Hooks 有严格的调用顺序，并不可以写在条件分支中
  - setup代码仅调用一次,组合式 API 也并不限制调用顺序
  - Vue 的响应性系统运行时会自动收集计算属性和侦听器的依赖，因此无需手动声明依赖。
  - 无需手动缓存回调函数来避免不必要的组件更新
# CSS

+ @media、@layer、@scope、@keyframes、@import、@supports
+ box-sizing: content-box|border-box
+ 盒子模型
+ 弹性盒子:flex
+ 网格:grid
+ 浮动
+ 定位: display
+ 动画
+ 伪类、伪元素
+ 元素选择器
+ 响应式布局: media query、flexbox、grid、rem 适配
+ div 居中
+ css兼容: `@supports, flex 替换 grid`

# JS

+ https://juejin.cn/post/7330065707358208010
+ this: 指一段代码运行的上下文
  - JavaScript 中的值 this 取决于函数的调用方式（运行时绑定），当常规函数作为对象 （ obj.method() ） 的方法被调用时， this 指向该对象
  - 独立函数（未附加到对象： func() ） this 调用时，通常引用全局对象（在非严格模式下）或 undefined （在严格模式下）。
  - bind可以创建其 this 绑定不更改的函数
  - apply、call可以设置特定调用的 this 值
  - 箭头函数没有自己的 this，它会捕获其所在上下文（父作用域继承）的 this 值。此行为使箭头函数对于回调和保留上下文特别有用, 全局代码中，this 总是 globalThis 与严格程度无关
  - 构造函数: this 都会绑定到正在构造的新对象
+ 箭头函数与普通函数有什么区别
  - 语法简洁性
  - 箭头函数没有自己的 this，它会捕获其所在上下文（父作用域继承）的 this 值。此行为使箭头函数对于回调和保留上下文特别有用
  - 箭头函数没有自己的 arguments 对象
  - 箭头函数不能用作构造函数，不能通过 new 关键字调用。
+ ES6 Module和CommonJS模块区别
+ Reflect&Proxy
+ Objek.defineProperty
+ class 类
+ 原型链
+ 闭包
+ Promise
+ Generator
+ 迭代、异步迭代
+ 正则
+ WebWorker

# TypeScript

+ 泛型
+ 内置类型函数
+ interface、type 区别

# 前端
+ 网络性能优化: 文件最小化（文件压缩、按需加载、路由懒加载、模块化代码）、CDN、缓存
+ 代码性能优化: 缓存(keep-live、key、shallowref、算法缓存)、虚拟列表、动画效果、代码切片、
+ cookies，sessionStorage 和 localStorage 的区别
+ link和@import有什么区别
+ HTTP: `状态码`
+ HTTP缓存
  - Last-Modified 和 If-Modified-Since：主要依赖于文件的最后修改时间，适合静态文件或者没有实体标签（如哈希值）的资源。
  - ETag 和 If-None-Match：通过唯一的实体标签（ETag），可以更精确地判断资源的变化，适合于动态生成的内容或者需要精确验证的场景。
  - Cache-Control : `Cache-Control: max-age=3600`
  - 资源未更新: HTTP/1.1 304 Not Modified
+ websocket
+ 跨域: 同源策略是浏览器的安全机制，它限制了来自不同源的脚本如何与页面进行交互，以防止潜在的安全风险。
- 服务器通过设置 HTTP 头来明确允许哪些域访问资源`Access-Control-Allow-Origin` `Access-Control-Allow-Methods` 
+ DOM 操作
+ 那些操作会造成内存泄漏: 
+ 如何解决内存泄漏:
  - 未使用var、let或const声明变量，使变量被意外地声明为全局变量，从而无法被垃圾回收机制回收
  - 闭包中的变量引用外部作用域中的变量，导致外部变量无法被回收。
  - 在JavaScript中持有对DOM元素的引用，导致这些元素无法被垃圾回收。
  - 使用clearInterval或clearTimeout清除定时器，并确保回调函数中未持有对不必要的外部变量的引用
  - 内存中的对象积累，特别是在没有适当的清理机制时。
  - 事件监听器未能正确移除，导致其引用的对象无法被回收
+ 前端安全相关
+ 事件循环

# jQuery
+ JQuery的源码看过吗？能不能简单概况一下它的实现原理？
# React
# 设计模式
+ 创建型模式
  - 单例模式 (Singleton Pattern)：确保一个类只有一个实例，并提供一个全局访问点。
  - 工厂方法模式 (Factory Method Pattern)：定义一个用于创建对象的接口，让子类决定实例化哪一个类。
  - 抽象工厂模式 (Abstract Factory Pattern)：提供一个创建一系列相关或依赖对象的接口，而无需指定它们具体的类。
  - 建造者模式 (Builder Pattern)：将一个复杂对象的构建与其表示分离，使得同样的构建过程可以创建不同的表示。
  - 原型模式 (Prototype Pattern)：通过复制现有实例来创建新的对象，而不是直接实例化类。
+ 结构型模式
  - 适配器模式 (Adapter Pattern)：将一个类的接口转换成客户期望的另一个接口，使得原本因接口不兼容而不能一起工作的类可以一起工作。
  - 装饰器模式 (Decorator Pattern)：动态地给一个对象添加一些额外的职责，就增加功能来说，装饰器模式比生成子类更为灵活。
  - 代理模式 (Proxy Pattern)：为其他对象提供一种代理以控制对这个对象的访问。
  - 外观模式 (Facade Pattern)：为子系统中的一组接口提供一个一致的接口，使得子系统更容易使用。
  - 桥接模式 (Bridge Pattern)：将抽象部分与它的实现部分分离，使它们都可以独立地变化。
  - 组合模式 (Composite Pattern)：将对象组合成树形结构以表示“部分-整体”的层次结构，使得客户对单个对象和组合对象的使用具有一致性。
  - 享元模式 (Flyweight Pattern)：运用共享技术有效地支持大量细粒度的对象。
+ 行为型模式
  - 策略模式 (Strategy Pattern)：定义一系列算法，把它们一个个封装起来，并且使它们可以互相替换。
  - 观察者模式 (Observer Pattern)：定义对象间的一种一对多的依赖关系，当一个对象的状态发生变化时，所有依赖于它的对象都得到通知并被自动更新。
  - 命令模式 (Command Pattern)：将一个请求封装成一个对象，从而使你可以用不同的请求对客户进行参数化。
  - 状态模式 (State Pattern)：允许对象在内部状态改变时改变它的行为，对象看起来似乎修改了它的类。
  - 责任链模式 (Chain of Responsibility Pattern)：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系。
  - 解释器模式 (Interpreter Pattern)：给定一个语言，定义它的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中的句子。
  - 中介者模式 (Mediator Pattern)：用一个中介对象来封装一系列对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散。
  - 迭代器模式 (Iterator Pattern)：提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。
  - 模板方法模式 (Template Method Pattern)：定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。
  - 访问者模式 (Visitor Pattern)：表示一个作用于某对象结构中的各元素的操作，使得可以在不改变各元素类的前提下定义作用于这些元素的新操作。
# 算法
+ 排序: 快排、冒泡
+ 二叉树遍历: 广度、深度
+ 动态规划: 斐波那契
# 其他
+ Vue Vapor: 不依赖于虚拟 DOM，而是更多地利用 Vue 的内置响应性系统
+ 最新的装饰器语法
+ node 原生测试
+ react
+ vite 插件
+ rspack、Vite6(Rolldown)
# 项目经验
+ SSP(供应方平台)
+ 绩效营销SaaS平台
+ 极海云平台
+ 评估系统（观影、游戏任务、问卷系统）
## 角色权限
+ 角色: 业务经理、UI、Affiliate（联盟成员）、广告主、运营
+ 前端：路由（meta、）、组件
+ 后端：中间件获取角色类型、装饰器注入允许的权限到路由中
## API 设计
+ 授权机制: cookie、jwt、token
+ 命名规范和响应格式、错误码、编写文档
+ 监控 API 的性能、使用情况和错误，以便及时发现和解决问题。
+ 调用频率、IP白名单
## 日志管理
+ 错误拦截器、中间件访问日志
+ 日志收集、分析、存储、展示
## 业务预警
+ 按照小时、天等设置点击量、收入、转化率等设置预警值
+ 定时任务，系统自动发送钉钉、url、短信通知等
## 实时数据分析
+ Kafka、redis、WebSocket 事件
+ 按天、小时计算入库
+ 查询缓存
+ echart（折线图、饼图）、表格(条件、维度、指标)
## 文件上传: 异步调度器、分块上传、断点续传、并行上传、文件 HASH、文件预览(按需加载)
```js
class Scheduler {
    constructor() {
        this.awaitArr = [];
        this.count = 0;
    }
    async add(promiseCreator) {
        if (this.count >= 2) {
            await new Promise(resolve => {
                this.awaitArr.push(resolve);
            });
        }
        this.count++;
        const res = await promiseCreator();
        this.count--;

        if (this.awaitArr.length) {
            this.awaitArr.shift()();
        }
        return res;
    }
}
```
## 数据隔离与安全
+ 单一数据库，共享架构
  - 表中添加一个租户ID（Tenant ID），并在查询时进行过滤，来实现数据隔离。
  - 创建一个中间件来处理每个请求的租户ID。这通常通过请求头中的信息来识别租户。
  - Sequelize 的 scopes 可以用于在模型中预定义查询条件。
+ 其他方案
  - 每个租户使用一个单独的数据库实例。这种方法需要动态创建和管理 Sequelize 实例。
  - 为每个租户创建一个独立的架构（Schema）。每个租户的数据保存在其专属的架构中。

# nginx
+ 如何优化 Nginx 以处理更多的并发请求
  - 增加 worker_processes 和 worker_connections。
  - 使用 keepalive_timeout 减少 TCP 连接开销。
  - 使用 gzip 压缩响应内容。
  - 日志级别优化 延迟、buffer
  - nginx 缓存
  - 负载均衡
  - 合理配置缓冲区大小
  - 简化处理路径，减少资源竞争的可能性
  - Nginx 支持多种事件模型，主要有 epoll、kqueue、eventport 和 select 等，每种模型在不同的操作系统上有不同的支持和表现。
+ 反向代理
+ 正向代理
+ 缓存
+ 负载均衡：轮询、最少链接、IP Hash、权重
+ root 和 alias 区别
  - root：用于设置相对路径，结合 location 的 URI 使用
  - alias：直接使用指定的路径，不结合 location 的 URI。

```shell
upstream backend {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
}
```
# node
+ stream
+ 多线程
# redis
+ 数据结构、用途
+ 消息队列
+ 持久化
# Kafka