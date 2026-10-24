# 我的博客

线上地址：<https://mapleinkwolf.github.io/blog/>

一个用 [Astro](https://astro.build) 写的静态博客：Markdown 写文章，推上 GitHub 就自动发布到 GitHub Pages。

视觉上照着 **终末地（Endfield）那套工业风 UI 规范**做的——纸、墨、一个强调黄、切角、细线、宽体大写英文配中文黑体。没有圆角、没有投影、没有渐变。

- 首页是「展示」版式：超大字标、空心大编号、墨色滚动条、切角画框
- 文章页是「阅读」版式：白纸阅读栏 + 页边的目录和真实统计
- 浅色 / 深色两套完整主题，右上角可切换并记住选择
- 自动生成 RSS（`/rss.xml`）和分享用的 `<meta>`
- 文章编号（No.001）、字数、阅读时长都是构建时算出来的真实数据

## 本地跑起来

需要 Node.js 18.17+（推荐 20 或 22）。

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
npm run preview  # 预览构建结果
```

## 先改这几处

| 想改什么 | 改哪里 |
| --- | --- |
| 站名、大字标、简介、B站/直播链接、GitHub | `src/site.config.ts` |
| 导航栏菜单 | `src/site.config.ts` 里的 `NAV` |
| 全部颜色、字体、间距、切角 | `public/endfield.css` 开头的 `--ef-*` 变量 |
| 页面版式（首屏栅格、页脚、频道卡片） | `public/site.css` |
| 网站图标 | `public/favicon.svg` |
| 首屏那张线稿 | `src/pages/index.astro` 里的内联 `<svg>` |
| 关于页正文 | `src/pages/about.astro` |
| 示例文章 | `src/content/posts/*.md`（可以直接删） |

**B站链接**写在 `src/site.config.ts` 的 `bilibili` 里，改一处，导航、首屏「频道」区、页脚、关于页会一起变。

## 写一篇新文章

在 `src/content/posts/` 下新建 `my-post.md`，网址就是 `/posts/my-post/`：

```markdown
---
title: 文章标题
description: 一两句话摘要
date: 2026-10-24
tags: [随笔, 技术]
draft: false
---

正文从这里开始。
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期，决定排序和编号 |
| `description` | 否 | 摘要，展示在列表、RSS 和搜索结果里 |
| `tags` | 否 | 标签数组 |
| `draft` | 否 | `true` 时不会出现在构建结果里 |
| `updated` | 否 | 最近修改日期 |

图片放 `public/images/`，正文里用 `/images/xxx.jpg` 引用（不要用相对路径）。

## 部署到 GitHub Pages

**1. 建仓库并推送**

```bash
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

**2. 打开 Pages**

仓库 → **Settings** → **Pages** → **Build and deployment** → Source 选 **GitHub Actions**。

**3. 等一分钟**

每次 `git push` 到 `main` 都会触发 `.github/workflows/deploy.yml`，构建完自动发布。

| 仓库名 | 访问地址 |
| --- | --- |
| `<用户名>.github.io` | `https://<用户名>.github.io/` |
| 其他名字，比如 `blog` | `https://<用户名>.github.io/blog/` |

不用改任何代码：`astro.config.mjs` 会从 `GITHUB_REPOSITORY` 环境变量推断仓库名，自动处理子路径。

> 注意：私有仓库要在 Free 账户上发布 Pages 是不行的，仓库得是 **public**。

## 设计规范从哪来

界面不是随手拍的，是照着 [hhikr/endfield-ui-skill](https://github.com/hhikr/endfield-ui-skill) 这套规范实现的：

- **一个强调色** `#FFFA00`，只表示「当前位置 / 可点击 / 需要注意」，只做填充，上面压墨色字
- **切掉一个角 = 可以点**，正文和图片都是直角
- **宽体大写英文在上、中文黑体在下**，数字用等宽数字
- **1px 细线分区**，不用卡片、投影、圆角
- **短、硬、机械的动效**，系统开启「减少动态效果」时全部关闭
- 字体是自托管的 **Saira**（拉丁，宽度轴 50–125）和 **思源黑体 Noto Sans SC**，都从 `@fontsource-variable` 引，不连 Google Fonts，国内也能加载

想换强调色，改 `public/endfield.css` 里的 `--ef-signal` 一处即可；切角大小改 `--ef-cut-k`。

## 目录结构

```text
.
├─ .github/workflows/deploy.yml   # 构建 + 发布
├─ public/
│  ├─ endfield.css                # UI 套件（变量 + 全部部件）
│  ├─ site.css                    # 本站版式
│  ├─ contours/                   # 背景等高线 SVG
│  ├─ images/                     # 文章配图
│  └─ favicon.svg
├─ src/
│  ├─ content/posts/              # 文章（Markdown）
│  ├─ content.config.ts           # frontmatter 校验
│  ├─ layouts/Base.astro          # 页头、页脚、主题切换、字体
│  ├─ lib/posts.ts                # 编号、字数、按年分组
│  ├─ pages/
│  │  ├─ index.astro              # 首页（展示版式）
│  │  ├─ posts/index.astro        # 文章归档
│  │  ├─ posts/[...slug].astro    # 文章详情（阅读版式）
│  │  ├─ about.astro
│  │  ├─ 404.astro
│  │  └─ rss.xml.js
│  ├─ site.config.ts              # 站点信息
│  └─ lib/url.ts                  # 子路径拼接
└─ astro.config.mjs
```
