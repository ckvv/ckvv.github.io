---
title: "pi 的 codemode：把工具调用写成一段脚本"
tags: ["AI", "Agent", "Sandbox", "WebAssembly"]
date: "2026/10/25"
description: "pi 的 codemode 让模型写一段 JavaScript 在 QuickJS 沙箱里运行，脚本里调用其他工具。本文讲清三件事：模型看到的是什么、一次脚本执行的完整链路、以及为什么必须用 worker + wasm 而不是 node:vm。"
---

工具调用的粒度是一轮一个。这个粒度对"读一个文件"很合适，对"读 20 个文件、统计每个文件里的 TODO、按目录聚合"就很糟糕：20 次往返，20 份文件内容原样进上下文，最后模型只用到了一个数字。

pi 的 `codemode` 换了个粒度：模型写一段 JavaScript，在沙箱里跑，脚本里调用其他工具。**只有脚本的输出回到模型上下文**，中间那 20 份文件内容不进 transcript。

```js
const files = (await tools.bash({ command: "git ls-files '*.ts'" })).output.split("\n").filter(Boolean);
const results = await Promise.allSettled(
  files.slice(0, 200).map((path) => tools.read({ path })),
);
const counts = {};
for (const [i, result] of results.entries()) {
  if (result.status !== "fulfilled") continue;
  const n = (String(result.value).match(/TODO/g) ?? []).length;
  if (n > 0) counts[files[i]] = n;
}
return counts;
```

模型看到的结果大概是 `Script completed / Wall time 3.4 seconds / Output: / {"src/agent-loop.ts":2,...}`。上下文里没有文件内容，只有聚合后的几十个字节。

这个工具默认不开，要显式启用：`pi --tools +codemode`，或者在 settings 的 `defaultTools` 里加 `"+codemode"`。

下面按"模型看到什么 → 一次执行怎么走 → 为什么这么实现"讲。

## 一、模型看到的是两个东西

### 一个字符串参数

```ts
// packages/coding-agent/src/extensions/codemode/tool.ts
export const codemodeSchema = Type.Object({
  code: Type.String({ description: "Raw JavaScript source." }),
});
```

输入是原始 JS 文本，不是 JSON、不是 markdown 代码块。它被当成 `async` 函数体执行，所以顶层 `await` 和 `return` 都能用。

对支持语法约束采样的 provider（OpenAI 系），这里还挂了一份 Lark grammar。有意思的是这份 grammar 非常宽松：

```
start: options_source | plain_source
options_source: OPTIONS_LINE NEWLINE SOURCE
plain_source: SOURCE
SOURCE: /[\s\S]+/
```

它只约束"可能有一行 `// @options:`"这个形状，脚本内容本身 `[\s\S]+`。原因很实际：grammar 是用来压住"模型把代码塞进 JSON 字符串里疯狂转义"这个失败模式的，不是来解析 JavaScript 的。真正的校验在 host 侧 `parseCodemodeSource()`：`@options` 必须在第一行，出现在别处直接整次调用失败（否则会被静默忽略）；未知字段、非安全整数都报错。

```js
// @options: {"max_output_tokens": 2000, "timeout_ms": 60000}
```

### 一份动态生成的工具声明

`codemode` 自己的 description 是在激活时按当前 loadout 生成的，每个可调工具占一段：一个 `### \`bash\`` 标题、工具描述、以及一句 TypeScript 声明。声明那段长这样（简化）：

```ts
declare const tools: {
  bash(args: { command: string; timeout?: number }): Promise<{
    output: string; truncated: boolean; full_output_path?: string;
    exit_code: number; wall_time_seconds: number;
  }>;
  read(args: { path: string; offset?: number; limit?: number }): Promise<
    string | { type: "image"; data: string; mimeType: string; note: string }
  >;
};
```

这里有个容易忽略的取舍：**工具段落的数量是有预算的**。默认 3000 token（`codemode.inlineBudget`，按 4 字符 ≈ 1 token 估），装不下的工具就不列。分配算法是每轮让每个组（无命名空间的工具先，然后按命名空间排序）放它最便宜的一个，某组装不下就退出这轮，其他组继续。效果是"每个 MCP server 至少有一个代表被列出来，再逐步补全"，而不是让一个 server 吃满全部预算。

