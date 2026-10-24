/**
 * 站点信息：改这里就够了。
 * 这些文字会出现在首页、页脚、RSS 和浏览器标签页上。
 */
export const SITE = {
  /** 浏览器标签页和页头显示的名字 */
  title: '我的博客',
  /** 首页大标题下面那句自我介绍 */
  tagline: '写点代码，记点生活。',
  /** 一句话站点描述，用于 SEO 和 RSS */
  description: '一个用 Astro 做的静态博客，记录技术、阅读和一些随手写下的想法。',
  /** 你的名字 */
  author: '你的名字',
  /** 页脚的联系方式，不想要就留空字符串 */
  email: 'you@example.com',
  github: 'https://github.com/MapleInkWolf',
  /** 首页最多展示几篇最新文章 */
  recentPosts: 5,
} as const;

/** 导航栏，路径相对于站点根目录 */
export const NAV = [
  { href: '/', label: '首页' },
  { href: '/posts/', label: '文章' },
  { href: '/about/', label: '关于' },
] as const;
