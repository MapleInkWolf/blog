import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    // 用 coerce：手写或后台写入时，纯数字的标题/摘要/标签容易被 YAML 解析成 number，
    // 这里统一转成字符串，别因为一个字段的类型把整站构建搞挂。
    title: z.coerce.string(),
    description: z.coerce.string().default(''),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.coerce.string()).default([]),
    /** 草稿不会出现在列表、RSS 和构建产物里 */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
