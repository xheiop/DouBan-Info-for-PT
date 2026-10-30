// TMDB 兜底数据源：豆瓣拿不到中文片名、剧情、海报时按字段逐个补齐。
// 三个字段各自独立回退，互不影响 —— 豆瓣有片名但没有剧情时，片名用豆瓣、剧情用 TMDB：
//   片名  豆瓣 → TMDB → 站点原始
//   剧情  豆瓣 → TMDB → 站点原始
//   海报  豆瓣 → TMDB → 站点原始
// 与豆瓣完全独立：各自的请求闸门、各自的缓存，互不占用对方的请求额度。
// 没配 API Key 时整个通道静默关闭，脚本行为与加 TMDB 之前完全一致
// 鉴权支持两种：v4 的 Read Access Token（Authorization: Bearer 头，推荐）与
// v3 的 api_key（URL 查询参数）。粘哪种都能用，按内容自动识别
import { isChinese, createRequestGate, gmFetch, normalizeTitle } from './common';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p';
// 海报尺寸。TMDB 图片 CDN 免鉴权、免 Referer，直接 <img> 就能显示，
// 不像豆瓣图床那样不带 Referer 就返回 418，所以不需要脚本再拉一次
const TMDB_POSTER_SIZE = 'w500';
const TMDB_API_KEY_STORAGE = 'tmdb_api_key';
const TMDB_CACHE_KEY = 'tmdb_v1';
const TMDB_CACHE_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;
// TMDB 的限流在 40 次/秒左右（官方文档原文 "somewhere in the 40 requests per second
// range"），这里压到 10 次/秒，留 4 倍余量；超限返回 429，退避后重试一次
const TMDB_REQUEST_INTERVAL = 100;
const TMDB_RETRY_DELAY = 1500;
// 中文按 简体 → 香港繁体 → 台湾繁体 回退。三者的 iso_639_1 都是 zh，
// 只按 iso_639_1 取会随机命中任意一个繁体版本，必须再用 iso_3166_1 区分
const TMDB_ZH_REGIONS = ['CN', 'HK', 'TW'];

const getTmdbApiKey = () => String(GM_getValue(TMDB_API_KEY_STORAGE) || '').trim();
const isV4Token = (key) => /^eyJ/i.test(String(key || '').trim());
const setTmdbApiKey = (key) => GM_setValue(TMDB_API_KEY_STORAGE, String(key || '').trim());
const hasTmdbApiKey = () => !!getTmdbApiKey();
// v4 的 Read Access Token 是 JWT，base64 的头部固定以 eyJ 开头；
// v3 的 api_key 是 32 位十六进制，不会以 eyJ 开头，靠这个区分
// 闸门与豆瓣共用同一个实现，但各开一条：互不占用对方的请求额度。
// 详情页一次只有一部影片、2 个请求无所谓；列表页一页几十行，靠 100ms 间隔压住
const waitTmdbRequestSlot = createRequestGate(TMDB_REQUEST_INTERVAL);
const getTmdbCache = () => {
  const cache = GM_getValue(TMDB_CACHE_KEY) || {};
  return cache;
};
// 本页内存里的负结果：同一部影片在一页里会被合并两遍（列表条目的检索合并、
// 条目详情的兜底合并），第二遍的键与第一遍完全一致。负结果按设计不进 30 天
// 缓存（TMDB 的库每天都在长，30 天后值得再试），但本页再问一遍答案不会变，
// 白打一次接口。记在这里，刷新页面后清空，30 天后的重试不受影响
const tmdbMissKeys = new Set();
const setTmdbCache = (cache) => GM_setValue(TMDB_CACHE_KEY, cache);
// 豆瓣没有中文简介时保留站点原简介，与 replaceNativeInfo 里的判断保持一致
const hasChineseSummary = (data) => !!data?.summary &&
  data.summary !== '暂无相关剧情介绍' &&
  isChinese(data.summary);
