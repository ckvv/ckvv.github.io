---
title: "博客从Hugo迁移到Astro"
tags: ['astro']
date: "2024/12/06"
---

## 为什么从 Hugo 迁移到 Astro

由于 hugo 处理复杂交互以及扩展 markdown 能力较弱, 最近博客从 Hugo 迁移到了 Astro, Astro 支持在项目以及 markdown 中集成像 React、Vue、Svelte 这类流行的前端框架组件  

除了 Astro 类似替代方案也不少, 比如 Vitepress 或者 Nuxt, 与它们相比, Astro 可以更灵活引用其他框架组件, 还可以通过仅使用`astro` 组件 减少打包后的没有引用 Vue | React 或者其他框架的博客大小

## 部署与优化

博客需要通过 GitHub Action 自动更新部署,  迁移到 Astro后 博客更新时间从`40秒`延长到了`90秒`, 部署时间主要分为打包和部署更新两个阶段, 不同框架部署更新阶段逻辑是一样的(`20秒`), 但是在打包阶段 Astro (`60秒`)要比使用 hugo (`20秒`)长很多,  这主要是因为打包 Astro 需要安装依赖以及打包时间较长的原因, 

+ hugo 打包时间
![](https://r2.mapplat.com/794ef03ee236f8fa8800f7a0f2ecd57065d063a8d2221a5e72fc5d54bae9851e.png)

+ Astro 打包时间
![](https://r2.mapplat.com/2eec754ecb7541e209f6a1a64028a2ab0beaba28f98fd17edc2914dc1475ab07.png)

GitHub Action 可通过缓存待依赖库优化打包时间, 具体参考 <https://github.com/ckvv/ckvv.github.io/blob/main/.github/workflows/pages.yml>

+ 优化后的 Astro 打包时间

![](https://r2.mapplat.com/2cf026f7b956322510a83c475862304ab00ca85f6497e2595459169ad13eff86.png)


> GitHub Action 过程时间是仅供参考的约数

