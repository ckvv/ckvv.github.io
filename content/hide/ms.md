---
title: "前端开发面试题"
draft: true
date: '2024-07-21'
---

+ https://vue3js.cn/interview/
+ https://juejin.cn/post/7208005892313579576
+ https://juejin.cn/post/7343484473184698405
+ https://juejin.cn/post/7330065707358208010
+ https://www.nowcoder.com/exam/interview/81754024/test?paperId=50270010&jobs=%5B11201%5D&order=0
+ https://www.nowcoder.com/exam/interview/81754153/test?paperId=50270066&jobs=%5B11201%5D&order=0

# Vue

+ 响应式原理：track（依赖项跟踪）、trigger更新触发 <https://vuejs.org/guide/extras/reactivity-in-depth.html>
  - 劫持属性的读写, Vue 2 使用 `Object.defineProperty`  Vue 3 中则使用了 `Proxy` 来创建响应式对象，仅将 getter / setter 用于 ref(检测普通变量的访问或修改是行不通的),
  - 在访问时跟踪依赖(get:track)、在变更时触发副作用(set:trigger)
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
+ 插槽: 默认插槽、具名插槽（name）、条件插槽、动态插槽名、作用域插槽
+ 状态管理（vuex, pina）: state、getters、actions ｜ function
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
  - 当Vue实例化时，会遍历data对象中的每个属性，使用`Object.defineProperty`为每个属性设置getter和setter。
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
+ 当遇到错误时，如何有效地排查和解决 Vue3 中的问题: `控制台` `Vue开发者工具` `调试工具` 生命周期函数、`猜测 验证 猜测 逼近`
+ 虚拟滚动：仅仅渲染用户当前可见区域内的数据，而不是一次性渲染整个数据集，监听用户滚动事件，根据滚动位置动态地计算出哪些数据应该处于视窗内
+ vue 性能优化
  - 网络: gzip 、缓存
  - 体积优化: ES 模块格式的依赖, 按需引入、 代码分割，懒加载路由、现代的打包工具
  - 缓存: keep-alive、key、v-memo、v-once、props 尽量保持稳定、
  — 虚拟列表、减少大型不可变数据的响应性开销， 通过使用 shallowRef() 和 shallowReactive() 来绕开深度响应、避免不必要的组件抽象
  - 体验: css 动画、css 替代 JS
+ v-if和v-for的优先级是什么
  - v-for 优先 v-if 导致每次都会进行一次if判断
  - 在外层嵌套template（页面渲染不生成dom节点），在这一层进行v-if判断，然后在内部进行v-for循环
  - 通过计算属性computed提前过滤掉那些不需要显示的项
# CSS
+ @media、@layer、@scope、@keyframes、@import、@supports
+ 盒子模型：每个HTML元素看作是一个矩形的盒子，这个盒子由四个部分组成：内容区域（content）、内边距（padding）、边框（border）和外边距（margin）
  - content-box： `box-sizing: content-box` 元素的宽度和高度仅包括内容区域的尺寸，不包括内边距、边框和外边距
  - border-box： `box-sizing: border-box` 元素的宽度和高度包括内容区域、内边距和边框，但不包括外边距。
+ 行内元素
  - 默认情况下，行内元素不会开始新的一行，而是在一行中水平排列
  - 它们只占据它们实际的宽度，不会强制换行
  - 行内元素的宽度、高度、内边距和外边距（上下）都不可设置，只能通过CSS设置水平方向的间距（如左右内边距、外边距）。
+ 块元素
  - 块级元素会始终在新行上开始，并且会占据其父元素（容器）的整个宽度（除非设置了宽度属性）。
  - 可以设置宽度、高度、内边距和外边距等样式。
  - 块级元素可以包含行内元素和其他块级元素
+ display: block、inline、inline-block、flex、grid 和 none
+ position: 指定元素的定位方式
  - static:默认值，元素按照正常的文档流进行布局。top、right、bottom 和 left 属性不起作用
  - relative: 相对定位，元素相对于其正常位置进行偏移，但仍然占据原来的空间。偏移量由 top、right、bottom 和 left 属性指定。
  - absolute: 绝对定位，元素相对于最近的已定位（非static）祖先元素进行偏移，如果没有已定位的祖先元素，则相对于root进行定位。`脱离了文档流，不占据空间`
  - fixed: 固定定位，元素相对于视口（viewport）进行定位，即不论页面滚动与否，元素始终停留在相同位置。`脱离了文档流，不占据空间`
  - sticky: 粘性定位，根据用户的滚动位置在不同的位置切换定位类型（相对定位和固定定位的结合）。当元素在容器中可见时，表现为相对定位；当元素超出容器时，表现为固定定位。`脱离了文档流，不占据空间`
