---
title: 这个博客是怎么跑起来的
description: 静态站点、GitHub Pages 和一点容易被忽略的子路径问题。
date: 2026-10-12
tags: [Astro, 部署]
---

有人问这套东西复不复杂。答案是不复杂，但有几个地方不留意就会白屏。

## 整体结构

```text
源码（Markdown + Astro 组件）
        │  git push
        ▼
GitHub Actions：npm ci → astro build
        │  产出静态 HTML/CSS/JS
        ▼
GitHub Pages：直接当文件服务器用
```

没有服务器，没有数据库。构建产物就是一堆静态文件，放到任何 CDN 上都能跑。

## 关键一步：Pages 的来源要选对

仓库的 **Settings → Pages → Build and deployment** 里，Source 必须选 **GitHub Actions**。

选成「Deploy from a branch」的话，GitHub 会找仓库里的静态文件直接发布，而我们仓库里只有源码，`dist/` 是构建时才生成的、也没有提交——结果就是 404。这个坑很多人踩过。

## 子路径问题

两种仓库的网址不一样：

| 仓库名 | 网址 | 资源路径 |
| --- | --- | --- |
| `yourname.github.io` | `https://yourname.github.io/` | `/` |
| `blog` | `https://yourname.github.io/blog/` | `/blog/` |

第二种情况下，页面里的 `/styles.css` 会指向 `yourname.github.io/styles.css`，而不是 `/blog/styles.css`——资源全 404，页面裸奔。

这个项目里所有内链都走了一个 `withBase()` 辅助函数，构建时从环境变量算出仓库名，两种部署方式都不用改代码。

## 一点取舍

为什么不用现成的博客平台，或者更重的框架？

- 静态站点加载快，没有后端要维护，也不怕被拖库
- Markdown 是纯文本，二十年后还能打开
- 依赖只有 Astro 一个，升级成本低

代价是没有后台编辑器、没有评论、没有阅读统计。前两个可以接受，第三个确实有点遗憾——以后再说吧。
