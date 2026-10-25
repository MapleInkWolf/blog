# 我的博客

线上地址：<https://mapleinkwolf.github.io/blog/>

一个用 [Astro](https://astro.build) 写的静态博客：Markdown 写文章，推上 GitHub 就自动发布到 GitHub Pages。

视觉上照着 **终末地（Endfield）那套工业风 UI 规范**做的——纸、墨、一个强调黄、切角、细线、宽体大写英文配中文黑体。没有圆角、没有投影、没有渐变。

- 首页是「展示」版式：超大字标、空心大编号、墨色滚动条、切角画框
- 文章页是「阅读」版式：白纸阅读栏 + 页边的目录和真实统计
- 浅色 / 深色两套完整主题，右上角可切换并记住选择
- 首页挂着一个网易云歌单播放器，点一行就换歌
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
| 页面版式（首屏栅格、页脚、频道卡片、播放器） | `public/site.css` |
| 网站图标 | `public/favicon.svg` |
| 首屏插画 | 后台「首页图」上传，或直接换 `public/images/eku.jpg` |
| 歌单曲目 | `src/data/playlist.ts` |
| 关于页正文 | `src/pages/about.astro` |
| 示例文章 | `src/content/posts/*.md`（可以直接删） |

**B站链接**写在 `src/site.config.ts` 的 `bilibili` 里，改一处，导航、首屏「频道」区、页脚、关于页会一起变。

## 在线改文章（控制台）

<https://mapleinkwolf.github.io/blog/admin/>

页面是纯前端，直接调 GitHub API 往仓库提交 commit：

1. 点「连接」前先建一个 **Fine-grained token**：只授权 `MapleInkWolf/blog` 这一个仓库，权限只给 **Contents → Read and write**（GitHub → Settings → Developer settings → Personal access tokens）
2. 把 token 粘进去，它会存在这台浏览器的 localStorage，不会发到别处
3. 左边的列表可以直接 **新建 / 编辑 / 删除** 文章，保存就是一次 commit，Actions 跑完（约 1 分钟）上线
4. 「首页图」页签可以上传自己的插画：会压到最长边 1600、转成 JPEG，提交到 `public/images/hero.jpg`；点「恢复默认」删掉它就回到 `eku.jpg`

编辑器写的是 frontmatter + Markdown，字段和下面「写一篇新文章」那节一致。换了设备或清了缓存就重新粘一次 token。

> token 只在本机浏览器里，别把它贴给别人；丢了就在 GitHub 上撤销重发。

## 音乐播放器

歌单单独一页：`/music/`。播放器本身在顶栏，全站都在：

- 自绘的 UI（封面、标题、播放/暂停、上一首/下一首、进度条），不再是网易云那个白色 iframe
- 用 `<audio>` 播，地址在播放时通过 Meting 接口解析：`https://api.injahow.cn/meting/?server=netease&type=url&id=<songId>`，它会 302 跳到真实 mp3
- 用 Astro 的 `<ClientRouter />` + `transition:persist`，站内跳页时播放器 DOM 不销毁，**音乐不会断**
- 曲目数据在 `src/data/playlist.ts`（id、标题、艺人、时长、封面）

**会员曲目**：标了「试听」的 4 首（No.02 / 04 / 05 / 06）是网易云会员曲，第三方接口只给 30 秒预览，播放时页面会弹出提示，全曲点「在网易云打开」。
如果哪天接口挂了，播放器会在进度条上方提示「去网易云」。

## 首屏插画与角标动效

- 默认用 `public/images/eku.jpg`；后台传过 `public/images/hero.jpg` 就自动用新的（构建时判断）
- 左上角的 `ARCHIVE / 01` 是一个角标：加载时先铺一层乱码，等首屏画出来再从乱码滚到正常文字，下面的色条同时长满
- 鼠标移到画框上：图片轻微放大，一条扫描线从上往下扫过
- 动效写在 `public/site.css`（`shot-in` / `scan` / `.frame-hud`）和 `src/layouts/Base.astro` 的 `initDecode()` 里，系统开启「减少动态效果」时全部关闭

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
│  ├─ images/                     # 配图（eku.jpg 默认插画、hero.jpg 自定义）
│  └─ favicon.svg
├─ src/
│  ├─ content/posts/              # 文章（Markdown）
│  ├─ content.config.ts           # frontmatter 校验
│  ├─ data/playlist.ts            # 歌单：id、标题、时长、封面、vip 标记
│  ├─ layouts/Base.astro          # 页头（含播放器）、页脚、主题、页面初始化
│  ├─ components/PlayerBar.astro  # 顶栏迷你播放器
│  ├─ scripts/
│  │  ├─ player.js                # 播放器逻辑（跨页续播）
│  │  └─ admin.js                 # 控制台：GitHub API 读写
│  ├─ lib/posts.ts                # 编号、字数、按年分组
│  ├─ pages/
│  │  ├─ index.astro              # 首页（展示版式）
│  │  ├─ music.astro              # 歌单页
│  │  ├─ admin.astro              # 控制台（noindex）
│  │  ├─ posts/index.astro        # 文章归档
│  │  ├─ posts/[...slug].astro    # 文章详情（阅读版式）
│  │  ├─ about.astro
│  │  ├─ 404.astro
│  │  └─ rss.xml.js
│  ├─ site.config.ts              # 站点信息
│  └─ lib/url.ts                  # 子路径拼接
└─ astro.config.mjs
```
