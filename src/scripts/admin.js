/* 控制台：浏览器里直接用 GitHub API 改仓库。
   token 只存 localStorage，所有写操作都是 commit。 */

const OWNER = 'MapleInkWolf';
const REPO = 'blog';
const BRANCH = 'main';
const API = 'https://api.github.com';
const TOKEN_KEY = 'blog.gh.token';
const POSTS_DIR = 'src/content/posts';
const HERO_PATH = 'public/images/hero.jpg';
const HERO_MAX = 1600;

const $ = (id) => document.getElementById(id);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const state = {
  token: '',
  login: '',
  files: [], // { name, path, sha }
  editing: null, // { path, sha } 或 null（新建）
  heroSha: null,
};

/* ---------- 基础工具 ---------- */

const encodeB64 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin);
};

const decodeB64 = (b64) => {
  const bin = atob(String(b64).replace(/\s/g, ''));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const msg = (el, text, isError = false) => {
  if (!el) return;
  if (!text) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.textContent = text;
  el.dataset.flag = isError ? '出错' : '提示';
};

async function gh(path, options = {}) {
  const res = await fetch(API + path, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${state.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.message) detail = body.message;
    } catch {
      /* 忽略 */
    }
    const error = new Error(detail);
    error.status = res.status;
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
}

/* ---------- frontmatter ---------- */

function parsePost(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const data = { title: '', description: '', date: '', tags: [], draft: false };
  let body = text;

  if (match) {
    body = match[2];
    match[1].split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(':');
      if (i < 0) return;
      const key = line.slice(0, i).trim();
      let value = line.slice(i + 1).trim();

      if (key === 'tags') {
        value = value.replace(/^\[|\]$/g, '');
        data.tags = value
          ? value
              .split(',')
              .map((t) => t.trim().replace(/^["']|["']$/g, ''))
              .filter(Boolean)
          : [];
      } else if (key === 'draft') {
        data.draft = value === 'true';
      } else if (key in data) {
        if (value.startsWith('"')) {
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value.replace(/^"|"$/g, '');
          }
        } else {
          data[key] = value.replace(/^['"]|['"]$/g, '');
        }
      }
    });
  }

  return { data, body: body.replace(/^\n+/, '') };
}

// 一律加引号：纯数字（如标题写 222）不加引号会被 YAML 当成 number，构建直接挂
const quote = (value) => JSON.stringify(String(value ?? ''));

function serializePost(data, body) {
  return [
    '---',
    `title: ${quote(data.title)}`,
    `description: ${quote(data.description)}`,
    `date: ${data.date}`,
    `tags: [${data.tags.map(quote).join(', ')}]`,
    `draft: ${data.draft}`,
    '---',
    '',
    body.replace(/\s+$/, ''),
    '',
  ].join('\n');
}

/* ---------- 登录 ---------- */

async function connect(token) {
  state.token = token;
  const user = await gh('/user');
  state.login = user.login;
  localStorage.setItem(TOKEN_KEY, token);

  $('gate').hidden = true;
  $('console').hidden = false;
  $('who').textContent = `已连接 ${user.login} · ${OWNER}/${REPO} · ${BRANCH}`;
  $('actions-link').href = `https://github.com/${OWNER}/${REPO}/actions`;

  await Promise.all([loadPosts(), loadHero()]);
}

function disconnect() {
  state.token = '';
  state.login = '';
  localStorage.removeItem(TOKEN_KEY);
  $('console').hidden = true;
  $('gate').hidden = false;
  $('token').value = '';
}

/* ---------- 文章列表 ---------- */

async function loadPosts() {
  const list = $('post-list');
  list.innerHTML = '<li><span class="ef-field">载入中…</span></li>';
  msg($('editor-msg'), '');

  let files = [];
  try {
    files = await gh(`/repos/${OWNER}/${REPO}/contents/${POSTS_DIR}?ref=${BRANCH}`);
  } catch (error) {
    if (error.status !== 404) throw error;
  }

  state.files = files.filter((f) => f.name.endsWith('.md'));
  $('post-empty').hidden = state.files.length > 0;

  const items = await Promise.all(
    state.files.map(async (file) => {
      try {
        const detail = await gh(`/repos/${OWNER}/${REPO}/contents/${file.path}?ref=${BRANCH}`);
        const { data } = parsePost(decodeB64(detail.content));
        return { file, data };
      } catch {
        return { file, data: { title: file.name, date: '', draft: false } };
      }
    }),
  );

  items
    .sort((a, b) => String(b.data.date).localeCompare(String(a.data.date)))
    .forEach(({ file, data }, i) => {
      const li = document.createElement('li');
      const row = document.createElement('div');
      row.className = 'ef-record admin-row';

      const no = document.createElement('span');
      no.className = 'ef-tag';
      no.textContent = String(i + 1).padStart(2, '0');

      const date = document.createElement('span');
      date.className = 'ef-field';
      date.textContent = data.date || '—';

      const name = document.createElement('span');
      name.className = 'name ef-read';
      name.textContent = data.title || file.name;
      if (data.draft) {
        const badge = document.createElement('span');
        badge.className = 'ef-state is-draft';
        badge.textContent = '草稿';
        name.append(' ', badge);
      }

      const acts = document.createElement('span');
      acts.className = 'admin-row__acts';

      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'ef-btn small';
      edit.textContent = '编辑';
      edit.addEventListener('click', () => openEditor(file.name, file.sha));

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'ef-btn small danger';
      del.textContent = '删除';
      del.addEventListener('click', () => deletePost(file.name, file.sha));

      acts.append(edit, del);
      row.append(no, date, name, acts);
      li.append(row);
      list.append(li);
    });
}

/* ---------- 编辑器 ---------- */

function openEditor(name, sha) {
  state.editing = { path: `${POSTS_DIR}/${name}`, sha };
  const form = $('editor');
  form.hidden = false;
  $('editor-title').textContent = `编辑 ${name}`;
  $('editor-state').textContent = '已载入';
  $('delete').hidden = false;
  $('f-slug').value = name.replace(/\.md$/, '');
  $('f-slug').readOnly = true;
  msg($('editor-msg'), '');

  gh(`/repos/${OWNER}/${REPO}/contents/${state.editing.path}?ref=${BRANCH}`)
    .then((detail) => {
      const { data, body } = parsePost(decodeB64(detail.content));
      $('f-title').value = data.title;
      $('f-desc').value = data.description;
      $('f-date').value = data.date;
      $('f-tags').value = data.tags.join(', ');
      $('f-draft').checked = Boolean(data.draft);
      $('f-body').value = body;
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
    .catch((error) => msg($('editor-msg'), `载入失败：${error.message}`, true));
}

function newPost() {
  state.editing = null;
  const form = $('editor');
  form.hidden = false;
  $('editor-title').textContent = '新建文章';
  $('editor-state').textContent = '未保存';
  $('delete').hidden = true;
  $('f-slug').readOnly = false;
  $('f-slug').value = '';
  $('f-title').value = '';
  $('f-desc').value = '';
  $('f-date').value = new Date().toISOString().slice(0, 10);
  $('f-tags').value = '';
  $('f-draft').checked = false;
  $('f-body').value = '正文从这里开始。\n';
  msg($('editor-msg'), '');
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('f-slug').focus();
}

async function savePost(event) {
  event.preventDefault();
  const slug = $('f-slug').value.trim().replace(/\.md$/, '');
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
    msg($('editor-msg'), '文件名只能用小写字母、数字和连字符。', true);
    return;
  }

  const data = {
    title: $('f-title').value.trim(),
    description: $('f-desc').value.trim(),
    date: $('f-date').value,
    tags: $('f-tags')
      .value.split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    draft: $('f-draft').checked,
  };
  const body = $('f-body').value;
  const path = `${POSTS_DIR}/${slug}.md`;

  $('save').setAttribute('aria-busy', 'true');
  msg($('editor-msg'), '正在提交…');

  let committed = false;

  try {
    const payload = {
      message: `post: ${data.title || slug}`,
      content: encodeB64(serializePost(data, body)),
      branch: BRANCH,
    };

    const currentSha = state.editing && state.editing.path === path ? state.editing.sha : null;
    if (currentSha) payload.sha = currentSha;

    await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    committed = true;
    msg($('editor-msg'), '已提交，等 GitHub Actions 跑完（约一分钟）就上线。');
    $('editor-state').textContent = '已提交';
    $('f-slug').readOnly = true;
    $('f-slug').value = slug;
    state.editing = { path, sha: null };
    $('delete').hidden = false;
  } catch (error) {
    const text =
      error.status === 422
        ? `这个名字已经有文件了（${slug}.md）。换个 slug，或者去列表里点「编辑」改那一篇。`
        : `提交失败：${error.message}`;
    msg($('editor-msg'), text, true);
  } finally {
    $('save').removeAttribute('aria-busy');
  }

  // 刷新列表单独 try：提交已经成功的话，绝不能因为刷新失败报“提交失败”
  if (committed) {
    await sleep(1200);
    await loadPosts().catch(() => {});
  }
}

async function deletePost(name, sha) {
  if (!window.confirm(`删除「${name}」？会直接提交一个删除 commit。`)) return;

  try {
    await gh(`/repos/${OWNER}/${REPO}/contents/${POSTS_DIR}/${name}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `post: 删除 ${name}`,
        sha,
        branch: BRANCH,
      }),
    });
    if (state.editing && state.editing.path.endsWith(name)) {
      $('editor').hidden = true;
      state.editing = null;
    }
    msg($('auth-msg'), '');
    await sleep(1200);
    await loadPosts();
  } catch (error) {
    msg($('editor-msg'), `删除失败：${error.message}`, true);
  }
}

/* ---------- 首页图 ---------- */

async function loadHero() {
  try {
    const info = await gh(`/repos/${OWNER}/${REPO}/contents/${HERO_PATH}?ref=${BRANCH}`);
    state.heroSha = info.sha;
    $('hero-state').textContent = '当前：自定义插画（public/images/hero.jpg）';
    $('hero-preview').src = `/images/hero.jpg?v=${Date.now()}`;
    $('hero-reset').disabled = false;
  } catch (error) {
    if (error.status !== 404) throw error;
    state.heroSha = null;
    $('hero-state').textContent = '当前：默认插画（public/images/eku.jpg）';
    $('hero-preview').src = '/images/eku.jpg';
    $('hero-reset').disabled = true;
  }
}

/** 把图片等比缩到最长边 1600，转成 JPEG base64 */
function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('读文件失败'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('不是有效图片'));
      img.onload = () => {
        const scale = Math.min(1, HERO_MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        resolve({ base64: dataUrl.split(',')[1], dataUrl });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

async function uploadHero() {
  const input = $('hero-file');
  const file = input.files && input.files[0];
  if (!file) {
    msg($('hero-msg'), '先选一张图片。', true);
    return;
  }

  $('hero-upload').setAttribute('aria-busy', 'true');
  msg($('hero-msg'), '正在压缩并提交…');

  try {
    const { base64, dataUrl } = await shrinkImage(file);
    const payload = {
      message: 'chore: 更换首页插画',
      content: base64,
      branch: BRANCH,
    };
    if (state.heroSha) payload.sha = state.heroSha;

    await gh(`/repos/${OWNER}/${REPO}/contents/${HERO_PATH}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    $('hero-preview').src = dataUrl;
    $('hero-state').textContent = '已提交，构建完就会换成这张';
    msg($('hero-msg'), '已提交，等 Actions 跑完（约一分钟）。');
    input.value = '';
    await sleep(1200);
    await loadHero();
  } catch (error) {
    msg($('hero-msg'), `上传失败：${error.message}`, true);
  } finally {
    $('hero-upload').removeAttribute('aria-busy');
  }
}

async function resetHero() {
  if (!state.heroSha) return;
  if (!window.confirm('删掉自定义插画，回到默认那张？')) return;

  try {
    await gh(`/repos/${OWNER}/${REPO}/contents/${HERO_PATH}`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: 'chore: 恢复默认首页插画',
        sha: state.heroSha,
        branch: BRANCH,
      }),
    });
    msg($('hero-msg'), '已提交删除，构建后回到默认图。');
    await sleep(1200);
    await loadHero();
  } catch (error) {
    msg($('hero-msg'), `删除失败：${error.message}`, true);
  }
}

/* ---------- 启动 ---------- */

function boot() {
  const gate = document.getElementById('gate');
  if (!gate || gate.dataset.booted === '1') return;
  gate.dataset.booted = '1';

  $('token-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = $('token').value.trim();
    if (!token) return;
    msg($('auth-msg'), '正在验证…');
    try {
      await connect(token);
      msg($('auth-msg'), '');
    } catch (error) {
      state.token = '';
      msg($('auth-msg'), `连接失败：${error.message}`, true);
    }
  });

  $('disconnect').addEventListener('click', disconnect);
  $('reload').addEventListener('click', () => loadPosts().catch((e) => msg($('editor-msg'), e.message, true)));
  $('new').addEventListener('click', newPost);
  $('cancel').addEventListener('click', () => {
    $('editor').hidden = true;
    state.editing = null;
  });
  $('editor').addEventListener('submit', savePost);
  $('delete').addEventListener('click', () => {
    if (!state.editing) return;
    const name = state.editing.path.split('/').pop();
    deletePost(name, state.editing.sha);
  });

  $('hero-upload').addEventListener('click', uploadHero);
  $('hero-reset').addEventListener('click', resetHero);

  document.querySelectorAll('.admin-tabs input[name="tab"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const value = radio.value;
      document.querySelectorAll('[data-pane]').forEach((pane) => {
        pane.hidden = pane.getAttribute('data-pane') !== value;
      });
    });
  });

  const saved = localStorage.getItem(TOKEN_KEY);
  if (saved) {
    connect(saved).catch(() => {
      localStorage.removeItem(TOKEN_KEY);
      state.token = '';
    });
  }
}

document.addEventListener('astro:page-load', boot);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
