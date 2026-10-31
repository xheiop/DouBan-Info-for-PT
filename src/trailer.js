// PTP 详情页的预告片：Synopsis 栏里内嵌的 YouTube 播放器国内网络播放不了，页面 head
// 里的 <meta name="referrer" content="no-referrer"> 还会让播放器报 153。把这个播放器
// 连同 (Hide trailer) 开关整个撤掉，Synopsis 栏只留剧情简介；预告片入口挪到片名下方
// 的功能菜单栏，在 [Subscribe] 右侧加一个 [Trailer] 链接，点它跳转 YouTube 预告片页面
// 视频 ID 两种形态都认：真实站点是 youtube.com/embed/<id>、youtu.be/<id>，
// 本地存档页把 src 改写成了 .../<id>.html，末段去掉扩展名就是 ID
const getTrailerVideoId = (src) => {
  const url = String(src || '').trim();
  const matched = url.match(/youtube(?:-nocookie)?\.com\/(?:embed|v|shorts)\/([\w-]{6,})|youtu\.be\/([\w-]{6,})/i);
  if (matched) {
    return matched[1] || matched[2];
  }
  const tail = url.split('/').pop().replace(/\.html?$/i, '');
  return /^[\w-]{6,}$/.test(tail) ? tail : '';
};
// 预告片入口挪进功能菜单栏：类名用站点原有的 linkbox__link，字号、颜色与相邻按钮
// 完全一致；站点各按钮之间靠 HTML 空白分隔，补一个空格文本节点保持相同间距
const addPtpTrailerLink = (videoId) => {
  if (!videoId || document.querySelector('#ptp-trailer-link')) {
    return;
  }
  const link = document.createElement('a');
  link.id = 'ptp-trailer-link';
  link.className = 'linkbox__link';
  link.href = `https://www.youtube.com/watch?v=${videoId}`;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = '[Trailer]';
  const subscribe = Array.from(document.querySelectorAll('.linkbox__link'))
    .find(item => /\[Subscribe\]/.test(item.textContent));
  if (subscribe) {
    subscribe.after(document.createTextNode(' '), link);
  } else {
    document.querySelector('.linkbox')?.appendChild(link);
  }
};
// Synopsis 栏只留剧情简介：预告片播放器整个撤掉，(Hide/Show trailer) 开关连同样式
// span 一起摘；面板、标题与 #synopsis 保持原样（简介替换逻辑还指着 #synopsis）
const removePtpSynopsisTrailer = () => {
  document.querySelector('#trailer')?.remove();
  const toggle = document.querySelector('#toggletrailer');
  if (toggle) {
    const box = toggle.parentElement;
    toggle.remove();
    // 开关外面包着一个右浮动 span，链接摘掉后盒子空了就一起摘掉
    if (box && box !== document.body && !box.textContent.trim()) {
      box.remove();
    }
  }
};
// 先记住播放器地址里的视频 ID，再撤播放器、加菜单栏入口；没有预告片就不加链接
const replacePtpTrailer = () => {
  const videoId = getTrailerVideoId(document.querySelector('#trailer iframe')?.getAttribute('src'));
  removePtpSynopsisTrailer();
  addPtpTrailerLink(videoId);
};
export {
  getTrailerVideoId,
  replacePtpTrailer,
};