+ 弹性盒子: 一维布局模型，用于在物品之间分配空间，并包括许多对齐功能
  - `flex\flex-flow` `flex-direction` `flex-wrap` `justify-content` `align-items` `align-content`
  - `align-self` `flex-basis` `flex-grow` `flex-shrink` `order`
+ 网格:grid
  - grid-template-columns grid-template-rows  grid-template-areas justify-items align-items
  - grid-area grid-column-start grid-column-end grid-row-start grid-row-end
+ 浮动
  - 额外的清除元素 `"clear: both`
  - 伪元素 `::after { content: ""; display: block; clear: both;}`
  - 设置父容器的 overflow 属性为 auto 或 hidden 也可以清除浮动
  - Flex Grid
+ 动画
  - 触发方式：动画可以自动播放，不需要用户交互，也可以通过添加或移除类来触发。
  - 复杂性：适用于更复杂的动画效果，可以定义多个关键帧。
  - 定义方式：使用 @keyframes 规则定义关键帧序列。
  - 动画属性：animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, + animation-play-state
```css
@keyframes fadeinout {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

div {
  animation: fadeinout 3s infinite;
}
```
+ CSS 过渡（Transitions）
  - 触发方式：过渡是由某个事件触发的，如鼠标悬停、聚焦、点击等。
  - 简单性：适合用于简单的状态变化，如颜色、位置、透明度等。
  - 定义方式：只需定义开始状态和结束状态，浏览器会自动计算中间帧。
  - 过渡属性：transition-property, transition-duration, transition-timing-function, transition-delay
```css
.element {
  width: 100px;
  height: 100px;
  background-color: blue;
  transition: width 2s, height 2s, background-color 2s;
}

.element:hover {
  width: 200px;
  height: 200px;
  background-color: red;
}
```
+ 伪类：用于选择那些无法用常规选择器选择的元素状态，比如元素的特定状态或元素在文档树中的特定位置。`:hover` `:focus` `:nth-child(n)` `:first-child` `:last-child` `:not(selector)`
+ 伪元素: 伪元素用于选择和样式化元素的一部分或插入新的元素。这些通常是通过双冒号 :: 来表示 `::before` `::after` `::first-letter` `::first-line` `::selection`
+ 元素选择器
+ 响应式布局: media query、flexbox、grid、rem 适配
+ div 居中
  - 使用 line-height 居中单行文本
  - 使用 text-align 居中内联或内联块元素
  - 使用 margin: auto 居中块级元素
  - flex: justify-content \ align-items
  - grid: place-items
+ css兼容: `@supports, flex 替换 grid`
+ 什么是BEM（Block Element Modifier）命名规范
```html
<!-- 通过将类名分成块（Block）(定义一个独立的实体或组件，表示功能和内容的最外层容器)、元素（Element）(表示块的组成部分，描述块内部的某个部分。)和修饰符（Modifier）(描述块或元素的外观、状态或行为的变化。)三部分，来构建组件的样式。旨在提高代码的可读性和可维护性 -->
<nav class="menu">
    <h1 class="menu__title">Site Navigation</h1>
    <ul class="menu__list">
        <li class="menu__item menu__item--active">Home</li>
        <li class="menu__item">About</li>
        <li class="menu__item">Services</li>
        <li class="menu__item">Contact</li>
    </ul>
</nav>
```
# JS
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
+ 内置类型函数: Awaited、Partial、Record、Pick、Parameters、ConstructorParameters、ReturnType、InstanceType
+ interface、type 区别: 都可以用来表示接口，即定义对象或者函数
  - 都可以实现继承: interface 可以 extends type可以通过交叉类型（&）
  - type 可以声明基本类别名，即可以为原始类型重命名，而 interface 不可以。例如：`type A = number`
  - type 可以定义元组类型，而 interface 不可以。例如：`type A = [number, string]`
  - type 可以使用交叉类型和联合类型，而 interface 不可以。例如：`type A = A1 | A2 / type B = B1 & B2`
  - type 可以通过 typeof 获取实例的类型进行赋值定义，而 interface 不可以。例如：`type A = typeof obj / type A = keyof obj`
  - interface 可以重复定义会进行声明合并，而 type 不可以。例如：`interface A { name: string }  interface A { get: string }`

