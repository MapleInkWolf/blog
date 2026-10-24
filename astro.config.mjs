import { defineConfig } from 'astro/config';

// GitHub Actions 里会自动带上这些环境变量，本地开发时没有。
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? '';
const isUserSite = repo.toLowerCase().endsWith('.github.io');

// 仓库名叫 <user>.github.io 时站点在根路径，其余情况在 /<repo>/ 下。
const base = repo && !isUserSite ? `/${repo}` : '/';
const site = owner ? `https://${owner}.github.io` : 'http://localhost:4321';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light',
      wrap: true,
    },
  },
});