// TMDB 出错时返回 HTTP 200 + {status_code, status_message}（如 7 无效 key、25 超限），
// 正常响应没有 status_code 字段，靠它区分
const isTmdbError = (data) => !data || typeof data !== 'object' || 'status_code' in data;
const fetchTmdbApi = async (path, allowRetry = true) => {
  if (!hasTmdbApiKey()) {
    return null;
  }
  await waitTmdbRequestSlot();
  try {
    const key = getTmdbApiKey();
    const options = { responseType: 'json' };
    let url = `${TMDB_API_URL}${path}`;
    if (isV4Token(key)) {
      // v4：令牌放 Authorization 头，不进 URL
      options.headers = { Authorization: `Bearer ${key}` };
    } else {
      const sep = path.includes('?') ? '&' : '?';
      url += `${sep}api_key=${encodeURIComponent(key)}`;
    }
    // 与豆瓣共用 GM_xmlhttpRequest 通道：绕开页面 CSP 与跨域限制，
    // 列表页一页几十行时也不会被站点的安全策略拦掉
    const data = await gmFetch(url, options);
    if (isTmdbError(data)) {
      // key 无效时没必要重试，直接放弃这一轮的 TMDB 兜底
      throw new Error(data?.status_message || 'TMDB 请求失败');
    }
    return data;
  } catch (error) {
    console.log('TMDB', error);
    if (!allowRetry) {
      return null;
    }
    await new Promise(resolve => setTimeout(resolve, TMDB_RETRY_DELAY));
    return fetchTmdbApi(path, false);
  }
};
// 取中文翻译：CN → HK → TW 依次回退，都没有时返回 null
const pickChineseTranslation = (translations) => {
  const zh = (translations || []).filter(item => item.iso_639_1 === 'zh' && item.data);
  for (const region of TMDB_ZH_REGIONS) {
    const hit = zh.find(item => item.iso_3166_1 === region);
    if (hit) {
      return hit.data;
    }
  }
  return null;
};
// 请求带 language=zh-CN，顶层 title/name、overview 会被本地化成中文，
// 翻译接口没数据时用它们兜底；仍然是原文（英文）的按没有中文处理
const chineseFrom = (translated, original) => {
  const fromTranslation = (translated || '').trim();
  if (fromTranslation) {
    return fromTranslation;
  }
  return isChinese(original) ? String(original).trim() : '';
};
const normalizeTmdbMovie = (data) => {
  const zh = pickChineseTranslation(data.translations?.translations);
  return {
    mediaType: 'movie',
    tmdbId: String(data.id),
    title: chineseFrom(zh?.title, data.title),
    year: (data.release_date || '').slice(0, 4),
    summary: chineseFrom(zh?.overview, data.overview),
    poster: data.poster_path ? `${TMDB_IMAGE_URL}/${TMDB_POSTER_SIZE}${data.poster_path}` : '',
    rating: parseFloat(data.vote_average) || 0,
    votes: parseInt(data.vote_count, 10) || 0,
    webUrl: `https://www.themoviedb.org/movie/${data.id}`,
  };
};
const normalizeTmdbTv = (data) => {
  const zh = pickChineseTranslation(data.translations?.translations);
  return {
    mediaType: 'tv',
    tmdbId: String(data.id),
    title: chineseFrom(zh?.name, data.name),
    year: (data.first_air_date || '').slice(0, 4),
    summary: chineseFrom(zh?.overview, data.overview),
    poster: data.poster_path ? `${TMDB_IMAGE_URL}/${TMDB_POSTER_SIZE}${data.poster_path}` : '',
    rating: parseFloat(data.vote_average) || 0,
    votes: parseInt(data.vote_count, 10) || 0,
    webUrl: `https://www.themoviedb.org/tv/${data.id}`,
  };
};
// 按 IMDb 编号定位 TMDB 条目，与详情页豆瓣的匹配方式一致，不会错配。
// find 接口一次返回电影、剧集、季、集四类结果，按这个优先级取
const findTmdbId = async (imdbId) => {
  if (!imdbId) {
    return null;
  }
  const data = await fetchTmdbApi(`/find/${encodeURIComponent(imdbId)}?external_source=imdb_id&language=zh-CN`);
  if (!data) {
    return null;
  }
  if (data.movie_results?.length) {
    return { mediaType: 'movie', tmdbId: String(data.movie_results[0].id) };
  }
  if (data.tv_results?.length) {
    return { mediaType: 'tv', tmdbId: String(data.tv_results[0].id) };
  }
  // 季、集结果里带的是所属剧集编号，取出来按剧集处理
  const season = data.tv_season_results?.[0];
  const episode = data.tv_episode_results?.[0];
  if (season?.show_id) {
    return { mediaType: 'tv', tmdbId: String(season.show_id) };
  }
  if (episode?.show_id) {
    return { mediaType: 'tv', tmdbId: String(episode.show_id) };
  }
  return null;
};
// 取 TMDB 条目详情：translations 用 append_to_response 拼在同一次请求里，
// 不额外增加往返；external_ids 一并拿到，以后要按 IMDb 反查就不用再问 find
const getTmdbDetail = async (mediaType, tmdbId) => {
  const path = mediaType === 'movie' ? `/movie/${tmdbId}` : `/tv/${tmdbId}`;
  const data = await fetchTmdbApi(`${path}?language=zh-CN&append_to_response=translations,external_ids`);
  if (!data) {
    return null;
  }
  return mediaType === 'movie' ? normalizeTmdbMovie(data) : normalizeTmdbTv(data);
};
// 详情页入口：按 IMDb 定位 + 取详情，结果按 IMDb 编号缓存 30 天。
// 返回 null 表示没配 key、TMDB 也没有这个条目，调用方保持豆瓣/站点原始数据
const getTmdbInfo = async (imdbId) => {
  if (!hasTmdbApiKey() || !imdbId) {
    return null;
  }
  const cache = getTmdbCache();
  const cacheKey = `imdb:${imdbId}`;
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.updateTime < TMDB_CACHE_EXPIRE_TIME) {
    return cached.info;
  }
  // 本页已经确认过没有条目，直接认，不再问一遍
  if (tmdbMissKeys.has(cacheKey)) {
    return null;
  }
  const found = await findTmdbId(imdbId);
  if (!found) {
    // 没查到不入库：TMDB 的库每天都在长，30 天后值得再试一次。
    // 只记在本页内存里，刷新页面后又是一次全新的尝试
    tmdbMissKeys.add(cacheKey);
    return null;
  }
  const info = await getTmdbDetail(found.mediaType, found.tmdbId);
  if (!info) {
    tmdbMissKeys.add(cacheKey);
    return null;
  }
  cache[cacheKey] = { info, updateTime: Date.now() };
  setTmdbCache(cache);
  return info;
};
// 从检索结果里挑条目：片名是拉丁文字时要求与结果完全相等（包含关系太松，
// 会挂上同系列别的作品）；是中日韩等非拉丁文字时（豆瓣原始片名常是原文）
// 只要求年份对得上。电影比 title，剧集比 name，两个字段都算
const pickTmdbSearchHit = (results, query, year, latin, kind) => {
  const list = Array.isArray(results) ? results : [];
  return list.find((item) => {
    const itemYear = (item.release_date || item.first_air_date || '').slice(0, 4);
    if (year && itemYear !== String(year)) {
      return false;
    }
    if (!latin) {
      return true;
    }
    const names = kind === 'tv'
      ? [item.name, item.original_name]
      : [item.title, item.original_title];
    return names.some(name => name && name.length > 2 && normalizeTitle(name) === normalizeTitle(query));
  }) || null;
};
// 没有 IMDb 编号的站点（如 BTN 的列表页不放外部编号）按片名 + 年份检索 TMDB。
// 用豆瓣条目的原始片名（或资源发行名）检索；年份或原始片名对不上的
// 结果一律不采用，避免挂上别的影片的海报
const searchTmdbByTitle = async (title, year, mediaType) => {
  const kind = mediaType === 'tv' ? 'tv' : 'movie';
  const query = String(title || '').trim();
  if (!query) {
    return null;
  }
  // 片名是拉丁文字时才能只凭片名认定（完全相等），非拉丁文字只能靠年份兜
  const latin = /^[\x20-\x7e]+$/.test(query);
  // 剧集资源里的年份是这一季的首播年，TMDB 的 first_air_date_year 是整部剧的
  // 首播年，老剧的新一季按年份一条都搜不到：拉丁片名有完全相等的判断兜底，
  // 再去掉年份搜一次；非拉丁片名没有这层保障，仍然只按年份搜
  const years = kind === 'tv' && year && latin ? [year, ''] : [year || ''];
  for (const itemYear of years) {
    const params = [`query=${encodeURIComponent(query)}`, 'language=zh-CN'];
    if (itemYear) {
      params.push(kind === 'tv' ? `first_air_date_year=${encodeURIComponent(itemYear)}` : `year=${encodeURIComponent(itemYear)}`);
    }
    const data = await fetchTmdbApi(`/search/${kind}?${params.join('&')}`);
    const hit = pickTmdbSearchHit(data?.results, query, itemYear, latin, kind);
    if (hit) {
      return { mediaType: kind, tmdbId: String(hit.id) };
    }
  }
  return null;
};
// 按片名检索到的条目同样按 片名 + 年份 缓存 30 天
const getTmdbInfoByTitle = async (title, year, mediaType) => {
  if (!hasTmdbApiKey() || !title) {
    return null;
  }
  const cache = getTmdbCache();
  const cacheKey = `title:${normalizeTitle(title)}|${year || ''}|${mediaType || ''}`;
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.updateTime < TMDB_CACHE_EXPIRE_TIME) {
    return cached.info;
  }
  if (tmdbMissKeys.has(cacheKey)) {
    return null;
  }
  const found = await searchTmdbByTitle(title, year, mediaType);
  if (!found) {
    tmdbMissKeys.add(cacheKey);
    return null;
  }
  const info = await getTmdbDetail(found.mediaType, found.tmdbId);
  if (!info) {
    tmdbMissKeys.add(cacheKey);
    return null;
  }
  cache[cacheKey] = { info, updateTime: Date.now() };
  setTmdbCache(cache);
  return info;
};
// 整季资源的「全N集」需要该季的总集数。豆瓣没有条目（列表页整份数据用 TMDB）时，
// 按剧集编号取这一季的集数；结果按 剧集 + 季 缓存 30 天
const getTmdbSeasonEpisodeCount = async (tmdbId, season) => {
  if (!hasTmdbApiKey() || !tmdbId || !season) {
    return 0;
  }
  const cache = getTmdbCache();
  const cacheKey = `season:${tmdbId}:${season}`;
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.updateTime < TMDB_CACHE_EXPIRE_TIME) {
    return cached.count || 0;
  }
  const data = await fetchTmdbApi(`/tv/${encodeURIComponent(tmdbId)}/season/${encodeURIComponent(season)}?language=zh-CN`);
  const count = Array.isArray(data?.episodes) ? data.episodes.length : 0;
  cache[cacheKey] = { count, updateTime: Date.now() };
  setTmdbCache(cache);
  return count;
};
// 列表页海报兜底：豆瓣海报在页面里直连失败（站点不发 Referer，豆瓣图床返回 418）
// 时才调用。优先按 IMDb 编号精确匹配，站点行里没有 IMDb 编号时
// （如 BTN）退回按豆瓣条目的原始片名 + 年份检索。结果缓存 30 天，
// 同一个条目反复悬浮只请求一次
const getTmdbPoster = async (imdbId, title = '', year = '', mediaType = '') => {
  const info = (imdbId && await getTmdbInfo(imdbId)) ||
    (title ? await getTmdbInfoByTitle(title, year, mediaType) : null);
  return info?.poster || '';
};
// 逐字段合并。豆瓣三个字段都齐时直接返回，一个 TMDB 请求都不打；
// 缺哪个补哪个，TMDB 也没有的字段留空，由站点展示自己的原始内容。
// 片名与简介：谁有中文就用谁的（豆瓣中文 → TMDB 中文 → 豆瓣原文）；
// 海报：豆瓣 → TMDB → 站点原始，与另外两个字段的回退顺序不同
const mergeTmdbInfo = async (doubanData, imdbId, release = null) => {
  const needTitle = !isChinese(doubanData?.chineseTitle);
  const needSummary = !hasChineseSummary(doubanData);
  const needPoster = !doubanData?.poster;
  // 评分同样各自独立回退：豆瓣没有评分时用 TMDB 的。详情页的豆瓣数据评分在
  // average 字段，列表页的在 rating 字段，两个都看，避免为一条评分多打请求
  const needRating = !(parseFloat(doubanData?.rating) > 0 || parseFloat(doubanData?.average) > 0);
  if (!needTitle && !needSummary && !needPoster && !needRating) {
    return doubanData || null;
  }
  // 优先按 IMDb 编号精确匹配；站点行里没有 IMDb 编号时（如 BTN 的列表页），
  // 或按编号没找到时，退回按片名 + 年份检索。片名取资源发行名：
  // 豆瓣有条目时用它的原始片名（比发行名可靠），没有条目时只有发行名可用
  const searchTitle = doubanData?.originalTitle || release?.queries?.[0] || release?.name || '';
  const mediaType = release?.season ? 'tv' : (doubanData?.subtype || release?.subtype || '');
  const tmdb = (imdbId && await getTmdbInfo(imdbId)) ||
    (searchTitle ? await getTmdbInfoByTitle(searchTitle, doubanData?.year || release?.year || '', mediaType) : null);
  if (!tmdb) {
    return doubanData || null;
  }
  const merged = { ...(doubanData || {}) };
  // 片名取自哪个数据源：豆瓣有条目时默认豆瓣，中文片名由 TMDB 补上时算 TMDB。
  // 调用方据此决定片名链接跳豆瓣还是跳 TMDB（豆瓣入口按钮始终跳豆瓣）
  let titleSource = doubanData ? 'douban' : '';
  if (needTitle && tmdb.title) {
    merged.chineseTitle = tmdb.title;
    titleSource = 'tmdb';
  }
  if (needSummary && tmdb.summary) {
    merged.summary = tmdb.summary;
  }
  if (needPoster && tmdb.poster) {
    merged.poster = tmdb.poster;
  }
  if (needRating && tmdb.rating) {
    merged.rating = tmdb.rating;
    merged.votes = tmdb.votes || 0;
    // 评分来自 TMDB：调用方据此把评分链接指向 TMDB 条目页
    merged.ratingSource = 'tmdb';
  }
  merged.tmdbUrl = tmdb.webUrl;
  merged.titleSource = titleSource;
  // 编号与媒体类型留给列表页取该季总集数（整季资源显示「全N集」）
  merged.tmdbId = tmdb.tmdbId;
  merged.mediaType = tmdb.mediaType;
  return merged;
};
// 脚本菜单：让用户填自己的 TMDB API Key。Key 只存在本地 GM_setValue 里，
// 不随脚本源码分发 —— Greasyfork 上的脚本人人可读，内嵌 key 会被滥用导致被封
const registerTmdbMenu = () => {
  GM_registerMenuCommand('设置 TMDB API Key（豆瓣兜底）', () => {
    const input = window.prompt(
      '请输入 TMDB 的 API Read Access Token（v4，在 themoviedb.org/settings/api 申请）\n' +
      '也兼容 v3 的 api_key，粘哪种都能用。\n' +
      '留空并确定可清除已保存的 Key。保存后刷新页面生效。',
      getTmdbApiKey(),
    );
    if (input === null) {
      return;
    }
    setTmdbApiKey(input);
    if (input.trim()) {
      window.alert('TMDB API Key 已保存，刷新页面后生效。');
    } else {
      window.alert('TMDB API Key 已清除，豆瓣兜底已关闭。');
    }
  });
};
export {
  getTmdbApiKey,
  setTmdbApiKey,
  hasTmdbApiKey,
  getTmdbInfo,
  getTmdbInfoByTitle,
  searchTmdbByTitle,
  getTmdbPoster,
  getTmdbSeasonEpisodeCount,
  mergeTmdbInfo,
  registerTmdbMenu,
  TMDB_API_KEY_STORAGE,
};
