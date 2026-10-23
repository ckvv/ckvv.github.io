---
title: "pi 的 tool_search：按需加载工具，以及它为什么能保住 prompt cache"
tags: ["AI", "Agent", "Tool"]
date: "2026/10/23"
description: "拆解 pi 的 tool_search 实现：注册与声明分离、BM25 检索、把工具变更写成 transcript 日志，以及三种 provider 表达方式如何让缓存前缀不被重写。"
---

接一个大型 MCP server 之后，第一个撞上的问题往往不是模型不会用工具，而是工具太多：几十上百个 tool schema 全塞进请求，上下文被吃掉一大块，模型选错工具的概率上升，而且只要工具列表在请求之间发生变化，前缀缓存就整体失效。

pi 的做法是**按需加载**：工具照常注册，但先不声明给模型；模型用自然语言查询，把命中的工具"取"回来，从下一次请求开始直接调用。

这篇文章拆一下它的实现，以及更值得说清楚的一半：为什么这样做不会反复打断 prompt cache。

## tool_search 是什么

`tool_search` 是 pi 的一个内置扩展工具，默认不激活，需要时用 `--tools`、`defaultTools: ["+tool_search"]` 显式打开，或者由 MCP 扩展在连上 `deferred` 类型的 server 时自动激活。

代码量不大，全在 `packages/coding-agent/src/extensions/tool-search/tool.ts`，注册在 `index.ts`。输入是 `query` 和可选的 `limit`（默认 8），输出是加载了哪些工具的文本摘要。

典型链路：

```
模型: tool_call(tool_search, { query: "create issue" })
执行: BM25 检索未声明的工具 → 命中 mcp__github__create_issue → 加入 active set
结果: "Loaded 1 tool. They are available from your next call: ..."
下一轮请求: 工具列表里多了 mcp__github__create_issue，模型直接调用
```

## 前提：注册和声明是两件事

不看这个分层，后面所有设计都会显得绕。

- **注册（registered）**：工具在注册表里，可以执行。MCP server 一连上就把 `mcp__github__list_issues` 之类全部注册。
- **声明（declared / active）**：工具的 JSON Schema 进入请求的 tools 字段，模型才知道它存在。
- **`exposure`** 决定两者关系：`direct` 注册即声明；`model-only` 声明但不可被其他工具调用；`codemode` / `deferred` 注册但不声明；`hidden` 完全不可达。

`deferred` 的语义就是：注册了，但等 `tool_search` 把它捞出来，模型之后直接调用。它和 `codemode` 的区别只是 codemode 会把它列在 codemode 工具的描述里，而 `deferred` 刻意不列。

第二个前提更重要：**会话记录不是"消息数组 + 一个可变的 system prompt"**，而是一串增量日志。

```ts
interface SystemMessage {
  role: "system";
  content: string | TextContent[];
  sections?: Record<string, string | null>;   // 命名 section 的补丁
  toolsAdded?: Tool[];                        // 从此刻起可用的工具
  toolsRemoved?: ToolReference[];             // 从此刻起不可用的工具
  timestamp: number;
}
```

头部的 system message 带初始 prompt 和初始工具；后面每条 system message 只带差异。`getCurrentTools(messages)` 按顺序重放所有 system message，就得到"当前应该声明给模型的工具集"（`packages/ai/src/utils/transcript.ts`）。

整套缓存策略都建立在这个结构上：**变更被记成"某处追加了一条日志"，而不是"重写头部"**。

## 实现拆解

### 注册：默认不激活，声明它会触及所有工具

```ts
pi.registerTool({
  ...createToolSearchToolDefinition({ tools: pi }),
  defaultActive: false,
});
```

工具定义里有三个关键字段：

- `exposure: "model-only"`：只给模型看，codemode 脚本不该调用它。
- `reachesTools: () => "all"`：声明"我这次调用可能碰到任何工具"。
- `defaultActive: false`：注册但不激活。

`reachesTools` 是为"工具还没注册全"准备的。MCP server 是后台连接的，如果模型在 server 还没连上时就搜索，会得到空结果。所以 MCP 扩展在 `tool_call` 钩子里读 `reachesTools`，看到 `"all"` 就等所有 server 连接就绪再放行执行（`packages/coding-agent/src/extensions/mcp/index.ts`）。同一套机制也让 `codemode` 只等待脚本里点名的那几个 server，而不是全部。

