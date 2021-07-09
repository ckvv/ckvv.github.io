---
title: "node服务端渲染"
tags: ['node']
---

服务端渲染是指，浏览器向服务器发出请求页面，服务端将准备好的模板和数据组装成完整的HTML返回给浏览器展示。
前后的分离后，浏览器加载完页面后还需要再次向服务器发起请求数据，如果我们事先将需要请求到数据放入到页面就无需加载页面后再次向服务器发起请求，减少初始初始页面加载时间
node的服务端渲染库有很多。`handlebars, ejs, ejs, hbs, pug, velocityjs, Nunjucks, twig, dot,templayed`

## 直接使用Nunjucks

[Nunjucks文档](https://nunjucks.bootcss.com)

```javascript
// render.js
const Router = require('koa-router')
const router = new Router()
const nunjucks = require('nunjucks');
const path = require('path')

let env = nunjucks.configure(path.join(__dirname, '../public'),{
    // noCache: true,
});

router.get('/', async (ctx, next) => {

    ctx.body = env.render('index.html', {
        title: 'title',
        user: {
            name: 'test',
            age: 18
        }
    });
});

module.exports = router



app.use(render.routes(), render.allowedMethods());
```



## 使用koa-views + Nunjucks 等

```javascript
const views = require('koa-views')
const path = require('path')

// Must be used before any router is used
app.use(views(path.join(__dirname, './public'), {
    map: {
        html: 'nunjucks'
    },
    web:{
        useCache: true,
    }
}));
app.use(render.routes(), render.allowedMethods());


// render.js
const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx, next) => {
    // render `user.html` with nunjucks
    await ctx.render('index', {
        title: 'title',
        user: {
            name: 'name',
            age: 18
        }
    });
});

module.exports = router
```

