/**
 * 网易云歌单：测试歌单-精选
 * https://music.163.com/playlist?id=12763404968
 *
 * 音频不直接引用网易云 CDN（地址带时效），而是走 Meting 接口在播放时解析：
 * https://api.injahow.cn/meting/?server=netease&type=url&id=<songId>
 * 它会 302 到真实 mp3，<audio> 直接吃这个跳转。接口挂了就退回「去网易云听」。
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  /** 毫秒 */
  duration: number;
  /** 封面，网易云图床 */
  cover: string;
  /** 会员曲目：第三方接口只给 30 秒试听 */
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
      cover: 'https://p1.music.126.net/pbh_zF7QDwyTfx5P4CEciA==/109951173569912840.jpg?param=300y300',
    },
    {
      id: '1990154664',
      title: 'Running In The Dark',
      artist: 'MONKEY MAJIK / 塞壬唱片-MSR',
      duration: 220533,
      cover: 'https://p1.music.126.net/xxQXfMnMlJyMlydzVsRcag==/109951167974724190.jpg?param=300y300',
      vip: true,
    },
    {
      id: '3359516988',
      title: 'eyeyeye³ (feat. Miku Hatsune)',
      artist: 'ミカヅキ BIGWAVE / 初音ミク',
      duration: 231549,
      cover: 'https://p1.music.126.net/YQIW2sM0W92OhI6AX2NPJg==/109951172892891645.jpg?param=300y300',
    },
    {
      id: '1904209110',
      title: 'ミラールージュ (feat. Liyuu)',
      artist: 'JUVENILE / Liyuu',
      duration: 260333,
      cover: 'https://p1.music.126.net/EyZZnUJhTtwA-WomFLdaOA==/109951170165161319.jpg?param=300y300',
      vip: true,
    },
    {
      id: '1904209111',
      title: 'シーリングライト・ファン (feat. DAZBEE)',
      artist: 'JUVENILE',
      duration: 188454,
      cover: 'https://p1.music.126.net/EyZZnUJhTtwA-WomFLdaOA==/109951170165161319.jpg?param=300y300',
      vip: true,
    },
    {
      id: '1904211789',
      title: 'かもね (feat. Natsumi)',
      artist: 'JUVENILE / natsumi',
      duration: 206207,
      cover: 'https://p1.music.126.net/EyZZnUJhTtwA-WomFLdaOA==/109951170165161319.jpg?param=300y300',
      vip: true,
    },
    {
      id: '3396599275',
      title: 'わたしを映画につれてって',
      artist: 'r-906 / IA',
      duration: 250840,
      cover: 'https://p1.music.126.net/Z8TvZvXgR_sgpL2_QtwcpA==/109951173439241138.jpg?param=300y300',
    },
    {
      id: '3423857646',
      title: '凡常恩典',
      artist: '塞壬唱片-MSR / 动点',
      duration: 226984,
      cover: 'https://p1.music.126.net/t0Me8MkTp7Mf05CwiG23PQ==/109951173790321896.jpg?param=300y300',
    },
    {
      id: '3406178212',
      title: 'ワンダー',
      artist: 'r-906 / 初音ミク',
      duration: 180000,
      cover: 'https://p1.music.126.net/cOQdwWu53og2PCGny3ub0Q==/109951173553130997.jpg?param=300y300',
    },
    {
      id: '2732680186',
      title: 'Drip in Sunrise',
      artist: 'Cihuex',
      duration: 145110,
      cover: 'https://p1.music.126.net/x5hQuNbcvoYHMQcbl6yZZw==/109951171648190172.jpg?param=300y300',
    },
    {
      id: '3413072224',
      title: '连烦恼也融入天空',
      artist: '塞壬唱片-MSR / F.L.O.A.T (白羽） / 张晶',
      duration: 169025,
      cover: 'https://p1.music.126.net/CynRt45ikTcMLhKRPC3WVA==/109951173656741133.jpg?param=300y300',
    },
    {
      id: '3413072220',
      title: '直到大地变成一颗酸橙',
      artist: '塞壬唱片-MSR / 平林佑人 / 星熊南巫 / Earthists.',
      duration: 240428,
      cover: 'https://p1.music.126.net/CynRt45ikTcMLhKRPC3WVA==/109951173656741133.jpg?param=300y300',
    },
    {
      id: '3410744228',
      title: '酸橙色信笺',
      artist: '塞壬唱片-MSR / DAZBEE',
      duration: 229500,
      cover: 'https://p1.music.126.net/dBsNnlV6lSYCBuLUEwAGUQ==/109951173628666804.jpg?param=300y300',
    },
    {
      id: '2123802244',
      title: 'Changing Seasons -Reload-',
      artist: '高橋あず美 / アトラスサウンドチーム / ATLUS GAME MUSIC',
      duration: 194680,
      cover: 'https://p1.music.126.net/wV5oF-XNh-RsjrYzmBbe3w==/109951172181637798.jpg?param=300y300',
      vip: true,
    },
    {
      id: '2123807711',
      title: 'Want To Be Close -Reload-',
      artist: '高橋あず美 / アトラスサウンドチーム / ATLUS GAME MUSIC',
      duration: 126653,
      cover: 'https://p1.music.126.net/wV5oF-XNh-RsjrYzmBbe3w==/109951172181637798.jpg?param=300y300',
      vip: true,
    },
    {
      id: '1914671658',
      title: 'reminisce (feat. Such)',
      artist: 'Mameyudoufu / Such',
      duration: 206473,
      cover: 'https://p1.music.126.net/X8i-FDcHdjcXKnHxiCLjww==/109951170353327628.jpg?param=300y300',
    },
    {
      id: '2098473571',
      title: 'Bunny Bunny Carrot Carrot',
      artist: 'ミツキヨ',
      duration: 115700,
      cover: 'https://p1.music.126.net/VuNnmdufww-wGkHLQH-wsA==/109951169045277384.jpg?param=300y300',
    },
  ],
};

/** 音频地址：Meting 会 302 到真实 mp3 */
export function audioUrl(id: string): string {
  return `https://api.injahow.cn/meting/?server=netease&type=url&id=${id}`;
}

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

/** 按 id 取曲目序号（1 起），找不到返回 0 */
export function trackNo(id: string): number {
  return PLAYLIST.tracks.findIndex((t) => t.id === id) + 1;
}
