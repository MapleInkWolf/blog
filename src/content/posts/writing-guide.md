---
title: 怎么在这个博客写一篇文章
description: 从新建 Markdown 文件到推上 GitHub，完整流程和几个容易踩的小坑。
date: 2026-10-20
tags: [教程, Astro]
---

这个博客没有后台，也不需要后台。写文章就是新建一个 Markdown 文件，然后 `git push`。

## 三步发一篇

**第一步**，在 `src/content/posts/` 里新建一个 `.md` 文件，文件名会变成网址：

```text
src/content/posts/my-new-post.md
→ https://你的域名/posts/my-new-post/
```

**第二步**，写上文件头（frontmatter），字段是固定的：

```yaml
---
title: 文章标题
description: 一两句话摘要，会出现在列表和搜索结果里
date: 2026-10-20
tags: [标签一, 标签二]
draft: false
---
```

`draft: true` 可以先把文章藏起来，构建时会被整个忽略。

**第三步**，正文用 Markdown 写，然后提交：

```bash
git add .
git commit -m "post: 新文章标题"
git push
```

推上去之后 GitHub Actions 会自动构建，等一分钟左右，线上就更新了。

## 本地预览

改完想先看看效果，装好依赖后跑：

```bash
npm install
npm run dev
```

打开 `http://localhost:4321`。改文件会自动刷新，比推上去再看快得多。

## 几个小坑

**图片放哪**：放 `public/images/`，引用时从站点根目录开始写：

```markdown
![描述](/images/example.jpg)
```

注意别写成相对路径——部署在子路径（`/repo-name/`）时相对路径容易错位。

**中文标点**：Markdown 里 `**粗体**` 两边如果紧贴中文，有些解析器会失效。保险起见，标点前后留个空格。

**代码块**：写上语言名才有高亮，比如 ` ```python `。没写也能显示，只是没颜色。

## 一个建议

文件名用英文小写加连字符，比如 `how-to-debug-npm.md`。中文文件名不是不能用，只是复制链接时会被转义成一长串 `%E4%B8%AD%E6%96%87`，不好看。
