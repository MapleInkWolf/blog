/**
 * 站点信息：改这里就够了。
 */
export const SITE = {
  /** 站名，浏览器标签页用 */
  title: 'MapleInkWolf',
  /** 首屏大字标：实心一行 + 空心一行 */
  wordmark: { solid: 'MAPLE', hollow: 'INKWOLF' },
  /** 首屏那句荧光笔标注，只写一句 */
  claim: '代码、阅读，和直播间里的那些零碎',
  /** 一句话介绍，首屏大字标下面 */
  description: '记录技术上的折腾、读过的书，以及直播时聊到的零散想法。',
  /** 用于 SEO / RSS 的站点描述 */
  tagline: '写点代码，记点生活。',
  author: 'MapleInkWolf',
  /** 联系方式，不想要就留空字符串 */
  email: '',
  github: 'https://github.com/MapleInkWolf',
  bilibili: {
    space: 'https://space.bilibili.com/44972013',
    live: 'https://live.bilibili.com/2132018',
  },
  /** 首页索引最多列出几篇 */
  indexCount: 8,
} as const;

/** 导航栏 */
export const NAV = [
  { href: '/', label: '首页', en: 'Home' },
  { href: '/posts/', label: '文章', en: 'Posts' },
  { href: '/about/', label: '关于', en: 'About' },
  { href: SITE.bilibili.space, label: 'B站', en: 'Video', external: true },
  { href: SITE.bilibili.live, label: '直播', en: 'Live', external: true },
] as const;