# 前端
+ 网络性能优化: 文件最小化（文件压缩、按需加载、路由懒加载、模块化代码）、CDN、缓存
+ 代码性能优化: 缓存(keep-live、key、shallowref、算法缓存)、虚拟列表、动画效果、代码切片、
+ cookies，sessionStorage 和 localStorage 的区别
+ link和@import有什么区别: `<link>: 引入外部资源，如样式表、字体文件  不会阻塞页面渲染  兼容性良好` `@import: 在 CSS 文件中引入其他样式表  CSS 文件解析时才会加载资源，会阻塞页面的渲染  兼容性较差`
+ HTTP缓存
  - Last-Modified 和 If-Modified-Since：主要依赖于文件的最后修改时间，适合静态文件或者没有实体标签（如哈希值）的资源。
  - ETag 和 If-None-Match：通过唯一的实体标签（ETag），可以更精确地判断资源的变化，适合于动态生成的内容或者需要精确验证的场景。
  - Cache-Control : `Cache-Control: max-age=3600`
  - 资源未更新: HTTP/1.1 304 Not Modified
+ websocket：单个 TCP 连接上进行全双工通信的协议
+ 跨域: 同源策略是浏览器的安全机制，它限制了来自不同源的脚本如何与页面进行交互，以防止潜在的安全风险。
  - 协议号-域名-端口 都相同的地址，浏览器才认为是同源， 这意味着，如果一个网页包含的脚本试图跨域请求其他源的资源，浏览器会阻止这个请求。
  - 设置响应头、后端代理、jsonp
- 服务器通过设置 HTTP 头来明确允许哪些域访问资源`Access-Control-Allow-Origin` `Access-Control-Allow-Methods`
+ DOM 操作
+ 那些操作会造成内存泄漏: 忘记释放动态分配的内存、循环引用、未正确关闭资源（事件监听器）、全局变量的滥用、缓存使用不当、
+ 如何解决内存泄漏:
  - 未使用var、let或const声明变量，使变量被意外地声明为全局变量，从而无法被垃圾回收机制回收
  - 闭包中的变量引用外部作用域中的变量，导致外部变量无法被回收。
  - 在JavaScript中持有对DOM元素的引用，导致这些元素无法被垃圾回收。
  - 使用clearInterval或clearTimeout清除定时器，并确保回调函数中未持有对不必要的外部变量的引用
  - 内存中的对象积累，特别是在没有适当的清理机制时。
  - 事件监听器未能正确移除，导致其引用的对象无法被回收
+ 事件循环
+ 前端安全相关
  - XSS（跨站脚本攻击）：攻击者将恶意脚本代码注入到正常的网页中。从而获取用户的敏感信息、篡改网页内容、进行恶意操作等， `输入验证与过滤` `输出转义` `Cookie 设置为 HttpOnly，防止通过 JavaScript 访问和修改` `配置 CSP 规则`
  - CSRF（跨站请求伪造）: B 页面中包含了对A (已登录)请求。浏览器会自动带上这些凭证执行转账请求 `验证请求来源` `双重认证(二次密码)` `请求唯一token` `SameSite Cookie `
  - SQL 注入: 输入验证
  - HTTPS: 保障前端数据在传输过程中的安全性
+ Content Security Policy（内容安全策略）: 防止跨站脚本（XSS）和数据注入等。通过发送一个 CSP 头部，告诉浏览器哪些资源是被授权执行的，哪些是需要被禁止的，实质是一种白名单制度。
  - 设置 HTTP 响应头： Content-Security-Policy: policy
  - HTML 标签`<meta>`: `<meta http-equiv="content-security-policy" content="default-src 'elf'; img-src *; child-src 'none';"/>`
+ 列举一些常见的前端加密算法及其应用场景
  - 对称加密：加密和解密使用相同的密钥
  - 非对称加密：加密和解密使用不同的密钥，其中公钥可以公开，私钥需要保密
  - 哈希算法：将任意长度的输入转换为固定长度的输出，
# http
+ HTTP/0.9:
  - 最初版本，只支持GET方法，没有Header等结构。
  - 仅支持HTML文档。
+ HTTP/1.0:
  - 支持多种HTTP方法，如GET、POST、HEAD。
  - 引入了Header字段，允许传递元数据。
  - 每次请求/响应需要建立新的TCP连接，没有持久连接。
  - 不支持请求管道（pipelining）和部分内容传输（range request）。