`deferred` exposure 的工具（默认配置下的 MCP 工具）永远不列。因此 MCP server 慢半拍连上来时，`codemode` 的 description 一个字节都不变——这一条和 [tool_search](/blog/ai/pi-tool-search) 是同一个动机：描述稳定，前缀缓存才稳。

还有 `codemode.mode` 这个开关：

- `on`（默认）：其他工具照常声明，它们的描述里加一句"脚本里用 `tools.x(args)` 这样调"。
- `only`：直接工具对模型隐藏，只在 `codemode` 的 description 里出现。模型只能通过脚本用它们。

## 二、脚本里有什么

| 全局 | 用途 |
| --- | --- |
| `tools.<name>(args)` | 调工具，名字里非法标识符的字符变成 `_`（`mcp__dev-radius__search` → `tools.mcp__dev_radius__search`） |
| `text(v)` / `image(v)` / `return v` | 产出输出项，按顺序回到模型 |
| `console.log(...)` | 收进结果末尾的一个 `<console_output>` 块 |
| `store(k, v)` / `load(k)` | 跨调用保留小 JSON 值 |
| `ALL_TOOLS` / `searchTools(q)` / `describeTool(n)` / `describeNamespace(n)` | 找没列出来的工具 |
| `models.*` | 跑 classifier 和图像模型（不是 chat 模型） |

调用结果按工具能力分两种：声明了 `outputSchema` 的返回结构化值（`bash` 返回 `{ output, truncated, full_output_path?, exit_code, wall_time_seconds }`，非零退出码也一样），其他工具返回文本。失败、被拦、参数非法都 reject 一个带错误文本的 `Error`，所以并行时用 `Promise.allSettled()`。

一个细节值得单独说：脚本里拿到的 `bash` 输出**不是**模型看到的那份。模型侧限 2000 行 / 50KB，脚本里最多 1 MiB，超了保留首尾各 512 KiB 加一个省略标记，完整输出写文件并在 `full_output_path` 里给路径。脚本不需要"给模型看的摘要"，它需要能处理的数据。

## 三、一次执行怎么走

```
模型
 └─ tool_call(codemode, { code })
     └─ parseCodemodeSource：取 @options，校验首行
     └─ reserveCodemodeWorker：排队拿槽位（全进程 2 个）
     └─ new Worker(workerData: code, tools, globals, storeJson, wasm)
         └─ QuickJS.create → eval prelude → eval `(async (tools, console) => { <code> })`
             └─ 脚本调 tools.bash → bridge("call", id, "bash", argsJson)
                 └─ postMessage({ type: "call", ... }) → host
                     └─ ctx.executeTool("bash", args)   ← 正常工具管线
                 └─ postMessage({ type: "result", id, payload }) → worker
             └─ settle(id, ok, payload) → Promise resolve，脚本继续
             └─ bridge("done", ok, valueJson, writesJson)
     └─ 格式化输出 → "Script completed / Wall time ... / Output: ..."
```

关键点在中间那一层：**嵌套调用不是重新实现一遍工具，而是调 `ctx.executeTool()`**。也就是说参数校验、`tool_call` / `tool_result` 钩子、权限检查、输出截断，全都和直接调用完全一样。脚本拿到的只是结果。

还有一个只有在这种设计下才需要的细节：脚本里可能调到的 MCP 工具所在的 server 也许还没连上。`reachesTools(input)` 用脚本文本里的词去猜它会碰哪些工具——出现 `searchTools`、`describeTool`、`ALL_TOOLS` 就直接返回 `"all"`，否则取源码里的所有 `\w+` 单词——然后 MCP 扩展只等这几个 server，而不是全部。

代价也要说清楚：`edit`、`write`、`bash` 这些调用是**真的生效**，脚本中途失败不会回滚之前已经执行完的调用。失败结果里会补一句 `Tool calls made before the failure (they are not undone): bash (ok), read (error)`。

最后一步是收尾和格式化，逻辑都在 `executeCodemode()` 里，按顺序：

