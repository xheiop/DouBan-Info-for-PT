import {
  CURRENT_SITE_INFO, CURRENT_SITE_NAME,
} from './const';
import {
  getImdbId, getTvSeasonData, isChinese,
  addToPtpPage, getDoubanInfo, getDoubanInfoByIMDB, getDoubanInfoBySubject, getDoubanInfoFallback,
  addToANTPage, renderDoubanInfo, addDarkLinkButton, addDoubanTitlesToList, addDoubanTitlesToPtpTop10,
  addPtpGroupNames, setListTmdb,
} from './common';
import { mergeTmdbInfo, getTmdbPoster, getTmdbSeasonEpisodeCount, registerTmdbMenu } from './tmdb';
import { replacePtpTrailer } from './trailer';
import './style.css';

const CACHE_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

// 读取本地缓存的豆瓣数据，过期视为未命中。
// 旧版本在豆瓣 API 没有中文别名时会把英文片名存进缓存，这类缓存同样视为未命中重新获取
const getCachedInfo = (imdbId) => {
  const cached = (GM_getValue('ids_v2') || {})[imdbId];
  if (
    cached && isChinese(cached.chineseTitle) &&
    !(cached.updateTime && Date.now() - cached.updateTime >= CACHE_EXPIRE_TIME)
  ) {
    return cached;
  }
};

// 依次尝试本地缓存、豆瓣API、解析豆瓣条目页面。
// 不再整体 throw：调用方需要知道豆瓣是否找到了条目（有编号就跳豆瓣，没有才跳 TMDB），
// 哪怕条目的中文片名是英文、没有剧情
const loadDoubanData = async (imdbId) => {
  const doubanData = getCachedInfo(imdbId) ||
    await getDoubanInfoByIMDB(imdbId) ||
    await getDoubanInfoFallback(imdbId);
  // 缓存里的编号存在 doubanId 字段，接口返回的存在 id 字段
  const doubanId = doubanData ? (doubanData.doubanId || doubanData.id || '') : '';
  return { doubanId, doubanData };
};

// 剧集按种子标题匹配对应季的条目。其他季没有对应的 IMDB 条目，改用豆瓣 ID 获取详情，
// 失败时退回解析该季的豆瓣页面，都取不到时沿用第一季的数据
const resolveSeason = async (doubanData, imdbId) => {
  // 缓存数据的条目 ID 存在 doubanId 字段
  const doubanId = doubanData.doubanId || doubanData.id;
  if (doubanData.episodes) {
    const seasonId = (await getTvSeasonData(doubanData))?.id;
    if (seasonId && seasonId !== doubanId) {
      const seasonData = await getDoubanInfoBySubject(seasonId) || await getDoubanInfo(seasonId, imdbId);
      if (seasonData) {
        return { doubanId: seasonId, doubanData: seasonData };
      }
    }
  }
  return { doubanId, doubanData };
};

// 部分站点的 IMDB 信息由页面脚本异步注入（如 HDS 的 #imdb 链接由 imdb.js 延迟填充），
// 取不到 IMDB 链接时轮询等待其出现，超时后放弃
const waitForImdbId = async (timeout = 15000) => {
  const deadline = Date.now() + timeout;
  let imdbId = getImdbId();
  while (!imdbId && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 300));
    imdbId = getImdbId();
  }
  return imdbId;
};