### 检索：候选集、文档、BM25

```ts
function searchAndLoad(tools, query, limit) {
  const active = tools.getActiveTools();
  const candidates = tools.getAllTools().filter(
    (tool) => isSearchable(tool.exposure) && !active.includes(tool.name),
  );
  const documents = candidates.map((tool) => createToolSearchDocument(tool, tool.namespace));
  const matches = new Bm25Ranker().rank(query, documents, limit);
  if (matches.length > 0) tools.setActiveTools([...active, ...matches.map((m) => m.name)]);
  return matches;
}
```

候选集只包含 `codemode` / `deferred` 且尚未激活的工具。已经声明的工具搜不到，避免重复声明，也避免"搜出来了但什么也没变"的噪声。

**索引什么内容**比排序算法更影响效果。`createToolSearchDocument()` 拼接的是：

- 工具名，以及把 `_` 换成空格的名字；
- `description`；
- 参数 schema 里每一层的 `description` 和属性名，递归 `properties`、`items`、`anyOf`、`oneOf`、`allOf`；
- 所属 namespace 的 `name`、`description`、`instructions`。

所以 `mcp__github__list_issues` 能被 `closed`、`state` 这类参数级词汇命中；`kubernetes` 这类只出现在 server 描述里的词也能命中。测试里专门覆盖了这几点。

**排序**是标准 Okapi BM25，`k1 = 1.2`、`b = 0.75`，IDF 用 `log(1 + (N - df + 0.5) / (df + 0.5))`，按分数降序取前 `limit` 条。分词器做 camelCase 和 snake_case 拆分、小写化、去停用词，以及很粗的单复数归一：

```
listIssues for the GitHub_repo  →  ["list", "issue", "git", "hub", "repo"]
searches queries HTTPServer     →  ["search", "query", "http", "server"]
```

没有同义词表，也没有向量检索。代码里留了扩展点（`ToolRanker` 接口，注释写着 "BM25 today; a hybrid ranker with embeddings can replace it"），但目前就是这个水平。测试里也明确承认了局限：搜 `tickets` 找不到 `issues`。

这个 ranker 不只服务于 `tool_search`，codemode 脚本里的 `searchTools()` 用的也是同一份实现，两个入口的检索行为因此保持一致。

### 激活：从 active set 到模型真正看见

`setActiveTools()` 只是改 active set。真正把声明写进会话的是 agent loop。每次请求前，它会 diff「transcript 说模型已经知道什么」和「现在能执行什么」：

```ts
// packages/agent/src/agent-loop.ts
const changes = getToolStateChanges(
  getCurrentTools([...context.messages, ...baseline]),
  (context.tools ?? []).map(toToolDeclaration),
);
if (unchanged) return pendingMessages;
const update = withToolChanges({ role: "system", content: "", timestamp: Date.now() }, changes);
```

于是会话里多了一条 `{ role: "system", content: "", toolsAdded: [...] }`。一次完整的 trace：

```
turn N:   model → toolCall(tool_search, { query: "create issue" })
          execute → 排序 → setActiveTools(...) → 可执行集合立刻更新
          toolResult("Loaded 1 tool ...") 写入 transcript
          declareToolChanges → 追加 [system: toolsAdded=[mcp__github__create_issue]]
turn N+1: 请求携带这条声明，模型可以调用它
```

因为这是日志而不是状态重写，所以加载结果天然可重放：`/tree`、resume、fork、compaction 之后，重放 system message 就能还原该分支的工具集。对于"日志里声明了但 server 还没连上"的工具，还有一个 pending 集合兜底：注册完成就激活。

## 缓存为什么不会被反复打断

现在说重点。prompt cache 的命中条件很朴素：**请求前缀必须逐字节相同**。所以判断标准只有一条——新增内容是否只出现在已缓存前缀之后。

### 第一层：请求头是常量

头部有三个部分可能变，pi 都刻意保持稳定。

**system prompt**：leading system message 只在会话开始时创建一次。之后 prompt 的变化通过 `diffSystemPromptSections()` 计算补丁，只把**变化的 section** 作为新 system message 追加，head 不动。