1. 仍未完成的嵌套调用标成 `cancelled`（脚本结束时还挂着的调用会被 abort）。
2. 多个文本项时每项加 `==> text N/M <==` 前缀——因为 provider 会把相邻文本块直接拼起来，不加分隔符模型分不清边界。
3. `console.*` 单独收尾成一个 `<console_output>` 块。
4. 超过 `max_output_tokens`（默认 10000）就保留首尾截断，全文写临时文件并把路径给模型，和 bash 的截断策略一致。
5. 每张图片写临时文件，在图片前插一条 `[Image saved to /tmp/... (image/png, 24.1 KB)]`。脚本不能写文件，`write` 工具又只收文本，这是模型唯一能拿到图片字节的途径。

## 四、为什么是 QuickJS + worker

这是整套东西里最没有替代品的部分，值得展开。

### 不用 `node:vm`

`node:vm` 不是安全边界：同一个 realm，`this.constructor.constructor('return process')()` 就出去了。而 codemode 的威胁模型很明确——**模型写的代码不可信**。所以要的是"没有任何能力"的环境：没有 `require`，没有 `fetch`，没有文件系统，没有 timer。QuickJS 编译成 wasm 跑，脚本能碰到的东西就只有 prelude 注入的那几个全局。

### 必须放 worker，不能放主线程

QuickJS 是同步解释执行的。一个 `while (true) {}` 跑在主线程上，主线程的事件循环就停了：deadline 的 `setTimeout` 不会触发，abort signal 不会触发，TUI 也不刷新。所以每个执行起一个 `node:worker_threads` worker，跑飞了直接 `terminate()`。

`InlineCodemodeSandbox` 是例外，给没有 worker 的运行时用（Cloudflare Workers、浏览器、以及 `RemoteCodemodeSandbox` 的服务端）。它换了个限制手段：**中断预算**。QuickJS 执行期间会周期性轮询 interrupt handler，inline launcher 数这些轮询，超过 `DEFAULT_INTERRUPT_BUDGET = 100_000` 就中断。

按实测（源码注释里的数字，2026 年 10 月）：紧凑循环在 Apple M 系列笔记本上大约每秒 5 万次轮询，在 Cloudflare Durable Objects 上大约每秒 1 万次。所以 10 万次预算 ≈ 2 到 10 秒的连续计算。这个预算必须远低于平台的 CPU 上限，因为撞上平台上限是**重置**一个 Durable Object，而不是让一个脚本失败。

### 每个脚本一个新的 worker 和 VM

不复用。理由是可终止性：复用意味着"跑飞的脚本留下的脏状态要清"，而 `terminate()` 之后这个 worker 里的一切都不可信。新建的成本被 wasm 编译结果的结构化克隆摊掉了——`WebAssembly.Module` 在 worker 之间是共享代码的。

代价是槽位。默认整个 pi 进程最多 2 个 codemode worker（`PI_CODEMODE_MAX_WORKERS` 可改），排队先到先得，60 秒拿不到就失败。这条限制是给"被取消的 worker 还在退出"留的余量：碰到不轮询中断标志的内建函数时，worker 会活得比结果久，源码注释里对应一个 Bun 的 issue。

### 中止要靠一个共享标志位

这里有个非常具体的坑：Bun 的 `worker.terminate()` 停不下一个正在 wasm 里自旋的线程。所以 host 的 `stop()` 做两件事，顺序不能换：

```ts
Atomics.store(new Int32Array(interrupt), 0, 1);  // 先置位，VM 的 interruptHandler 会看到
void worker.terminate().catch(() => undefined);  // 再请求终止，但不 await
worker.unref();
```

标志位放在 `SharedArrayBuffer` 里，通过 `workerData` 传进去，VM 用 `Atomics.load` 轮询。`stop()` 故意不等 worker 真正退出——结果是先返回的，槽位在 `exit` 事件里才释放。

### 死等能被立刻判定

VM 里没有 timer、没有 I/O，所以"脚本还没结束，但没有任何 pending 的工具调用"只有一个含义：它在等一个永远不会 settle 的 Promise。`stalled()` 就干这个，直接把脚本判失败并给出原因。这条规则让 `await new Promise(() => {})` 这种错误立刻暴露，而不是拖到 timeout。

顺带一个相关的实现细节：`executePendingJobs()` 会把队列跑到空、中途无法中断，所以驱动 job 队列用的是内部导出 `qjs_execute_pending_job()`，每 50 个 job 轮询一次中断。否则 `while (true) await null` 每次只执行几个字节码，靠 opcode 计数轮询的中断机制要很久才会被看到。

## 五、bridge 只有 JSON 字符串

