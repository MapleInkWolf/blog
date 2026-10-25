/* 全局播放器：音频走 Meting 解析，UI 由各页面的 data-player-* 钩子决定。
   只初始化一次；播放器 DOM 用 transition:persist 跟着站内跳转活下去。 */

const RESOLVE = 'https://api.injahow.cn/meting/?server=netease&type=url&id=';

const fmt = (sec) => {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

function boot() {
  if (window.__player) return window.__player;

  const bar = document.getElementById('pbar');
  const dataEl = document.getElementById('pl-data');
  if (!bar || !dataEl) return null;

  let tracks = [];
  try {
    tracks = JSON.parse(dataEl.textContent || '[]');
  } catch {
    tracks = [];
  }
  if (!tracks.length) return null;

  const audio = new Audio();
  audio.preload = 'metadata';
  audio.volume = 0.3; // 默认音量 30%

  const state = { i: 0, playing: false, started: false };

  const all = (sel) => Array.from(document.querySelectorAll(sel));
  const track = () => tracks[state.i] || {};

  function paint() {
    const t = track();
    const no = String(state.i + 1).padStart(2, '0');

    all('[data-player-title]').forEach((el) => {
      el.textContent = `No.${no} · ${t.title}`;
    });
    all('[data-player-artist]').forEach((el) => {
      el.textContent = t.artist || '';
    });
    all('[data-player-cover]').forEach((el) => {
      if (el.getAttribute('src') !== t.cover) el.setAttribute('src', t.cover);
    });
    all('[data-player-toggle]').forEach((el) => {
      el.setAttribute('aria-label', state.playing ? '暂停' : '播放');
      el.setAttribute('aria-pressed', String(state.playing));
      el.classList.toggle('is-playing', state.playing);
    });
    all('[data-track]').forEach((el) => {
      const on = Number(el.getAttribute('data-track')) === state.i;
      el.classList.toggle('is-current', on);
      el.setAttribute('aria-current', on ? 'true' : 'false');
    });
    all('[data-player-link]').forEach((el) => {
      el.setAttribute('href', `https://music.163.com/song?id=${t.id}`);
    });
    drawProgress();
  }

  function drawProgress() {
    const t = track();
    const total = Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : (t.duration || 0) / 1000;
    const cur = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const ratio = total > 0 ? Math.min(1, cur / total) : 0;

    all('[data-player-fill]').forEach((el) => {
      el.style.width = `${ratio * 100}%`;
    });
    all('[data-player-time]').forEach((el) => {
      el.textContent = `${fmt(cur)} / ${fmt(total)}`;
    });
  }

  function setError(message) {
    all('[data-player-error]').forEach((el) => {
      if (message) {
        el.hidden = false;
        const slot = el.querySelector('[data-player-error-text]');
        if (slot) slot.textContent = message;
      } else {
        el.hidden = true;
      }
    });
  }

  function load(index, autoplay) {
    state.i = ((index % tracks.length) + tracks.length) % tracks.length;
    const t = track();
    state.started = true;
    setError('');
    all('[data-player-preview]').forEach((el) => {
      el.hidden = true;
    });
    audio.src = RESOLVE + encodeURIComponent(t.id);
    paint();
    if (autoplay) {
      const p = audio.play();
      if (p && p.catch) {
        p.catch(() => {
          state.playing = false;
          paint();
        });
      }
    }
  }

  function toggle() {
    if (!state.started) {
      load(state.i, true);
      return;
    }
    if (audio.paused) {
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      audio.pause();
    }
  }

  function next() {
    load(state.i + 1, true);
  }

  function prev() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    load(state.i - 1, true);
  }

  // 会员曲目在第三方接口上只有 30 秒：实际时长明显短于曲目时长就提示
  const checkPreview = () => {
    const t = track();
    const short =
      Number.isFinite(audio.duration) &&
      audio.duration > 0 &&
      t.duration > 0 &&
      audio.duration < (t.duration / 1000) * 0.8;
    all('[data-player-preview]').forEach((el) => {
      el.hidden = !short;
    });
  };

  audio.addEventListener('play', () => {
    state.playing = true;
    paint();
  });
  audio.addEventListener('pause', () => {
    state.playing = false;
    paint();
  });
  audio.addEventListener('timeupdate', drawProgress);
  audio.addEventListener('durationchange', () => {
    drawProgress();
    checkPreview();
  });
  audio.addEventListener('durationchange', drawProgress);
  audio.addEventListener('ended', next);
  audio.addEventListener('error', () => {
    state.playing = false;
    paint();
    setError('这首没拿到音频，可能是接口临时抽风。点「去网易云」听。');
  });

  document.addEventListener('click', (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    const trackEl = target.closest('[data-track]');
    if (trackEl) {
      load(Number(trackEl.getAttribute('data-track')), true);
      return;
    }

    const seek = target.closest('[data-player-seek]');
    if (seek) {
      const rect = seek.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const total = Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : (track().duration || 0) / 1000;
      audio.currentTime = ratio * total;
      drawProgress();
      return;
    }

    const btn = target.closest('[data-player]');
    if (!btn) return;
    const action = btn.getAttribute('data-player');
    if (action === 'toggle') toggle();
    else if (action === 'next') next();
    else if (action === 'prev') prev();
  });

  document.addEventListener('astro:page-load', () => {
    paint();
    setError('');
  });

  // 恢复上次听到的曲目，再从这个位置自动播
  try {
    const saved = Number(sessionStorage.getItem('pl-index'));
    if (Number.isInteger(saved) && saved >= 0 && saved < tracks.length) {
      state.i = saved;
      paint();
    }
  } catch {
    /* 无痕模式 */
  }

  const api = { load, toggle, next, prev, paint, audio, state };
  window.__player = api;
  paint();

  // 进站先试着自动播放；浏览器不让自动出声时，会静默失败停在暂停状态，
  // 用户点一下播放键即可（点击本身就是手势，能放）。
  setTimeout(() => {
    if (state.started) return;
    load(state.i, true);
  }, 260);

  return api;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
