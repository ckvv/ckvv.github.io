---
title: "node复用原始接口下载表格"
tags: ['node', 'web', 'download']
---

我们在做后台开发时可能有很多接口的数据需要下载下来,如果从头开发无疑会有很多重复代码如参数校验、权限验证等，接下来我谈谈我是如何利用现有的node接口下载表格

# json数组转表格

一般我们的接口返回的是json数组,我们很容易想到只需要把返回数据的json转为表格下载就可以了其他逻辑都是一样的，node有很多现成的库可以处理如`xlsx`

```js
function frows2XlsxBufferile(formatData) {
  const ws = xlsx.utils.json_to_sheet(formatData);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'SheetJS');
  return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
```

# 在ctx上下文添加下载文件的方法

默认情况下返回的是文本数据这里需要处理,我这里需要在`header`中声明返回的内容是一个需要下载的文件

```js
function file(name, data) {
  // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition
  // 说明浏览器应该将内容下载到本地；filename 的值预填为下载后的文件名
  this.response.set('Content-disposition', `attachment;filename="${name}"`);
  // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type
  // 说明返回的是一个二进制流数据
  this.response.set('Content-Type', 'application/octet-stream');
  return this.response.body = data;
}
```

# 返回表格

我们将上面封装下，方便调用,

```js
async download() {
  const { ctx } = this;

  const result = await this.index();
  // 如果返回接口返回信息，如果失败将原始信息返回
  if (!result || result.code !== 0) {
    return ctx.error(result);
  }
  return ctx.file('offer.xlsx', rows2XlsxBuffer(result.data.rows));
}
```

# 其他问题

## 分页

一般情况下我们下载的表格是不需要分页的,而我们调用的原始接口如上面的`this.index`可能默认是有分页信息的，这里我们需要特殊处理告诉它，本次请求不需要分页

```js
ctx.noPaging = true;
```
然后我们需要在对应接口中检查`noPaging`参数决定是否分页

## 压缩

有时如果返回的表格较大我们可能需要对表压缩，这里我用[zip-stream](https://github.com/archiverjs/node-zip-stream)直接对buffer压缩并返回对应压缩流

```js
function zipBuffer2Stream(buffer, outputName) {
  const archive = new ZipStream({
    zlib: { level: 9 },
  });
  archive.entry(buffer, { name: outputName }, err => {
    if (err) throw err;
    archive.finish();
  });
  return archive;
}
```