host 和 VM 之间只传字符串：

```ts
// worker → host
{ type: "call", id: 1, target: "tool", name: "read", args: '{"path":"a.ts"}' }
{ type: "output", item: { type: "text", text: "..." } }
{ type: "done", ok: true, value: '{"a.ts":2}', writes: '[["cursor","3"]]' }
// host → worker
{ type: "result", id: 1, ok: true, payload: '"file contents..."' }
```

为什么不上结构化值？因为 QuickJS 的 `JSValueHandle` 有生命周期和作用域，跨线程传要序列化，而 prelude 里本来就要 `JSON.parse` 一次才能给脚本用。干脆两端都只碰字符串，worker 侧完全不构造结构化数据。

这带来一个有意思的攻击面，以及对应的防御。**prelude 和脚本共享内置对象**。如果脚本写下：

```js
Array.prototype.toJSON = () => "garbage";
```

prelude 后续 `JSON.stringify` 上报的数据就会全部变成 `"garbage"`。两端都做了处理：

- prelude 第一件事是 lockdown：从 `globalThis` 出发 BFS 遍历所有可达对象和函数，逐个 `Object.freeze`，并把内建全局改成不可写不可配置。为了不让"override mistake"（原型上的只读数据属性会导致子类赋值抛错）破坏正常代码，`constructor`、`name`、`message`、`toString`、`toJSON` 这类常被覆盖的属性被改写成访问器，setter 在实例上定义自有属性。
- host 侧 `parseBridgeJson()` 解码失败就抛一个专门的 `BridgeError`，然后整次执行以 `Sandbox bridge broken: ... The script may have modified built-ins such as a prototype's toJSON` 失败。

宁可失败，也不接受被脚本篡改过的上报数据。

## 六、`store()` 写在会话里，不是写在内存里

`store(key, value)` / `load(key)` 看起来像个 Map，但落点不在沙箱里：脚本成功后，写入被追加成一条 `codemode-store` custom entry；下次调用时，host 从**当前分支**回放这些 entry 得到快照，再随 `workerData` 传进 VM。

这么绕是为了正确性和 `/tree` 的语义对齐：resume、fork、切换分支之后，脚本看到的值必须和这条分支的历史一致。如果放在进程内存里，换个分支就会看到别人的 cursor。限制也很直接：单值最多 256 KiB JSON，总共 1 MiB，超过报错并提示删 key。

## 七、`models`

脚本还能跑非 chat 模型：`models.classify()` 做分类，`models.generateImages()` 生成图片。有两个防御性细节：

**只认 `provider` + `id`。** 脚本传进来的对象里就算带了 `baseUrl`、`headers`，也一律丢掉，host 用这两个字段去 registry 查已配置的模型。否则模型可以写个脚本，让 pi 把带凭证的请求发到任意地址。同理，`getModelOfType()` 返回给脚本的 catalog entry 会 `delete info.headers`。

**并发 4，usage 计入成本。** 不然一个 `Promise.all` 打 500 条分类请求出去。这些调用的 usage 会汇总到 `codemode` 这一条 tool result 上，算进会话费用。生成图片还有一个贴心提示：如果脚本生成过图片却一次都没调 `image()`，结果末尾会追加一行"你有 N 张图没给模型看"。

## 八、代价和边界

- **写脚本比填空容易犯错**。语法错误、忘 `await`、用 `fetch`、用 `setTimeout`，都属于模型侧的常见失败。前几类有明确的错误信息（`tools.readFile does not exist. Did you mean tools.read?` 这种来自 prelude 里的 Proxy guard），但调试体验仍然不如单次 tool call。
- **并行受工具本身的并发限制**。`Promise.all` 200 次 `read` 是真的同时发 200 个文件读取；`Promise.all` 200 次 `bash` 会真的起 200 个 shell。
- **worker 是全局稀缺资源**。2 个槽位、60 秒等待，跨所有会话共享。如果某个进程内的 subagent 自己用 codemode，而外层脚本正等着它，就可能互相等槽位。这是当前设计的硬边界，不是配置问题。
- **输出上限是 host 内存保护**。16 MiB 文本或 10 万条 `text()` / `image()` / `console` 之后脚本直接失败，因为 host 在脚本结束前一直攒着这些输出。
- **沙箱只管"脚本本身没有能力"**。脚本能做的事，全是注入给它的工具能做的事。所以权限仍然落在工具层——把 `bash` 给脚本和把 `bash` 给模型没有区别。
- **对缓存友好**。codemode 不改 active set、不改工具声明，脚本里调 `deferred` 工具也不会往 transcript 里加声明。所以它的前缀缓存代价是零，这和 `tool_search` 的设计目标一致。

