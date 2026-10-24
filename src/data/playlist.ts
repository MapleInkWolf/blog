/**
 * 网易云歌单：测试歌单-精选
 * https://music.163.com/playlist?id=12763404968
 *
 * 数据在构建时写死，不依赖网易云接口——GitHub Actions 的机器在海外，
 * 构建时请求 music.163.com 容易超时。改了歌单就手动更新下面的列表。
 *
 * vip: true 表示这首需要网易云会员（接口里 fee=1 且 privilege.pl=0）。
 * 不带会员的人点开只会看到提示，站点上会把它们标出来。
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  /** 毫秒 */
  duration: number;
  /** 需要会员才能播放 */
  vip?: boolean;
}

export const PLAYLIST: {
  id: string;
  name: string;
  url: string;
  tracks: Track[];
} = {
  id: '12763404968',
  name: '测试歌单-精选',
  url: 'https://music.163.com/playlist?id=12763404968',
  tracks: [
    {
      id: '3407412711',
      title: 'What an Electromagnetic Night',
      artist: '塞壬唱片-MSR / Mackenzie Sol / Chapters / Alec Justice',
      duration: 193770,
    },
    {
      id: '1990154664',
      title: 'Running In The Dark',
      artist: 'MONKEY MAJIK / 塞壬唱片-MSR',
      duration: 220533,
      vip: true,
    },
    {
      id: '3359516988',
      title: 'eyeyeye³ (feat. Miku Hatsune)',
      artist: 'ミカヅキ BIGWAVE / 初音ミク',
      duration: 231549,
    },
    {
      id: '1904209110',
      title: 'ミラールージュ (feat. Liyuu)',
      artist: 'JUVENILE / Liyuu',
      duration: 260333,
      vip: true,
    },
    {
      id: '1904209111',
      title: 'シーリングライト・ファン (feat. DAZBEE)',
      artist: 'JUVENILE',
      duration: 188454,
      vip: true,
    },
    {
      id: '1904211789',
      title: 'かもね (feat. Natsumi)',
      artist: 'JUVENILE / natsumi',
      duration: 206207,
      vip: true,
    },
    {
      id: '3396599275',
      title: 'わたしを映画につれてって',
      artist: 'r-906 / IA',
      duration: 250840,
    },
    {
      id: '3423857646',
      title: '凡常恩典',
      artist: '塞壬唱片-MSR / 动点',
      duration: 226984,
    },
    {
      id: '3406178212',
      title: 'ワンダー',
      artist: 'r-906 / 初音ミク',
      duration: 180000,
    },
    {
      id: '2732680186',
      title: 'Drip in Sunrise',
      artist: 'Cihuex',
      duration: 145110,
    },
  ],
};

/** 毫秒 → 3:40 */
export function fmtDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** 歌单总时长 */
export function totalDuration(): string {
  const total = PLAYLIST.tracks.reduce((sum, t) => sum + t.duration, 0);
  return `${Math.round(total / 60000)} 分钟`;
}

/** 不需要会员的曲目数 */
export function playableCount(): number {
  return PLAYLIST.tracks.filter((t) => !t.vip).length;
}
