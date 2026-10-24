# 我的博客

线上地址：<https://mapleinkwolf.github.io/blog/>

一个用 [Astro](https://astro.build) 写的极简静态博客：Markdown 写文章，推上 GitHub 就自动发布到 GitHub Pages。没有数据库、没有后端、没有跟踪脚本。

- 手写的排版样式，浅色 / 深色两套主题（记住你的选择）
- 文章列表按年份归档，带标签、阅读时长、上一篇 / 下一篇
- 自动生成 RSS（`/rss.xml`）和 `<meta>` 社交分享信息
- 响应式，手机上也能看
- 部署走 GitHub Actions，推送即上线

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
| 博客名、作者、简介、邮箱、GitHub | `src/site.config.ts` |
| 导航栏菜单 | `src/site.config.ts` 里的 `NAV` |
| 全部颜色、字号、间距 | `src/styles/global.css` 顶部的 CSS 变量 |
| 网站图标 | `public/favicon.svg` |
| 关于页正文 | `src/pages/about.astro` |
| 示例文章 | `src/content/posts/*.md`（可以直接删） |

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
| `date` | 是 | 发布日期，决定排序 |
| `description` | 否 | 摘要，展示在列表、RSS 和搜索结果里 |
| `tags` | 否 | 标签数组 |
| `draft` | 否 | `true` 时不会出现在构建结果里 |
| `updated` | 否 | 最近修改日期 |

图片放 `public/images/`，正文里用 `/images/xxx.jpg` 引用（不要用相对路径）。

## 部署到 GitHub Pages

**1. 建仓库并推送**

在 GitHub 上新建一个仓库（public），然后：

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

> 注意：私有仓库要在 Free 账户上发布 Pages 是不行的，仓库得是 **public**。文章都是要给人看的，公开也无妨。

## 常见问题

**推上去页面是 404**
Pages 的 Source 没选 GitHub Actions，或者 Actions 还在跑。去仓库的 **Actions** 标签页看构建日志。

**样式丢了、链接全 404**
资源路径没带上仓库名。检查 `astro.config.mjs` 里的 `base` 是否为 `/<仓库名>`，以及页面里的链接是否都经过了 `withBase()`。

**想绑自己的域名**
Pages 设置里填 Custom domain，然后在仓库根目录放一个 `public/CNAME` 文件，内容就是域名。

## 目录结构

```text
.
├─ .github/workflows/deploy.yml   # 构建 + 发布
├─ public/                        # 原样拷贝的静态文件
│  ├─ favicon.svg
│  ├─ images/                     # 文章配图
│  └─ robots.txt
├─ src/
│  ├─ content/posts/              # 文章（Markdown）
│  ├─ content.config.ts           # 文章 frontmatter 校验
│  ├─ layouts/Base.astro          # 页面骨架：head、页头、页脚、主题切换
│  ├─ lib/                        # 路径拼接、日期和阅读时长
│  ├─ pages/                      # 路由
│  │  ├─ index.astro              # 首页
│  │  ├─ posts/index.astro        # 文章归档
│  │  ├─ posts/[...slug].astro    # 文章详情
│  │  ├─ about.astro
│  │  ├─ 404.astro
│  │  └─ rss.xml.js
│  ├─ site.config.ts              # 站点信息
│  └─ styles/global.css           # 全部样式
└─ astro.config.mjs
```