## 九、顺带一提：确定性重放

`CodemodeSandboxBase.start()` 是另一套入口，不执行工具，而是把每个调用交给 caller，caller 用 `deliver(seq, now, id, outcome)` 自己回结果。为了让"同样的输入产生同样的行为"成立，它固定了：

- 时钟：WASI 的时钟读虚拟时间，`startedAt` 起步，之后只会因为 `deliver()` 传进来的 `now` 前进，绝不后退。
- 随机数：`random_get` 走 seed 派生的 PRNG。有个细节——QuickJS 会用第一次时钟读数去 seed `Math.random()`，所以 context 创建期间的读数用 seed 派生值，否则"哪个时钟先被读"这种引擎内部实现细节会影响结果。
- 时区：UTC。
- GC：`WeakRef` 和 `FinalizationRegistry` 都不存在。
- 顺序：结果带 `seq`，严格按序应用，早到的先缓存。
- 指纹：脚本运行前先上报一个 `quickjs-wasi` 版本 + prelude 哈希 + 各项限制组成的 fingerprint，replay 可以拒绝在不同的 VM 上重放。

`packages/durable` 用它做 checkpoint：脚本在等 200 个 read 的时候进程重启，重启后从 journal 里把之前的结果按原顺序喂回去，脚本继续跑到 live 状态。这是"脚本是 VM 里的瞬时状态"这个问题唯一干净的解法——把脚本变成可重放的。

## 小结

`codemode` 的对外形态是一个工具、一个字符串参数。真正的工作量在三件看不见的事上：

1. **执行环境**。模型写的代码不可信，所以要 wasm 级隔离、要 worker 隔离同步执行、要一个能在 wasm 自旋时生效的中断标志。这些都不是"顺手做的加固"，而是"不做就不能上线"。
2. **能力边界**。脚本能做的只有工具能做的。所以嵌套调用老老实实走 `ctx.executeTool()`，权限、钩子、截断全部复用；而 `models.*` 则反过来收窄——只认 provider 和 id，绝不让脚本决定请求发往哪里。
3. **结果收敛**。只有脚本的输出进上下文，于是输出格式化、截断落盘、图片落盘、console 分块、token 预算这些"管道末端的杂活"，反而决定了这个工具实际好不好用。

## 代码地图

- `packages/coding-agent/src/extensions/codemode/tool.ts`：schema、description 生成、工具段落预算、loadout/mode
- `packages/coding-agent/src/extensions/codemode/execute.ts`：一次执行的全流程、worker 槽位、输出格式化、`store` 回放、`models.*`
- `packages/coding-agent/src/extensions/mcp/index.ts`：`tool_call` 钩子消费 `reachesTools`，只等脚本点名的那几个 server
- `packages/codemode/src/source.ts`：`// @options:` 解析与 Lark grammar
- `packages/codemode/src/runtime/execution.ts`：host 侧生命周期、工具表、deadline/abort
- `packages/codemode/src/runtime/vm.ts`：QuickJS 启动、确定性模式的 WASI 时钟与 PRNG、fingerprint
- `packages/codemode/src/runtime/prelude-source.ts`：VM 内的 `tools` / `text` / `image` / `store` / `stalled`，以及 lockdown
- `packages/codemode/src/runtime/host.ts`、`worker.ts`、`protocol.ts`：worker 启动与消息协议
- `packages/codemode/src/runtime/inline.ts`、`remote.ts`、`cloudflare.ts`：无 worker 运行时的等价实现
- `packages/durable/src/codemode/codemode.ts`：基于确定性重放的 checkpoint

## 参考

- pi 源码：<https://github.com/earendil-works/pi>
- pi 文档：`docs/codemode.md`、`docs/cli.md#enable-codemode`、`docs/models.md#use-classifier-models`
- QuickJS：<https://bellard.org/quickjs/>
- `quickjs-wasi`：<https://www.npmjs.com/package/quickjs-wasi>
