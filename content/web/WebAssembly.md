---
title: "WebAssembly上手"
tags: ['Web','WebAssembly']
date: '2021-07-09'
---

# WebAssembly是什么

WebAssembly是为高效执行和紧凑表示而设计的运行在现代处理器（包括浏览器）中的一种快速、安全、可移植的底层代码格式，具有紧凑的二进制格式，可以以接近本机的性能运行。2019年12月5日W3C宣布WebAssembly核心规范成为正式标准。名字上可以知道是给Web使用的汇编语言。但是WebAssembly并不是直接用汇编语言，而提供了转换机制（LLVM IR），把高级别的语言（AssemblyScript、go、C、C++、Rust等）编译为WebAssembly，以便有机会通过Web浏览器执行低级二进制语法 。

# WebAssembl的特点

WebAssembly是一门不同于JavaScript的语言，它不是用来取代JavaScript的。相反，它被设计为和JavaScript一起协同工作，从而使得网络开发者能够利用两种语言的优势，通过使用WebAssembly的JavaScriptAPI，你可以把WebAssembly模块加载到一个JavaScript应用中并且在两者之间共享功能。这允许你在同一个应用中利用WebAssembly的性能以及JavaScript的表达力和灵活性，即使你可能并不知道如何编写WebAssembly代码。

- 快速：大幅度提高 Javascript 的性能，以接近本机的代码性能执行。
- 安全：代码经过验证并在内存安全沙盒环境中执行，可防止数据损坏或安全漏洞。
- 与语言无关：允许任何语言编译到WebAssembly， 可以用其他高级语言写网页。
- 与硬件无关：可以在所有现代体系结构，台式机或移动设备以及嵌入式系统上进行编译。
- 与平台无关：可以嵌入在浏览器中，作为独立VM运行或集成在其他环境中。
- 紧凑：具有比典型的文本或本机代码格式小的传输速度快的二进制格式。
- 模块化：程序可以分成较小的部分，可以分别传输，缓存和使用。
- 高效：可以通过快速一次通过来解码，验证和编译，等同于实时（JIT）或提前（AOT）编译。
- Streamable：允许在看到所有数据之前尽快开始解码，验证和编译。

# 为什么WebAssembly比JavaScript 执行效率更高

WebAssembly最吸引人的特点便是它的执行效率，比JavaScript执行效率更高主要有以下原因：

- 文件获取阶段：WebAssembly 比 JavaScript 抓取文件更快。即使 JavaScript 进行了压缩，WebAssembly 文件的体积也比 JavaScript 更小；
- 解析阶段：WebAssembly 的解码时间比 JavaScript 的解析时间更短；
- 编译和优化阶段：WebAssembly 更具优势，因为 WebAssembly 的代码更接近机器码，而 JavaScript 要先通过服务器端进行代码优化。
- 重优化阶段：WebAssembly 不会发生重优化现象。而 JS 引擎的优化假设则可能会发生“抛弃优化代码<->重优化”现象。
- 执行阶段：WebAssembly 更快是因为开发人员不需要懂太多的编译器技巧，而这在 JavaScript 中是需要的。WebAssembly 代码也更适合生成机器执行效率更高的指令。
- 垃圾回收阶段：WebAssembly 垃圾回收都是手动控制的，效率比自动回收更高。

# 如何使用WebAssembly

## 高级语言编译到 .wasm 文件

