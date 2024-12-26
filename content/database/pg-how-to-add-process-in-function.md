---
title: "pg中为存储过程添加进度"
tags: ["Database"]
date: "2021-07-09"
---

有时我们可能需要知道长时间调用存储过程的进度。

### 通过外部表

首先我想到通过修改一张外部表更新存储过程的进度，后来发现这样是不行的。存储过程执行中对数据库的改变在外部是获取不到的，它只有在执行完毕提交后，我们才能获取结果，所以这种方式我们获取到的进度可能全都是 100%。

### raise

`RAISE`语句可以在 sql 运行过程中向程序抛出消息或错误，[文档](https://www.postgresql.org/docs/11/plpgsql-errors-and-messages.html)

用法如下所示：
sql

```sql
RAISE INFO 'model_progress:%',json_build_object('job_uid',job_uid,'job_progress',progress);
```

程序中我们还可以获取到存储过程抛出的消息：如 node 实现所示

```js
const pool = new Pg.Pool(Config.db);

pool.on('connect', (cl) => {
  cl.on('notice', (msg) => {
    // 获取sql抛出的信息

    DbNoticeHandler.handle(msg);
  });
});
```
