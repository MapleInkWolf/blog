import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export interface Entry {
  post: Post;
  /** 站点内的编号：最早一篇是 001 */
  no: string;
  /** 正文字数，真实统计 */
  words: number;
}

/** 数字千分位：12,464 */
export function num(n: number): string {
  return n.toLocaleString('en-US');
}

/** 2026.10.24，字段里统一用这个格式 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

/** <time datetime="…"> 用 */
export function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 字数统计：去掉 Markdown 记号后，中文按字、西文按词。
 * 数字是真的，所以界面上才敢拿它做装饰。
 */
export function countWords(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|]/g, ' ');
  const cjk = (text.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g) ?? []).length;
  const latin = (text.replace(/[\u3400-\u4dbf\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return cjk + latin;
}

/** 约 400 字一分钟 */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 400));
}

/** 全部已发布文章，按时间从旧到新，并编上号 */
export async function getEntries(): Promise<Entry[]> {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => a.data.date.valueOf() - b.data.date.valueOf(),
  );

  return posts.map((post, i) => ({
    post,
    no: String(i + 1).padStart(3, '0'),
    words: countWords(post.body ?? ''),
  }));
}

/** 从新到旧，列表和首页都用这个顺序 */
export function newestFirst(entries: Entry[]): Entry[] {
  return [...entries].reverse();
}

/** 按年份分组，年份从新到旧 */
export function groupByYear(entries: Entry[]): Array<{ year: string; items: Entry[] }> {
  const map = new Map<string, Entry[]>();
  for (const entry of newestFirst(entries)) {
    const year = String(entry.post.data.date.getFullYear());
    const list = map.get(year) ?? [];
    list.push(entry);
    map.set(year, list);
  }
  return [...map.entries()]
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, items]) => ({ year, items }));
}

/** 标签 → 篇数，按篇数从多到少 */
export function tagCounts(entries: Entry[]): Array<{ tag: string; count: number }> {
  const map = new Map<string, number>();
  for (const { post } of entries) {
    for (const tag of post.data.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));
}