**tools 数组**：head 里只有初始工具。后续加载的工具不以"改数组"的方式出现（见下一层）。

**tool_search 的 description**：完全静态。

```ts
export const TOOL_SEARCH_DESCRIPTION =
  `# Tool discovery\n\nSearches over deferred tool metadata with BM25 and exposes
matching tools for the next model call.\n\nSome of the tools ... always use
\`tool_search\`.`;
```

它不列可搜工具名、不列数量、不列 server。这不是偷懒，是必需的：如果描述里写着"可加载 github、linear 的工具"，那么 MCP server 一连上或一断开，tools 数组就变了——**模型还没调用任何工具，缓存就废了**。

pi 的 CHANGELOG 记录过这次修复（issue #10212）：`codemode` 描述去掉了工具数、deferred 工具列表和 server 指令，`tool_search` 描述去掉了 server 列表；服务器信息改放到名为 `mcp_servers` 的 prompt section 里，而 section 变化同样是"追加一条 system message"，不是重写头部。

顺带解释了另外两个看起来奇怪的约束：`mcp_servers` section 限长 4096 字符、单条 server 描述限 250 字符——都是为了让它作为一段可控的、可追加的文本存在，而不是变成头部的一部分。

### 第二层：把新增工具锚定在"加载点"

头部不变还不够，工具总得让模型看见。pi 按 provider 能力分成三种表达方式（`TranscriptToolSupport`）。

#### changes：Anthropic 原生工具变更

条件：模型同时支持中途 system message 和原生工具变更，并且至少有一个初始工具。

```ts
params.tools = [
  ...convertToolDefinitions(initialTools, toolCacheControl),
  DEFERRED_TOOL_PLACEHOLDER,
];
```

**顶层 tools 从第一次请求起就固定，之后永远不动**。新工具以 `tool_addition` block 出现在 transcript 里那条 system message 的位置（beta `inline-tools-2026-09-15`）：

```ts
blocks.push({ type: "tool_removal", tool: { type: "tool_reference", name } });
blocks.push({ type: "tool_addition", tool: { type: "tool_definition", definition } });
```

同名 `tool_addition` 就是重定义，所以"改工具描述"也不需要动头部。`cache_control` 断点放在 system 和最后一个初始工具上，都落在那个不变的前缀里。

这里有个非常具体的坑，代码注释里写了实测结论：

```ts
/**
 * Stable deferred tool declared whenever native tool changes are in use.
 * Anthropic adds hidden prompt scaffolding for mid-conversation tool changes;
 * declaring this placeholder from the first request keeps that scaffolding in
 * the cached prefix, so the first tool change does not invalidate the cache
 * (measured: full miss without it).
 */