WebAssembly 字节码是一种抹平了不同 CPU 架构的机器码，WebAssembly 字节码不能直接在任何一种 CPU 架构上运行， 但由于非常接近机器码，可以非常快的被翻译为对应架构的机器码，因此 WebAssembly 运行速度和机器码接近，这听上去非常像 Java 字节码。 想要编译成WebAssembly，你首先需要先编译 LLVM，参考[webassembly.org.](http://webassembly.org.cn/getting-started/developers-guide/) LLVM可以实现

- LLVM IR 到不同 CPU 架构机器码的生成；
- 机器码编译时性能和大小优化。

LLVM实现了LLVM IR 到 WebAssembly 字节码的编译功能，也就是说只要高级语言能转换成 LLVM IR，就能被编译成 WebAssembly字节码，目前能编译成WebAssembly主要包括C、C++、Rust、Go、AssemblyScript（类似TypeScript）等。

对前端来说使用AssemblyScript是最为简单的办法，AssemblyScript和TypeScript有细微区别，为了方便编译成WebAssembly在TypeScript的基础上加了更严格的类型限制，AssemblyScript的实现原理其实也借助了LLVM，它通过TypeScript编译器把TS源码解析成AST，再把AST翻译成IR，再通过LLVM编译成WebAssembly字节码实现；与现有的Web生态系统集成-无需设置繁重的工具链。只需npm安装它，通过asc把assemblyscript编译为WebAssembly。

安装参考[assemblyscript](https://www.assemblyscript.org/quick-start.html)

```shell
npm init

npm install --save @assemblyscript/loader
npm install --save-dev assemblyscript

//创建推荐的目录结构和配置文件
npx asinit .

```

原始assemblyscript，导出一个获取第n个素数的函数

```js
/**
 * 判断一个数是否是素数
 * @param x 
 */
function isPrime(x: u32): bool {
  if (x < 2) {
    return false;
  }

  for (let i: u32 = 2; i < x; i++) {
    if (x % i === 0) {
      return false;
    }
  }

  return true;
}

/**
 * 获取第n个素数
 * @param x 
 */
export function getPrime(x: u32): number {
  let index: u32 = 0;

  let i: u32 = 2;
  do {
    if (isPrime(i)) {
      ++index;
    }
    ++i;
  } while (index !== x);

  return i - 1;
}

```

对应js代码

```js
/**
 * 判断一个数是否是素数
 * @param x 
 */
function isPrime(x) {
    if (x < 2) {
        return false;
    }
    for (let i = 2; i < x; i++) {
        if (x % i === 0) {
            return false;
        }
    }
    return true;
}


/**
 * 获取第n个素数
 * @param x 
 */
function getPrime(x) {
    let index = 0;
    let i = 2;
    do {
        if (isPrime(i)) {
            ++index;
        }
        ++i;
        env.console.log('hello')
    } while (index !== x);
    return i - 1;
}

```

编译成WebAssembly

```shell
asc assembly/index.ts -b build/optimized.wasm

```

## 浏览器中加载wasm模块到JavaScript

在[未来计划](http://webassembly.org.cn/docs/future-features/)中， WebAssembly模块可以使用 ES6 模块(使用`<script type="module">`)加载，WebAssembly 目前只能通过 JavaScript 来加载和编译。基础的加载，只需要3步： 1.获取 .wasm 二进制文件，将它转换成类型数组或者 ArrayBuffer 2.将二进制数据编译成一个 WebAssembly.Module 3.使用 imports 实例化这个 WebAssembly.Module，获取 exports

获取到WebAssembly实例后就可以通过JS去调用了。浏览器提供WebAssemblyAPI编译WebAssembly

- WebAssembly.compile() 编译WebAssembly二进制代码
- WebAssembly.compileStreaming() 从原始字节码编译WebAssembly二进制代码
- WebAssembly.instantiate() 允许你编译和实例化 WebAssembly 代码
- WebAssembly.instantiateStreaming()直接从流式底层源编译和实例化WebAssembly模块。这是加载wasm代码一种非常有效的优化方式

浏览器中编译获取WebAssembly实例

```js
(async () => {
    
    //包含一些想要导入到新创建Instance中值的对象，导入外部api供内部调用
    const importObject = {
        env: {
            abort(_msg, _file, line, column) {
                console.error("abort called at index.ts:" + line + ":" + column);
            },
            console: console
        },
    };
    const module = await WebAssembly.instantiateStreaming(
        fetch("./build/optimized.wasm"),
        importObject
    );
    
    //获取导出的模块
    module.instance.export.getPrime
})();

```

浏览器中js和webassembly计算素数效率对比，横轴是第n个素数，纵轴是计算所需时间（ms），从结果中我们可以看出可以看出webassembly的销量是明显高于js的,

> 效率对比并不固定，不同函数，不同功能会有差别
>
> ![js和webassembly计算素数效率对比](https://user-gold-cdn.xitu.io/2020/6/14/172b1f244327b0ce?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

# 不止于浏览器

WebAssembly 作为一种底层字节码，除了能在浏览器中运行外，还能在其它环境运行

## 直接执行 wasm 二进制文件

前面提到的 Binaryen 提供了在命令行中直接执行 wasm 二进制文件的工具，在 Mac 系统下通过 brew install binaryen 安装成功后，通过 wasm-shell f.wasm 文件即可直接运行

## node中加载wasm模块

目前 V8 JS 引擎已经添加了对 WebAssembly 的支持，V8 JS 引擎在运行 WebAssembly 时，WebAssembly 和 JS 是在同一个虚拟机中执行，而不是 WebAssembly 在一个单独的虚拟机中运行，这样方便实现 JS 和 WebAssembly 之间的相互调用，在 Nodejs 环境中运行 WebAssembly 的意义其实不大，原因在于 Nodejs 支持运行原生模块，而原生模块的性能比 WebAssembly 要好。 如果你是通过 C、Rust 去编写 WebAssembly，你可以直接编译成 Nodejs 可以调用的原生模块。

```js
const fs = require("fs");
const loader = require("@assemblyscript/loader");
module.exports = loader.instantiateSync(fs.readFileSync(__dirname + "/build/optimized.wasm"), { /* imports */ })

```

WebAssembly的设计初衷之一是为了解决JavaScript的性能问题，使得Web网页应用有接近本机原生应用的性能。作为一个通用、开放、高效的底层虚拟机抽象，众多编程语言（如C/C++,Rust,等）可以将现有应用编译成为WASM的目标代码，运行在浏览器中。这让应用开发技术与运行时技术解耦，极大促进了代码复用。

最后献上Docker创始人Solomon Hykes在WASI发布之际的一句Twitter

![img](https://user-gold-cdn.xitu.io/2020/6/14/172b206346be96ba?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
