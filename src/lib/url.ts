/** 把站内路径拼上 base（仓库名），保证部署到 /repo/ 子路径时链接不坏。 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/** 生成绝对地址，RSS 和 og:url 需要。 */
export function absoluteUrl(path: string, site?: URL): string {
  const origin = site?.origin ?? 'https://example.com';
  return new URL(withBase(path), `${origin}/`).href;
}