const DEFERRED_TOOL_PLACEHOLDER: BetaTool = {
  name: "__pi_deferred_placeholder__",
  description: "Reserved placeholder. Never available. Never call this.",
  input_schema: { type: "object", properties: {}, required: [] },
  defer_loading: true,
};
```

Anthropic 只要检测到"mid-conversation tool changes"就会在 prompt 里插入隐藏脚手架。如果第一次请求里一个 deferred 工具都没有，脚手架不会出现；等第一次加载工具时才出现，那次请求的前缀整体变了，full cache miss。所以 pi 从第一个请求就声明一个模型看不见的占位符，把这个脚手架提前固化进缓存。

#### additions：OpenAI Responses

`additional_tools` 输入项是可累积的：后来的项可以新增工具、覆盖同名定义，但不能改顶层工具，也不能删除。于是 pi 干脆不发送顶层 tools 字段，所有工具都在输入开头的 `additional_tools` 项里，后续新增在各自位置追加。

对只支持 `supportsToolSearch` 的模型，则模拟 Codex 的客户端 tool search 协议：

```ts
messages.push({
  type: "tool_search_call",
  call_id,
  execution: "client",
  arguments: { query: names.join(" "), limit: names.length },
});
messages.push({
  type: "tool_search_output",
  call_id,
  execution: "client",
  tools: convertResponsesTools(tools, { toolSearchResult: true }),
});
```

因为只能加不能删，遇到"移除"或"同名重定义"时，`resolveTranscriptTools()` 会把顶层 tools 提升到**最后一次非增量变更之后**的状态：

> With "additions", a removal or redefinition cannot be expressed in place, so the top-level list becomes the tool state after the last such change; later additions stay anchored, and the cached prefix is invalidated once per removal instead of on every later addition.

翻译成一句话：能锚定就锚定；锚不住的那一次付一次失效，而不是之后每次都失效。

#### none：其余模型

`collapseSystemMessages()` 把整条 transcript 折叠成一条头部 system message，工具列表取当前值。这时候头部确实变了，缓存确实失效。

这是唯一真正破缓存的路径，而且不是 `tool_search` 能修的：模型 API 没有"中途声明工具"的能力，工具只能写在请求头部，那就只能改头。走这条路的模型每次加载工具都要重算前缀。

### 第三层：断点是标记，不是内容

Anthropic 的 `cache_control` 是"在此处缓存"的标记，最多 4 个。pi 一个放 system，一个放最后一个工具，一个跟着最后一条 user/system 消息。断点位置每轮移动不影响命中——服务端取的是与历史缓存的最长公共前缀。

所以"cache 不会失效"的准确含义是：**已经缓存的部分没有被重写**，不是 token 总数不增长。一次工具加载的账单是增量：新增的 tool result、`tool_addition`、之后的回复需要付费，之前的全部命中。

## 代价和边界

这套机制不是免费的，也不是万能的。

- **不是绝对不失效**。取决于模型 compat 标记。没有 `supportsMidConvoToolChanges` / `supportsToolSearch` 的模型，加载工具必然改头部。
- **codemode 完全不碰缓存**。codemode 脚本调用 `deferred` 工具时不改 active set，会话里不会多一条声明。只有 `tool_search` 会改声明。
- **加载是单向的**，不会自动卸载。这个分支之后每次请求都带着这些工具声明（虽然因为前缀已缓存，不会重复付费）。要收回只能改 active set 或换分支。
- **检索质量就是 BM25 的质量**。没有同义词、没有 embedding、默认只回 8 条。查询措辞和工具命名差太远时，模型会拿到 `No matching tools found.`，然后换词重试或者退回 codemode。
- **描述必须是静态的**，这是设计约束而不是实现细节。任何"把当前可用工具列表写进描述"的冲动都会直接把缓存打穿。

## 小结

`tool_search` 本身只是一个 BM25 检索器加一句 `setActiveTools`，几十行就能写完。真正有信息量的部分是它周围的三层结构：

1. **注册和声明分离**，让"工具存在"和"模型知道工具存在"变成两个独立的时刻。
2. **声明变更写成 transcript 日志**，于是加载结果可重放，`/tree`、resume、fork 自动成立。
3. **provider 侧把变更锚定在加载点**，前缀不被重写，缓存继续命中；锚不住的那一次，明确地只付一次。

第三点是最容易被忽略的：为了缓存，pi 宁愿在 Anthropic 请求里常驻一个 `__pi_deferred_placeholder__` 假工具，宁愿让 `tool_search` 的描述保持空泛也不写一行"当前可加载 github 的 37 个工具"。这类设计看起来是性能优化，实际上是在给"上下文属于缓存、而不是属于状态"这句话付房租。

## 参考

- pi 源码：<https://github.com/earendil-works/pi>
  - `packages/coding-agent/src/extensions/tool-search/tool.ts`：检索与加载
  - `packages/coding-agent/src/core/extensions/types.ts`：`exposure`、`reachesTools`
  - `packages/agent/src/agent-loop.ts`：`declareToolChanges`
  - `packages/ai/src/utils/transcript.ts`：`getCurrentTools`、`resolveTranscriptTools`
  - `packages/ai/src/api/anthropic-messages.ts`：`tool_addition`、`DEFERRED_TOOL_PLACEHOLDER`
  - `packages/ai/src/api/openai-responses-shared.ts`：`additional_tools` 与客户端 tool search
- pi 文档：`docs/mcp.md`、`docs/cli.md#tools`、`docs/extensions.md#tool-exposure`
- pi CHANGELOG issue #10212（描述去动态化以保住缓存）
