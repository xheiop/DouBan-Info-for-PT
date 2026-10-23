import {
  CURRENT_SITE_INFO, CURRENT_SITE_NAME,
} from './const';
import {
  getImdbId, getTvSeasonData,
  addToPtpPage, getDoubanInfo, getDoubanInfoByIMDB, getDoubanInfoBySubject, getDoubanInfoFallback,
  addToANTPage, renderDoubanInfo,
} from './common';
import './style.css';

const CACHE_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;

// 读取本地缓存的豆瓣数据，过期视为未命中
const getCachedInfo = (imdbId) => {
  const cached = (GM_getValue('ids_v2') || {})[imdbId];
  if (cached && !(cached.updateTime && Date.now() - cached.updateTime >= CACHE_EXPIRE_TIME)) {
    return cached;
  }
};

// 依次尝试本地缓存、豆瓣API、解析豆瓣条目页面
const loadDoubanData = async (imdbId) => {
  const doubanData = getCachedInfo(imdbId) ||
    await getDoubanInfoByIMDB(imdbId) ||
    await getDoubanInfoFallback(imdbId);
  if (!doubanData) {
    throw new Error('没有找到豆瓣条目');
  }
  return doubanData;
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

(async () => {
  const imdbId = CURRENT_SITE_INFO ? await waitForImdbId() : '';
  if (!imdbId) {
    return;
  }
  try {
    const doubanData = await loadDoubanData(imdbId);
    // PTP、ANT 只有电影，直接插入站点页面
    if (CURRENT_SITE_NAME.match(/PTP/)) {
      addToPtpPage(doubanData);
    } else if (CURRENT_SITE_NAME.match(/ANT/)) {
      addToANTPage(doubanData);
    } else {
      const season = await resolveSeason(doubanData, imdbId);
      renderDoubanInfo(season.doubanData, season.doubanId, imdbId);
    }
  } catch (error) {
    console.log(error);
  }
})();
