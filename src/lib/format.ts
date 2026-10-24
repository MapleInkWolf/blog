const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/** 2026-10-24 -> 2026年10月24日 */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** <time datetime="2026-10-24"> 用的机器可读格式 */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 按中文习惯粗算阅读时长，代码块和英文单词都算进去。 */
export function readingTime(body: string): string {
  const chars = body.replace(/\s+/g, '').length;
  const minutes = Math.max(1, Math.round(chars / 400));
  return `${minutes} 分钟`;
}