+ HTTP/1.1:
  - 引入了持久连接（Keep-Alive），允许多个请求/响应在同一个连接上处理，减少了连接建立的开销。
  - 支持请求管道（pipelining），可以同时发送多个请求，提升了性能。
  - 引入了Host头部字段，支持虚拟主机的多个网站共享同一个IP地址。
  - 引入了缓存控制（Cache-Control）等新的头部字段，支持更细粒度的缓存策略。
+ HTTP/2:
  - 引入了二进制协议，数据以二进制格式传输，替代了HTTP/1.x的文本格式，减少了传输的头部数据大小。
  - 多路复用（Multiplexing），允许在同一个连接上并行发送多个请求和响应，解决了队头阻塞问题，提升了性能。
  - 头部压缩（Header Compression），进一步减少了传输的头部数据大小，降低了网络流量。
  - 服务器推送（Server Push），服务器可以在客户端请求之前主动推送资源，加速页面加载。
  - 支持优先级（Priority）和流控制（Flow Control），更精确地管理数据流，提升了传输效率和质量。
+ HTTP/3:
  - 使用QUIC作为传输层协议，基于UDP，集成了TCP和TLS的功能，减少了连接建立和断开的成本，提高了网络传输的效率。
  - 改善了传输性能，降低了延迟，特别适合高延迟和带宽变化的网络环境。
  - 通过快速握手和快速重传等机制增强了安全性和可靠性。
  - 支持多路复用和流量控制，提高了并发传输能力和网络利用率。
+ TCP:（HTTP、HTTPS、FTP、SSH、SMTP） TCP是一种面向连接的协议，提供可靠的数据传输。它通过三次握手建立连接，确保数据的顺序和完整性，并在传输过程中进行错误检测和重传。
  - 适合于对数据可靠性要求较高、对数据顺序要求较高的应用，如文件传输、网络通信等。
+ UDP:（DNS、TFTP） UDP是一种无连接的协议，数据传输不保证可靠性，不进行连接的建立和维护。它仅提供数据的最小封装和转发，不保证数据的到达顺序或完整性。
  - 适合于实时性要求高、对数据完整性要求较低的应用，如音频/视频流传输、在线游戏、实时通信等。
+ TCP vs UDP 比较
  - 可靠性：TCP提供可靠的数据传输，确保数据到达且无差错；UDP则不保证数据的可靠性。
  - 连接性：TCP是面向连接的，通信前需要建立连接；UDP是无连接的，通信时不需要先建立连接。
  - 效率：UDP比TCP更高效，因为它不需要建立连接和维护状态，适合实时数据传输。
  - 应用场景：根据应用需求选择TCP或UDP，如需可靠传输和顺序性选择TCP，如需实时性和效率选择UDP
  - 流量控制和拥塞控制： TCP：具有流量控制和拥塞控制机制，可以根据网络条件调整数据传输速率，避免网络拥堵。UDP：不提供流量控制和拥塞控制机制，发送方的发送速率不会根据网络条件进行调整。
+ 三次握手（建立链接）和四次挥手（断开链接）:（TCP协议保证可靠传输的重要机制，确保了双方都能安全、有序地建立、关闭连接，并释放资源）
+ http 状态码
  - 1xx（信息性状态码）: 100 客户端应该继续其请求。 101 服务器已理解请求的方法，即将切换到新的协议
  - 2xx（成功状态码): 200 OK
  - 3xx（重定向状态码）: 301 请求的资源已被永久移动到新位置。 302 请求的资源现在临时从不同的URI响应请求。 304 资源未被修改，可以使用缓存的版本。
  - 4xx（客户端错误状态码）: 400 服务器无法理解请求的语法 401 请求要求用户的身份认证。 403 服务器拒绝请求。 404 请求的资源不存在。
  - 5xx（服务器错误状态码）: 500 : 服务器遇到错误   502  服务器作为网关或代理，从上游服务器收到无效响应  503 服务器目前无法处理请求（过载或维护）。
+ 五层网络模型
  - 物理层：定义了物理介质上的数据传输方式，如电缆、光纤等
  - 数据链路层：负责在直接连接的两个设备之间传输数据帧，处理物理层的传输错误。
  - 网络层：处理数据包在网络中的路由和转发，负责确定数据包的最佳路径到达目的地。主要协议包括 IP（Internet Protocol），用于标识网络中的每个设备及其位置。
  - 传输层：提供端到端的数据传输服务，包括数据的分段、流量控制和错误恢复。主要协议有 TCP 和 UDP。
  - 应用层：定义了不同应用程序之间的通信规则和数据交换方式 HTTP HTTPS DNS SSH