// PTP 的 Top 10 Movies 页（top10.php，含 Top 100 / Top 250）与影片浏览页
// （torrents.php）是同一套列表结构：Cover、Huge、List、Compact list 四种视图，
// 每个资源是一部影片而不是发行名，走单独的逻辑。
// torrents.php 同时是详情页地址（?id= 带组编号），用查询串区分：带 id 的走详情页流程
const isPtpTop10Page = () => {
  const { top10 } = CURRENT_SITE_INFO;
  if (!top10) {
    return false;
  }
  if (top10.path && new RegExp(top10.path).test(location.pathname)) {
    return true;
  }
  return !!top10.browsePath &&
    new RegExp(top10.browsePath).test(location.pathname) &&
    !/(?:[?&])id=/.test(location.search);
};
// 列表页（如 BHD 的 /torrents）与详情页（/torrents/{id}）是两套页面结构，走不同逻辑
const isListPage = () => {
  const { listPage } = CURRENT_SITE_INFO;
  if (!listPage?.path || !new RegExp(listPage.path).test(location.pathname)) {
    return false;
  }
  // 站点把列表页与详情页放在同一个路径时（如 HDS 的 index.php），再用查询串区分
  if (listPage.query && !new RegExp(listPage.query).test(location.search)) {
    return false;
  }
  // 列表与详情共路径时，详情页靠查询串里的编号识别（如 AlphaRatio 的
  // torrents.php?id= 是影片组详情页）：命中排除规则的查询串走详情页流程，
  // 否则列表页逻辑会在详情页上跑，详情页的豆瓣信息反而插不上
  return !listPage.excludeQuery || !new RegExp(listPage.excludeQuery).test(location.search);
};

(async () => {
  if (!CURRENT_SITE_INFO) {
    return;
  }
  // TMDB API Key 设置入口。没配 key 时兜底整体关闭，脚本行为与之前一致
  registerTmdbMenu();
  if (isPtpTop10Page()) {
    // 与列表页同一套 TMDB 兜底：中文片名、简介、评分各自独立回退
    setListTmdb({ merge: mergeTmdbInfo, poster: getTmdbPoster, seasonCount: getTmdbSeasonEpisodeCount });
    addDoubanTitlesToPtpTop10();
    return;
  }
  if (isListPage()) {
    // 列表页的 TMDB 兜底：字段合并与海报兜底都走这里注册进来
    setListTmdb({ merge: mergeTmdbInfo, poster: getTmdbPoster, seasonCount: getTmdbSeasonEpisodeCount });
    addDoubanTitlesToList();
    return;
  }
  const imdbId = await waitForImdbId();
  if (!imdbId) {
    return;
  }
  try {
    const { doubanId, doubanData } = await loadDoubanData(imdbId);
    // 豆瓣缺中文片名、剧情、海报时按字段从 TMDB 补齐；TMDB 也没有就留空，
    // 由站点展示自己的原始内容。返回 null 表示两个数据源都没有这个条目
    const info = await mergeTmdbInfo(doubanData, imdbId);
    if (!info) {
      throw new Error('没有找到影片条目');
    }
    // 豆瓣入口按钮、豆瓣评分、豆瓣卡片始终跳豆瓣；只有 TMDB 兜底到时才跳 TMDB，
    // 两个都没有则不跳
    const link = doubanId
      ? `https://movie.douban.com/subject/${doubanId}`
      : (info.tmdbUrl || '');
    // 片名取谁的数据就跳谁的详情页：豆瓣片名（含豆瓣只有英文片名时）跳豆瓣，
    // 中文片名由 TMDB 补上时跳 TMDB
    const titleLink = info.titleSource === 'tmdb' && info.tmdbUrl ? info.tmdbUrl : link;
    // PTP、ANT 只有电影，直接插入站点页面
    if (CURRENT_SITE_NAME.match(/PTP/)) {
      addToPtpPage(info);
      // 预告片处理不依赖豆瓣数据：撤掉 Synopsis 栏的播放器，菜单栏加 [Trailer] 链接
      replacePtpTrailer();
    } else if (CURRENT_SITE_NAME.match(/ANT/)) {
      addToANTPage(info);
    } else {
      const season = await resolveSeason(info, imdbId);
      renderDoubanInfo(season.doubanData, season.doubanId, imdbId, link, titleLink);
    }
  } catch (error) {
    console.log(error);
    // 没有影片条目时，PTP 的种子组名、预告片入口这些不依赖豆瓣数据的优化照常做
    if (CURRENT_SITE_NAME.match(/PTP/)) {
      addPtpGroupNames();
      replacePtpTrailer();
    }
    // 没有影片条目时补上暗色的豆瓣入口按钮，保持外链栏完整
    addDarkLinkButton();
  }
})();
