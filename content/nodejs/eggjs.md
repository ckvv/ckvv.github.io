---
title: "eggjs"
tags: ['node']
---


## egg初始化设置
```
const dir = path.join(app.baseDir, '/app/model/');
app.loader.loadToContext(dir, 'model');

//只执行一次
app.once('server', async (server) => {
    //设置一个空的上下文
    const ctx = app.createAnonymousContext();
    //获取设置
    var settings = await ctx.model.setting.getAll();

});
```