# jQuery 简化复杂的DOM操作和跨浏览器兼容性问题
+ 选择器引擎
+ DOM操作封装
+ 事件处理
+ 动画效果
+ Ajax请求
+ 动画效果
+ 工具函数
+ 链式调用
# React
## hooks
+ useState: 向组件添加一个 状态变量
+ useEffect
+ useReducer
+ useRef: 改变 ref 不会触发重新渲染
+ useImperativeHandle: 自定义由 ref 暴露出来的句柄
+ useContext: 组件树深层传递数据
+ useMemo:
+ useCallback
+ useInsertionEffect
+ useLayoutEffect: 在浏览器重新绘制屏幕之前触发
+ useTransition
+ useSyncExternalStore
+ useId
+ useDebugValue
+ useDeferredValue
## 组件
+ Suspense
+ StrictMode
+ Profiler
+ Fragment
## API
+ memo
+ lazy
+ forwardRef: 允许组件使用 ref 将 DOM 节点暴露给父组件
+ createContext: 创建组件能够提供与读取的 上下文

# 设计模式: 计模式是对软件设计中普遍存在的各种问题所提出的解决方案
+ 常用的: `单例模式` `适配器模式` `装饰器模式` `外观模式` `享元模式` `组合模式` `策略模式` `迭代器模式`
+ 创建型模式：用于解决与对象创建情况相关的常见问题
  - 单例模式 (Singleton Pattern)：确保一个类只有一个实例，并提供一个全局访问点。
  - 工厂方法模式 (Factory Method Pattern)：定义一个用于创建对象的接口，让子类决定实例化哪一个类。（如果你只需要创建一类产品的不同变体）
  - 抽象工厂模式 (Abstract Factory Pattern)：提供一个创建一系列相关或依赖对象的接口，而无需指定它们具体的类。（创建多个相关产品的组合（如产品家族））
  - 建造者模式 (Builder Pattern)：将一个复杂对象的构建与其表示分离，使得同样的构建过程可以创建不同的表示。
  - 原型模式 (Prototype Pattern)：通过复制现有实例来创建新的对象，而不是直接实例化类。
+ 结构型模式：何将类和对象组合在一起形成更大的结构，以便获得更大的灵活性和效率
  - 适配器模式 (Adapter Pattern)：将一个类的接口转换成客户期望的另一个接口，使得原本因接口不兼容而不能一起工作的类可以一起工作。
  - 装饰器模式 (Decorator Pattern)：动态地给一个对象添加一些额外的职责，就增加功能来说，装饰器模式比生成子类更为灵活。
  - 代理模式 (Proxy Pattern)：为其他对象提供一种代理以控制对这个对象的访问。
  - 外观模式 (Facade Pattern)：为子系统中的一组接口提供一个一致的接口，使得子系统更容易使用。
  - 桥接模式 (Bridge Pattern)：将抽象部分与它的实现部分分离，使它们都可以独立地变化。
  - 组合模式 (Composite Pattern)：将对象组合成树形结构以表示“部分-整体”的层次结构，使得客户对单个对象和组合对象的使用具有一致性。
  - 享元模式 (Flyweight Pattern)：运用共享技术有效地支持大量细粒度的对象。
+ 行为型模式：关注对象之间的相互作用和职责分配。这些模式通过定义类或对象之间的通信方式，帮助程序员构建更清晰和高效的系统。行为型模式通常涉及算法的封装、责任链的建立、对象的协作等。
  - 策略模式 (Strategy Pattern)：定义一系列算法，把它们一个个封装起来，并且使它们可以互相替换。
  - 观察者模式 (Observer Pattern)：定义对象间的一种一对多的依赖关系，当一个对象的状态发生变化时，所有依赖于它的对象都得到通知并被自动更新。
  - 命令模式 (Command Pattern)：将一个请求封装成一个对象，从而使你可以用不同的请求对客户进行参数化。
  - 状态模式 (State Pattern)：允许对象在内部状态改变时改变它的行为，对象看起来似乎修改了它的类。
  - 责任链模式 (Chain of Responsibility Pattern)：避免请求发送者与多个请求处理者之间的耦合，使多个处理者都有机会处理请求。这些处理者被连接成一条链，并沿着这条链传递请求，直到有一个处理者处理它为止。
  - 解释器模式 (Interpreter Pattern)：给定一个语言，定义它的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中的句子。
  - 中介者模式 (Mediator Pattern)：用一个中介对象来封装一系列对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散。
  - 迭代器模式 (Iterator Pattern)：提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。
  - 模板方法模式 (Template Method Pattern)：定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。
  - 访问者模式 (Visitor Pattern)：表示一个作用于某对象结构中的各元素的操作，使得可以在不改变各元素类的前提下定义作用于这些元素的新操作。

# 设计模式是为了解决什么问题
+ 代码复用:
  - 经常需要重复实现类似的功能或逻辑，这会导致代码重复，增加维护成本
  - 单例模式: 确保类只有一个实例，并提供全局访问点，避免了重复创建对象的需求
+ 灵活性和扩展性
  - 需求变更时，如果软件设计不够灵活，往往需要修改现有代码，这会增加风险并降低系统的稳定性。
  - 策略模式: 允许在运行时动态选择和切换算法或策略，满足不同需求的变化
+ 复杂性管理
  - 随着系统功能的增加，代码的复杂性也会增加，导致难以理解、维护和扩展。通过将系统划分为多个小的、具有明确职责的组件来管理复杂性。
  - 组合模式: 允许将对象组合成树形结构以表示部分-整体层次结构，简化了复杂结构的处理。
+ 模块解耦
  - 模块之间的强耦合使得系统难以修改和扩展，因为对一个模块的更改可能会影响其他模块。设计模式通过定义清晰的接口和协议来解耦模块之间的依赖。
  - 观察者模式: 允许对象之间以一种松散耦合的方式进行通信和通知，当一个对象的状态改变时，它会通知所有依赖于它的对象。
+ 对象创建
  - 对象的创建过程可能会很复杂，特别是当需要配置对象的多个属性或依赖时, 设计模式提供了灵活的对象创建机制来简化对象的创建过程。
  - 工厂模式: 将对象的创建过程封装在工厂类中，使得客户端代码不需要直接创建对象，从而简化了对象的创建和管理。
+ 封装变化
  - 系统中经常会发生变化，这些变化可能会影响到系统的各个部分，导致系统的不稳定。设计模式通过封装变化来减少影响。
  - 模板方法模式: 定义了算法的骨架，将算法的一些步骤延迟到子类中实现，从而使得算法的变化不会影响到算法的整体结构。
+ 代码一致性和标准化
  - 团队中不同的开发人员可能会用不同的方式解决相同的问题，导致代码风格和结构的不一致。
  - 设计模式提供了标准化的解决方案，使得团队成员能够按照统一的设计原则来实现功能，提高了代码的一致性和可维护性
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
      await new Promise((resolve) => {
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
+ pipe
+ Node.js 中创建子进程
+ 进程间通信（IPC）在 Node.js 中的实现方式: `child_process: fork、exec、spawn` `worker_threads: parentPort.postMessage、worker.on('message', (msg) => msg)` `文件和数据库`
+ buffer
+ 事件循环机制
- 事件循环允许Node.js执行非阻塞 I/O 操作（尽管默认情况下使用单个 JavaScript 线程），方法是尽可能将操作卸载到系统内核。
- 由于大多数现代内核都是多线程的，因此它们可以处理在后台执行的多个操作。当其中一个操作完成时，内核会通知Node.js，以便将适当的回调添加到轮询队列中，以便最终执行
+ Node.js 的非阻塞 I/O 模型
  - 当Node.js执行 I/O 操作时，例如从网络读取、访问数据库或文件系统，而不是阻塞线程并浪费 CPU 周期等待，Node.js将在响应返回时恢复操作。
+ nextTick: 事件循环继续进行之前运行其回调
+ setImmediate: 事件循环的下一次迭代或“滴答”时触发
# redis
+ 数据结构、用途
  - String（字符串）: 缓存简单的键值对数据，例如：用户会话信息、页面内容缓存
  - Hash（哈希）键值对: 存储对象的属性和字段，例如：用户信息（id, name, email）。
  - List（列表）:使用 LPUSH 和 RPOP 实现简单的队列。
  - Set（集合）: 去重、存储不重复的元素集合，例如：标签、用户角色。
  - Sorted Set（有序集合）: 实现排行榜功能，例如：按得分排序的游戏排行榜。
  - HyperLogLog
  - Bitmaps
  - Geospatial index（地理空间索引）: 存储地理位置数据，进行地理位置范围查询。
+ 消息队列
+ 持久化
# Kafka
