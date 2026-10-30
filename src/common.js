import {
  CURRENT_SITE_INFO,
  DOUBAN_API_URL, DOUBAN_SEARCH_API, CURRENT_SITE_NAME, DOUBAN_SUGGEST_API,
  DOUBAN_SUGGEST_API_URL, DOUBAN_SUBJECT_URL,
} from './const';
import $ from 'jquery';

const isChinese = (title) => {
  return /[\u4e00-\u9fa5]+/.test(title);
};
// PTP 的评分表格把各站图标并排放在同一行，统一是 64×64 的位图（IMDb 票根、
// Metacritic 圆标、烂番茄、爆米花），外面套 <a class="rating"> 再套 <center>。
// 豆瓣按同一套规范做：绿色票根叠一张浅色的、刻出票根缺口，中间放「豆瓣」字样。
// 用内联 SVG 数据地址，不请求外网，随脚本一起分发
const PTP_DOUBAN_RATING_ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">' +
  '<g transform="translate(32 32) scale(0.74) translate(-32 -32)">' +
  '<g transform="translate(5 -5) rotate(13 32 32)">' +
  '<rect x="10" y="17" width="44" height="30" rx="4" fill="#009845"/></g>' +
  '<path fill="#007722" d="M12 20h40a4 4 0 0 1 4 4v6a3.6 3.6 0 0 0 0 7.2v6a4 4 0 0 1-4 4H12' +
  'a4 4 0 0 1-4-4v-6a3.6 3.6 0 0 0 0-7.2v-6a4 4 0 0 1 4-4z"/>' +
  '<text x="32" y="41.2" text-anchor="middle" font-family="PingFang SC,Hiragino Sans GB,' +
  'Microsoft YaHei,Noto Sans CJK SC,sans-serif" font-size="18" font-weight="700" ' +
  'fill="#ffffff" letter-spacing="1">豆瓣</text>' +
  '</g></svg>',
)}`;
const addToPtpPage = (data) => {
  console.log(data);
  $('.page__title').prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
  // 豆瓣片名与站点原片名相同时删掉站点原片名，只保留豆瓣片名
  dedupePrependedTitle('.page__title', data.chineseTitle);
  if (data.summary) {
    const synopsisDom = `
    <div class="panel" id="douban-synopsis">
    <div class="panel__heading"><span class="panel__heading__title">中文简介</span></div>
    <div class="panel__body">
          <div id="synopsis">${data.summary}</div>
    </div>
    </div>`;
    $('#synopsis-and-trailer,#request-table').after(synopsisDom);
  }
  $('#movieinfo').before(`
    <div class="panel">
    <div class="panel__heading"><span class="panel__heading__title">电影信息</span></div>
    <div class="panel__body">
    <div><strong>导演:</strong> ${data.director}</div>
    <div><strong>类型:</strong> ${data.genre}</div>
    <div><strong>制片国家/地区:</strong> ${data.region}</div>
    <div><strong>语言:</strong> ${data.language}</div>
    <div><strong>时长:</strong> ${data.runtime}</div>
    <div><strong>又名:</strong>  ${data.aka}</div
    </div>`);
  if (data.average) {
    // 图标格与评分格都照站点原生的宽度来：IMDb 是 63px + 90px，
    //  Metastric 是 56px + 51px，64×64 的图配 63px 的格子正合适
    const votesText = data.votes ? Number(data.votes).toLocaleString('en-US') : '';
    $('#movie-ratings-table tr').prepend(
    `<td colspan="1" style="width: 63px;"><center><a target="_blank" class="rating" href="${data.link}" rel="noreferrer"><img src="${PTP_DOUBAN_RATING_ICON}" style="height:64px;width:64px;" title="Douban"></a></center></td>
    <td style="width: 90px;"><span class="rating">${data.average}</span> <span class="mid">/</span> <span class="outof"> 10</span><br>(${votesText} votes)</td>`);
  }
  $('.main-column').prepend($('#movie-ratings-table').parent());
};
const addToANTPage = (data) => {
  console.log(data);
  $('.header h2').prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
  // 豆瓣片名与站点原片名相同时删掉站点原片名，只保留豆瓣片名
  dedupePrependedTitle('.header h2', data.chineseTitle);
  if (data.summary) {
    const synopsisDom = `
    <div class="box torrent_description">
      <div class="head"><a href="#">↑</a>&nbsp;<strong>中文简介</strong></div>
      <div class="body" style="text-align:justify">${data.summary}</div>
    </div>`;
    $('.torrent_description,.box_request_desc').after(synopsisDom);
  }
  $('.box_details:first').before(`
    <div class="box box_details">
      <div class="head"><strong></strong>电影信息</div>
      <div class="pad">
        <ul class="stats nobullet">
          <li><strong>导演:</strong> ${data.director}</li>
          <li><strong>类型:</strong> ${data.genre}</li>
          <li><strong>制片国家/地区:</strong> ${data.region}</li>
          <li><strong>语言:</strong> ${data.language}</li>
          <li><strong>时长:</strong> ${data.runtime}</li>
          <li><strong>又名:</strong>  ${data.aka}</li
      </ul>
      </div>    
    </div>`);
  if (data.average) {
    $('.box.torrent_ratings .body tr').prepend(
    `<td colspan="1">
      <center>
        <a target="_blank" class="rating ant" href="${data.link}" rel="noreferrer">
          <div style="font-size: 0;">
            <span class="icon-pt1">豆</span>
          </div>
        </a>
      </center>
    </td>
    <td>
      <span class="rating">${data.average}</span>
      <span class="mid">/</span>
      <span class="outof"> 10</span>
      <br>(${data.votes} votes)</td>`);
  }
  $('.main_column').prepend($('.box.torrent_ratings'));
};
const getImdbId = () => {
  let imdbLink = '';
  const imdbConfig = CURRENT_SITE_INFO.imdb;
  if (typeof imdbConfig === 'object') {
    try {
      Object.keys(imdbConfig).forEach(key => {
        if ($(`${imdbConfig[key]}`)[0]) {
          imdbLink = $(imdbConfig[key]).attr('href');
          throw new Error('end loop');
        }
      });
    } catch (error) {
      if (error.message !== 'end loop') {
        console.log(error);
      }
    }
  } else {
    imdbLink = $(imdbConfig).attr('href');
  }
  console.log(imdbLink);
  return /tt\d+/.exec(imdbLink)?.[0] ?? '';
};
const getDoubanId = async (imdbId) => {
  try {
    const url = DOUBAN_SEARCH_API.replace('{query}', imdbId);
    const res = await fetch(url, {
      responseType: 'json',
    });
    if (res && res.length > 0 && res[0].id) {
      const { id, title, episode } = res[0];
      return {
        id,
        season: episode,
        title,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
const getDoubanIdByIMDB = async (imdbId) => {
  try {
    const url = DOUBAN_SUGGEST_API.replace('{query}', imdbId);
    const options = {
      cookie: '',
      anonymous: false,
      responseType: undefined,
    };
    const data = await fetch(url, options);
    const doc = new DOMParser().parseFromString(data, 'text/html');
    const linkDom = doc.querySelector('.result-list .result h3 a');
    if (!linkDom) {
      throw new Error('豆瓣ID获取失败');
    } else {
      const { href, textContent } = linkDom;
      const season = textContent?.match(/第(.+?)季/)?.[1] ?? '';
      const doubanId = decodeURIComponent(href).match(/subject\/(\d+)/)?.[1] ?? '';
      return ({
        id: doubanId,
        season,
        title: textContent || '',
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
// const getTvSeasonData = (data) => {
//   const torrentTitle = getTorrentTitle();
//   return new Promise((resolve, reject) => {
//     const { season = '', title } = data;
//     if (season) {
//       const seasonNumber = torrentTitle.match(/S(?!eason)\s*?0?(\d+)\.?(EP?\d+)?/i)?.[1] ?? 1;
//       if (parseInt(seasonNumber) === 1) {
//         resolve(data);
//       } else {
//         const query = title.replace(/第.+?季/, `第${seasonNumber}季`);
//         getDoubanId(query).then(data => {
//           resolve(data);
//         });
//       }
//     }
//   });
// };
// 豆瓣 v2 API 统一用 POST 携带 apikey
const fetchDoubanApi = (path) => {
  return fetch(`${DOUBAN_API_URL}${path}`, {
    data: encodeURI('apikey=0ab215a8b1977939201640fa14c66bab'),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};
// 海报换成大图
const getLargePoster = (url = '') => {
  return url.replace(/s(_ratio_poster|pic)/g, 'l$1').replace(/img\d/, 'img9');
};
// 未开分的条目返回 0 或 0.0，置空避免显示 0 分
const formatAverage = (average) => {
  return parseFloat(average) ? average : '';
};
const numberToChinese = (num) => {
  const digits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const value = parseInt(num, 10);
  if (!value || value < 1) {
    return '';
  }
  // 百位以上的集数（如 101）没有对应汉字读法，直接用数字
  if (value >= 100) {
    return String(value);
  }
  if (value < 10) {
    return digits[value];
  }
  if (value === 10) {
    return '十';
  }
  if (value < 20) {
    return `十${digits[value - 10]}`;
  }
  const tens = digits[Math.floor(value / 10)];
  const ones = value % 10 ? digits[value % 10] : '';
  return `${tens}十${ones}`;
};
const matchSeasonSubject = (subjects, chineseTitle, seasonNumber, strict = true) => {
  const cnSeason = numberToChinese(seasonNumber);
  const seasonMarkers = [
    `第${seasonNumber}季`,
    cnSeason ? `第${cnSeason}季` : '',
    `season ${seasonNumber}`,
  ].filter(Boolean);
  const nameHit = (subject) => {
    const title = subject.title || '';
    const originalTitle = subject.original_title || '';
    return title.includes(chineseTitle) || originalTitle.includes(chineseTitle);
  };
  const seasonHit = (subject) => {
    const title = (subject.title || '').toLowerCase();
    return seasonMarkers.some(marker => title.includes(marker.toLowerCase()));
  };
  const bothMatched = subjects.find(subject => nameHit(subject) && seasonHit(subject));
  if (bothMatched || strict) {
    return bothMatched;
  }
  return subjects.find(subject => nameHit(subject));
};
const getTvSeasonData = async (data) => {
  const torrentTitle = getTorrentTitle();
  const { episodes = '', chineseTitle } = data;
  if (episodes) {
    const seasonNumber = torrentTitle.match(/S(?!eason)\s*?0?(\d+)\.?(EP?\d+)?/i)?.[1] ?? 1;
    if (parseInt(seasonNumber) === 1) {
      return data;
    } else {
      const query = `${chineseTitle} 第${seasonNumber}季`;
      let subjects = [];
      try {
        const searchData = await fetchDoubanApi(`/search?q=${query}`);
        if (searchData.count > 0) {
          subjects = searchData.subjects;
        }
      } catch (error) {
        console.log(error);
      }
      let subject = matchSeasonSubject(subjects, chineseTitle, seasonNumber);
      if (!subject) {
        try {
          const suggestData = await fetch(`${DOUBAN_SUGGEST_API_URL}?q=${encodeURIComponent(query)}`, {
            responseType: 'json',
          });
          if (Array.isArray(suggestData) && suggestData.length > 0) {
            subject = matchSeasonSubject(suggestData, chineseTitle, seasonNumber);
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (!subject) {
        subject = matchSeasonSubject(subjects, chineseTitle, seasonNumber, false);
      }
      if (subject) {
        return { id: subject.id };
      }
      if (subjects.length > 0) {
        return { id: subjects[0].id };
      }
    }
  }
};
const getDoubanInfo = async (doubanId, imdbId) => {
  try {
    const url = DOUBAN_SUBJECT_URL.replace('{doubanId}', doubanId);
    const data = await fetch(url, {
      responseType: 'text',
    });
    if (data) {
      const doubanInfo = await formatDoubanInfo(data);
      const savedIds = GM_getValue('ids_v2') || {};
      savedIds[imdbId] = {
        doubanId,
        updateTime: Date.now(),
        ...doubanInfo,
      };
      GM_setValue('ids_v2', savedIds);
      return doubanInfo;
    } else {
      console.log('豆瓣数据获取失败');
    }
  } catch (error) {
    console.log(error);
  }
};
// 从条目接口取中文名，去掉季数后缀（如「瑞克和莫蒂 第一季」），
// getTvSeasonData 会在中文名后拼接季数搜索其他季
const getSubjectTitle = async (doubanId) => {
  try {
    const { title = '' } = await fetchDoubanApi(`/subject/${doubanId}`);
    return isChinese(title) ? title.replace(/\s*第.+?季$/, '') : '';
  } catch (error) {
    console.log(error);
    return '';
  }
};
const getDoubanInfoByIMDB = async (imdbId) => {
  try {
    const doubanData = await fetchDoubanApi(`/imdb/${imdbId}`);
    const { title = '', attrs = {}, image = '', summary = '', rating = {}, alt_title: altTitle, mobile_link: mobileLink } = doubanData;
    if (!mobileLink) {
      throw new Error('豆瓣API未返回条目');
    }
    const subjectLink = mobileLink.replace('m.douban.com/movie', 'movie.douban.com').replace(/\/$/, '');
    const doubanId = subjectLink.match(/subject\/(\d+)/)?.[1] ?? '';
    let chineseTitle = title;
    if (!isChinese(title) && !title.match(/^\d+$/)) {
      // 部分条目（如 Rick and Morty）alt_title 为空，再从条目接口取中文名
      chineseTitle = altTitle
        ? altTitle.split('/')[0].trim()
        : await getSubjectTitle(doubanId) || title;
    }
    const doubanInfo = {
      director: attrs.director?.join(' / '),
      runtime: attrs.movie_duration?.join(' / '),
      language: attrs.language?.join(' / '),
      genre: attrs.movie_type?.join(' / ') ?? '',
      aka: altTitle || '',
      region: attrs.country?.join(' / '),
      link: subjectLink,
      poster: getLargePoster(image),
      summary,
      chineseTitle,
      votes: rating.numRaters ?? 0,
      average: formatAverage(rating.average),
      id: doubanId,
      episodes: attrs.episodes?.join(' / ') ?? '',
    };
    // no need to save series info
    if (!attrs.episodes) {
      const savedIds = GM_getValue('ids_v2') || {};
      savedIds[imdbId] = {
        doubanId,
        updateTime: Date.now(),
        ...doubanInfo,
      };
      GM_setValue('ids_v2', savedIds);
    }
    return doubanInfo;
  } catch (error) {
    console.log(error);
  }
};
// 按豆瓣 ID 通过 API 获取详情，用于剧集的其他季（没有对应的 IMDB 条目）。
// 该接口不返回语言和片长，只有 PTP、ANT 用到这两项，它们只有电影不会走到这里
const getDoubanInfoBySubject = async (doubanId) => {
  try {
    const doubanData = await fetchDoubanApi(`/subject/${doubanId}`);
    if (!doubanData?.id) {
      throw new Error('豆瓣API未返回条目');
    }
    const {
      title = '', aka = [], images = {}, summary = '', rating = {}, ratings_count: votes,
      genres = [], countries = [], directors = [],
    } = doubanData;
    return {
      director: directors.map(item => item.name).join(' / '),
      runtime: '',
      language: '',
      genre: genres.join(' / '),
      aka: aka.join(' / '),
      region: countries.join(' / '),
      link: `https://movie.douban.com/subject/${doubanData.id}`,
      poster: getLargePoster(images.large),
      summary,
      chineseTitle: title,
      votes: votes ?? 0,
      average: formatAverage(rating.average),
      id: doubanData.id,
    };
  } catch (error) {
    console.log(error);
  }
};
// 豆瓣API未命中时的备用方案：先通过豆瓣搜索拿到ID，再解析条目页面获取详情
const getDoubanInfoFallback = async (imdbId) => {
  let subject = await getDoubanId(imdbId);
  if (!subject?.id) {
    subject = await getDoubanIdByIMDB(imdbId).catch(error => console.log(error));
  }
  if (!subject?.id) {
    return;
  }
  const doubanInfo = await getDoubanInfo(subject.id, imdbId);
  return doubanInfo && { ...doubanInfo, id: subject.id };
};
/* const getAwardInfo = async (doubanLink) => {
  const awardsPage = await fetch(`${doubanLink}/awards/`, {
    responseType: 'text',
  });
  const awardsDoc = new DOMParser().parseFromString(awardsPage, 'text/html');
  const awards = $('#content > div > div.article', awardsDoc).html()
    ?.replace(/[ \n]/g, '')
    ?.replace(/<\/li><li>/g, '</li> <li>')
    ?.replace(/<\/a><span/g, '</a> <span')
    ?.replace(/<(div|ul)[^>]*>/g, '\n')
    ?.replace(/<[^>]+>/g, '')
    ?.replace(/&nbsp;/g, ' ')
    ?.replace(/ +\n/g, '\n')
    ?.trim();
  return awards?.replace(/\n/g, '<br>') ?? '';
}; */
const formatDoubanInfo = async (domString) => {
  const dom = new DOMParser().parseFromString(domString, 'text/html');
  const chineseTitle = $('title', dom).text().replace('(豆瓣)', '').trim();
  const ldJson = $('head > script[type="application/ld+json"]', dom).html();
  // 豆瓣风控时会跳到 sec.douban.com 的「载入中」验证页，页面里没有条目数据
  if (!ldJson) {
    throw new Error('豆瓣条目页面解析失败，可能触发了豆瓣安全验证');
  }
  const jsonData = JSON.parse(ldJson.replace(/(\r\n|\n|\r|\t)/gm, ''));
  const fetchAnchor = function (anchor) {
    return anchor?.[0]?.nextSibling?.nodeValue?.trim() ?? '';
  };
  const rating = jsonData.aggregateRating ? jsonData.aggregateRating.ratingValue : 0;
  const votes = jsonData.aggregateRating ? jsonData.aggregateRating.ratingCount : 0;
  const director = jsonData.director ? jsonData.director : [];
  const poster = getLargePoster(jsonData.image);
  const link = `https://movie.douban.com${jsonData.url}`;
  const introductionDom = $('#link-report > span.all.hidden,#link-report-intra > [property="v:summary"], #link-report > [property="v:summary"]', dom);
  const summary = (
    introductionDom.length > 0 ? introductionDom.text() : '暂无相关剧情介绍'
  ).split('\n').map(a => a.trim()).filter(a => a.length > 0).join('\n'); // 处理简介缩进
  const genre = $('#info span[property="v:genre"]', dom).map(function () { // 类别
    return $(this).text().trim();
  }).toArray(); // 类别
  const language = fetchAnchor($('#info span.pl:contains("语言")', dom));
  const region = fetchAnchor($('#info span.pl:contains("制片国家/地区")', dom)); // 产地
  const runtimeAnchor = $('#info span.pl:contains("单集片长")', dom);
  const runtime = runtimeAnchor[0] ? fetchAnchor(runtimeAnchor) : $('#info span[property="v:runtime"]', dom).text().trim();
  const akaAnchor = $('#info span.pl:contains("又名")', dom);
  let aka = [];
  if (akaAnchor.length > 0) {
    aka = fetchAnchor(akaAnchor).split(' / ').sort(function (a, b) { // 首字(母)排序
      return a.localeCompare(b);
    }).join('/');
    aka = aka.split('/');
  }
  return {
    director: director.map(item => item.name),
    runtime,
    language,
    genre: genre?.join(' / ') ?? '',
    aka: aka?.join(' / ') ?? '',
    region,
    link,
    poster,
    summary,
    chineseTitle,
    votes,
    average: rating,
  };
};
const getTorrentTitle = () => {
  let { titleDom } = CURRENT_SITE_INFO;
  if (!titleDom) {
    if (CURRENT_SITE_NAME === 'BHD') {
      titleDom = $('.dotborder').find('td:contains(Name)').next('td');
    } else if (CURRENT_SITE_NAME.match(/ACM|BLU/)) {
      const keyMap = {
        Name: 'Name',
        名称: 'Name',
        名稱: 'Name',
      };
      $('#vue+.panel table tr').each((index, element) => {
        const key = $(element).find('td:first').text().replace(/\s|\n/g, '');
        if (keyMap[key]) {
          titleDom = $(element).find('td:last');
        }
      });
    } else if (CURRENT_SITE_NAME === 'HDT') {
      return document.title.replace(/HD-Torrents.org\s*-/ig, '').trim();
    }
  }
  return $(titleDom).text();
};
const createDoubanDom = async (doubanId, imdbId, doubanInfo, link) => {
  const div = document.createElement('div');
  let { doubanContainerDom, insertDomSelector, siteName, poster } = CURRENT_SITE_INFO;
  if (siteName.match(/(HDT)$/)) {
    insertDomSelector = $(insertDomSelector).parent();
  }
  $(insertDomSelector).before(doubanContainerDom);
  const doubanLink = link || `https://movie.douban.com/subject/${doubanId}`;

  let htmlData = await fetch(`${doubanLink}/output_card`, {
    responseType: 'text',
  });
  htmlData = htmlData.replace(/wrapper/g, 'douban-wrapper').replace(/<script.+?script>/g, '');
  htmlData = htmlData.replace(/(html,)body,/, '$1');// HDB body样式覆盖
  let headDom = htmlData.match(/<head>((.|\n)+)<\/head>/)[1];
  headDom = headDom.replace(/<link.+?>/g, '');
  const bodyDom = htmlData.match(/<body>((.|\n)+)<\/body>/)[1];
  div.insertAdjacentHTML('beforeend', headDom);
  div.insertAdjacentHTML('beforeend', bodyDom);
  $('.douban-dom').append(div).attr('douban-link', doubanLink);
  $('.douban-dom .grid-col4').after(`
  <div class="fix-col grid-col3">
  <div class="line-wrap">
  </div>
  </div>
  <div class="fix-col grid-col5"></div>`);
  const doubanData = doubanInfo || await getDoubanInfo(doubanId, imdbId);
  $('.douban-dom .grid-col5').html(`<div class="summary">${doubanData?.summary || '暂无简介'}</div>`);
  let posterStyle = $('.picture-douban-wrapper').attr('style');
  // 海报按 豆瓣 → TMDB → 站点原始 取：doubanData.poster 在调用方已经做过字段合并，
  // 豆瓣没有时这里装的是 TMDB 海报，两个都没有才退回站点自己的图
  const posterImg = doubanData?.poster || $(poster).attr('src') || '';
  posterStyle = posterStyle?.replace(/\(.+\)/, `(${posterImg})`);
  $('.picture-douban-wrapper').attr('style', posterStyle);
  $('.douban-dom').click(() => {
    GM_openInTab(doubanLink);
  });
};
// BTN 横幅下方新增中文片名行：中文片名点击跳转豆瓣，其后保留站点原英文片名与年份，
// 如「翠鸟谋杀案 Marble Hall Murders (2026)」，横幅本身保持站点原样
const addTitleLine = (doubanData, doubanLink) => {
  const { addTitleLineAfter, addTitleLineHtml } = CURRENT_SITE_INFO;
  const chineseTitle = doubanData.chineseTitle;
  if (!addTitleLineAfter || !addTitleLineHtml || !chineseTitle) {
    return false;
  }
  const anchor = document.querySelector(addTitleLineAfter);
  if (!anchor) {
    return false;
  }
  // 插入点取横幅所在 h2 的父容器之后（横幅与播放按钮之间），无 h2 时退化到横幅的父节点
  const host = (anchor.closest('h2') || anchor).parentNode;
  if (!host || !host.parentNode || document.querySelector('.douban-title-line')) {
    return true;
  }
  // 英文片名取自 document.title（如 Ghost Adventures :: BroadcasTheNet），年份取自 First Aired
  const rawTitle = (document.title.split(' :: ')[0] || '').trim();
  // document.title 有时自带年份（如 Monster (2022) :: BroadcasTheNet），先取下避免拼出两个年份
  const titleYear = rawTitle.match(/\((\d{4})\)\s*$/);
  const nativeTitle = rawTitle.replace(/\s*\(\d{4}\)\s*$/, '');
  const airedRow = Array.prototype.find.call(
    document.querySelectorAll('tr'),
    (row) => /First Aired/i.test(row.textContent),
  );
  const airedYear = airedRow && airedRow.textContent.match(/\b(?:19|20)\d{2}\b/);
  // 年份优先用 First Aired，没有该行时回退用片名自带的年份
  const year = (airedYear && airedYear[0]) || (titleYear && titleYear[1]) || '';
  // 豆瓣片名与站点原英文片名相同时（条目没有中文片名时豆瓣会返回英文原名），
  // 只保留豆瓣片名，不再重复拼一遍原英文片名
  const titleDuplicated = isSameTitle(chineseTitle, nativeTitle);
  const titleText = titleDuplicated && year && !matchTrailingYear(chineseTitle)
    ? `${chineseTitle} (${year})`
    : chineseTitle;
  const titleHtml = addTitleLineHtml
    .replace(/\{link\}/g, doubanLink)
    .replace(/\{title\}/g, titleText)
    .replace(/\{nativeTitle\}/g, titleDuplicated ? '' : (year ? `${nativeTitle} (${year})` : nativeTitle))
    // 没有原英文片名时去掉模板里多余的空格
    .replace(/\s+<\/a>/, '</a>');
  const wrapper = document.createElement('div');
  wrapper.innerHTML = titleHtml;
  host.parentNode.insertBefore(wrapper.firstChild, host.nextSibling);
  return true;
};
// BTN Series Summary：以原生 tab 形式融入豆瓣简介（左侧豆图标 + 右侧中文简介），
// 点击互斥状态手动管理，风格完全复用站点 jQuery UI tabs 的类名
const addDoubanSummaryTab = (doubanData) => {
  const { addSummaryTab, addSummaryTabIcon } = CURRENT_SITE_INFO;
  // 豆瓣没有中文简介时不增加 tab
  const summary = doubanData.summary && doubanData.summary !== '暂无相关剧情介绍' && isChinese(doubanData.summary)
    ? doubanData.summary
    : '';
  if (!addSummaryTab || !summary) {
    return false;
  }
  const tabs = document.querySelector(addSummaryTab);
  if (!tabs) {
    return false;
  }
  const panelId = 'douban-summary-panel';
  if (document.getElementById(panelId)) {
    return true;
  }
  const nav = tabs.querySelector('ul.ui-tabs-nav');
  if (!nav) {
    return false;
  }
  const li = document.createElement('li');
  li.className = 'ui-state-default ui-corner-left';
  li.innerHTML = `<a href="#${panelId}" target="_self" title="豆瓣简介"><img src="${addSummaryTabIcon}" width="17" height="17" alt="Douban"></a>`;
  nav.insertBefore(li, nav.firstChild);
  const panel = document.createElement('div');
  panel.id = panelId;
  panel.className = 'ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide';
  const text = document.createElement('div');
  text.className = 'douban-summary-tab-text';
  text.textContent = summary;
  panel.appendChild(text);
  tabs.appendChild(panel);
  const nativeLis = Array.prototype.filter.call(nav.children, (item) => item !== li);
  const nativePanels = Array.prototype.filter.call(tabs.querySelectorAll('.ui-tabs-panel'), (item) => item !== panel);
  // 默认选中豆瓣 tab：进页面即显示中文简介，原生日志 tab 的选中态一并取消
  nativeLis.forEach((item) => item.classList.remove('ui-tabs-selected', 'ui-state-active'));
  nativePanels.forEach((item) => item.classList.add('ui-tabs-hide'));
  li.classList.add('ui-tabs-selected', 'ui-state-active');
  panel.classList.remove('ui-tabs-hide');
  const anchor = li.querySelector('a');
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    nativeLis.forEach((item) => item.classList.remove('ui-tabs-selected', 'ui-state-active'));
    nativePanels.forEach((item) => item.classList.add('ui-tabs-hide'));
    li.classList.add('ui-tabs-selected', 'ui-state-active');
    panel.classList.remove('ui-tabs-hide');
  });
  // 原生 tab 的切换由站点 widget 完成，其后隐藏豆瓣面板并取消选中态
  nativeLis.forEach((item) => {
    const nativeAnchor = item.querySelector('a');
    if (nativeAnchor) {
      nativeAnchor.addEventListener('click', () => {
        setTimeout(() => {
          li.classList.remove('ui-tabs-selected', 'ui-state-active');
          panel.classList.add('ui-tabs-hide');
        }, 0);
      });
    }
  });
  return true;
};
// 就地替换：保留站点原片名/原简介，把豆瓣中文片名挂到原片名右侧，中文简介替换原简介，
// 并在站点评分和外链按钮处加入豆瓣入口。返回是否命中，未命中时由调用方回退到豆瓣卡片
// 片名末尾的年份，如 「Titanic (1997)」→ 1997
const matchTrailingYear = (text = '') => String(text).match(/\(\s*((?:19|20)\d{2})\s*\)\s*$/);
// 片名拆成「比较键 + 末尾年份」：比较键忽略大小写、标点与空格。
// 条目没有中文片名时豆瓣会返回英文原名，与站点原片名一模一样，靠它判断是不是同一个
const parseTitleForCompare = (text = '') => {
  const raw = String(text).trim();
  const year = matchTrailingYear(raw);
  // 年份从比较键里去掉，只单独比年份，站点带年份、豆瓣不带时才算同一个片名
  const withoutYear = year ? raw.slice(0, raw.length - year[0].length) : raw;
  return {
    key: withoutYear.toLowerCase().replace(/[^0-9a-z\u4e00-\u9fa5]+/g, ''),
    year: year ? year[1] : '',
  };
};
// 同一个片名：比较键相同，且两边的年份不冲突。
// 站点写成「Titanic (1997)」、豆瓣写成「Titanic」时算同一个；
// 两边都带年份但年份不同时（同名不同年）不算同一个
const isSameTitle = (left, right) => {
  const a = parseTitleForCompare(left);
  const b = parseTitleForCompare(right);
  if (!a.key || !b.key || a.key !== b.key) {
    return false;
  }
  return !a.year || !b.year || a.year === b.year;
};
// 站点原片名带了年份而豆瓣片名没有时，把年份补到保留的豆瓣片名链接后面
const appendYearToTitleLink = (link, year) => {
  if (!link || !year || matchTrailingYear(link.textContent)) {
    return;
  }
  link.appendChild(document.createTextNode(` (${year[1]})`));
};
// 豆瓣/TMDB 片名与站点原片名相同时只保留一个：站点原片名删掉，保留豆瓣/TMDB 那个。
// 返回处理后的片名 HTML 与是否判定为重复，未命中时原样返回，不影响正常站点
const dedupeTitleHtml = (titleHtml, siteTitleText) => {
  const holder = document.createElement('div');
  holder.innerHTML = titleHtml;
  const kept = holder.querySelector('.douban-title-link');
  const keptText = (kept?.textContent || '').trim();
  const siteText = (siteTitleText || '').trim();
  if (!kept || !keptText || !siteText || !isSameTitle(keptText, siteText)) {
    return { html: titleHtml, duplicated: false };
  }
  appendYearToTitleLink(kept, matchTrailingYear(siteText));
  return { html: holder.innerHTML, duplicated: true };
};
// PTP、ANT 把豆瓣片名以 [片名] 前缀加在站点原片名前面，重复时同样只保留豆瓣片名
const dedupePrependedTitle = (hostSelector, chineseTitle) => {
  const host = $(hostSelector).first()[0];
  if (!host || !chineseTitle) {
    return;
  }
  const textNode = Array.prototype.find.call(
    host.childNodes,
    (node) => node.nodeType === 3 && node.textContent.trim(),
  );
  const siteText = (textNode?.textContent || '').trim();
  if (!siteText || !isSameTitle(siteText, chineseTitle)) {
    return;
  }
  appendYearToTitleLink(host.querySelector('a[target="_blank"]'), matchTrailingYear(siteText));
  textNode.remove();
};
const replaceNativeInfo = (doubanData, doubanLink, titleLink = doubanLink) => {
  const {
    addTitleAfter, addTitleBefore, addTitleInside, addTitleHtml, addTitleYearFrom,
    replaceOverview, replaceOverviewLabel,
    replaceRating, replaceRatingHtml, replaceRatingPosition, renameRatingLabel,
    starFullHtml, starEmptyHtml, ratingSourceLabel,
    ratingRewriteHtml, removeRatingVotes, groupRating,
    addLinkButtonAfter, addLinkButtonHtml,
    addTitleLineAfter,
    addSummaryTab,
  } = CURRENT_SITE_INFO;
  if (!doubanData || !(addTitleAfter || addTitleBefore || addTitleInside || addTitleLineAfter || addSummaryTab || replaceOverview || replaceOverviewLabel)) {
    return false;
  }
  if (document.documentElement.dataset.doubanInserted) {
    return true;
  }
  const score = doubanData.average;
  const votes = doubanData.votes ?? 0;
  const votesComma = String(votes).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const chineseTitle = doubanData.chineseTitle;
  // 豆瓣没有中文简介时保留站点原简介
  const summary = doubanData.summary && doubanData.summary !== '暂无相关剧情介绍' && isChinese(doubanData.summary)
    ? doubanData.summary
    : '';
  let replaced = false;

  // 横幅下方新增中文片名行，横幅保持站点原样（如 BTN 顶部 TVDB 横幅）
  if (addTitleLine(doubanData, doubanLink)) {
    replaced = true;
  }

  // 中文片名：挂在站内原片名旁边，点击跳转数据来源站的条目页
  if (addTitleHtml && chineseTitle) {
    // 年份从配置的元素里提取（如站点信息表的 Released 行），取不到时 {year} 替换为空，
    // 便于拼出「追风筝的人 (2007)」这类片名
    const yearSource = addTitleYearFrom ? $(addTitleYearFrom).first().text() : '';
    const yearMatched = yearSource.match(/\b(?:19|20)\d{2}\b/);
    const titleHtml = addTitleHtml
      .replace(/\{link\}/g, titleLink)
      .replace(/\{title\}/g, chineseTitle)
      .replace(/\{year\}/g, yearMatched ? ` (${yearMatched[0]})` : '');
    // 站点原片名与豆瓣/TMDB 片名相同时（条目没有中文片名时豆瓣会返回英文原名），
    // 删掉站点原片名只保留豆瓣片名，避免同一个片名并排出现两遍
    const siteTitleText = $(addTitleInside || addTitleAfter || addTitleBefore).first().text();
    const { html: mergedTitleHtml, duplicated } = dedupeTitleHtml(titleHtml, siteTitleText);
    if (addTitleInside) {
      const host = $(addTitleInside).first()[0];
      if (host) {
        const link = $(mergedTitleHtml)[0];
        // 片名文本通常是容器最后一个子节点；容器末尾是其他元素时（如 IPT 片名区末尾
        // 跟着评分框），回退取第一个文本子节点
        const lastText = host.lastChild && host.lastChild.nodeType === 3
          ? host.lastChild
          : Array.prototype.find.call(
            host.childNodes,
            (node) => node.nodeType === 3 && node.textContent.trim(),
          );
        // 行尾的 (年份) 挪到中文片名之后，如 Wings of Dread (2026) → Wings of Dread 追风筝的人 (2026)
        const yearMatched = lastText && lastText.nodeType === 3 &&
          lastText.textContent.match(/^([\s\S]*?)(\s*\(\d{4}\)\s*)$/);
        // 片名文本后紧邻插入，避免容器末尾是其他元素时（如 IPT 的片名区末尾跟着
        // 评分框）把中文片名追加到容器尾部
        const titleParent = lastText && lastText.nodeType === 3 ? lastText.parentNode : null;
        if (duplicated) {
          // 站点原片名与豆瓣片名是同一个：删掉站点原片名，只保留豆瓣片名
          // （年份已由 dedupeTitleHtml 补到豆瓣片名上）。站点片名本身是链接时
          // （如 HDS 的 #imdb td.header b a）把豆瓣片名放到它后面，避免链接套链接
          if (host.tagName === 'A') {
            host.parentNode.insertBefore(link, host.nextSibling);
            host.remove();
          } else if (titleParent) {
            titleParent.insertBefore(link, lastText.nextSibling);
            lastText.remove();
          } else {
            host.appendChild(link);
          }
        } else if (titleParent) {
          if (yearMatched) {
            lastText.textContent = `${yearMatched[1].replace(/\s+$/, '')} `;
            titleParent.insertBefore(link, lastText.nextSibling);
            titleParent.insertBefore(document.createTextNode(` ${yearMatched[2].trim()}`), link.nextSibling);
          } else {
            let after = lastText;
            if (!/\s$/.test(lastText.textContent)) {
              const space = document.createTextNode(' ');
              titleParent.insertBefore(space, lastText.nextSibling);
              after = space;
            }
            titleParent.insertBefore(link, after.nextSibling);
          }
        } else {
          host.appendChild(link);
        }
        replaced = true;
      }
    } else {
      const $titleAnchor = $(addTitleAfter || addTitleBefore).first();
      if ($titleAnchor.length) {
        if (addTitleAfter) {
          $titleAnchor.after(mergedTitleHtml);
        } else {
          $titleAnchor.before(mergedTitleHtml);
        }
        // 站点原片名与豆瓣片名相同时删掉站点原片名，只保留豆瓣片名
        if (duplicated) {
          $titleAnchor.remove();
        }
        replaced = true;
      }
    }
  }

  // 剧情：整个元素文本替换，原内容留作 tooltip
  if (replaceOverview && summary) {
    const $overview = $(replaceOverview).first();
    if ($overview.length) {
      const original = $overview.text().trim();
      $overview.text(summary).attr('title', original);
      replaced = true;
    }
  }

  // 剧情：站点剧情是「Plot:」标签后的裸文本节点时，替换该文本节点
  if (replaceOverviewLabel && summary) {
    const label = Array.prototype.find.call(
      document.querySelectorAll('font,strong,b,span,td'),
      (element) => element.children.length === 0 && element.textContent.trim() === replaceOverviewLabel,
    );
    if (label) {
      let node = label.nextSibling;
      while (node && !(node.nodeType === 3 && node.textContent.trim())) {
        node = node.nextSibling;
      }
      // 标签可能是父容器的最后一个子节点（如 AR 的 <span><span class="size4">PLOT</span></span>），
      // 剧情文本跟在父容器之后，此时从父容器继续向后查找文本节点
      if (!node && label.parentNode && label.parentNode !== document.body) {
        node = label.parentNode.nextSibling;
        while (node && !(node.nodeType === 3 && node.textContent.trim())) {
          node = node.nextSibling;
        }
      }
      if (node) {
        node.textContent = ` ${summary} `;
        replaced = true;
      }
    }
  }

  // 评分：在站点评分元素旁插入豆瓣评分，沿用站点自身样式类
  if (replaceRating && score && replaceRatingHtml) {
    let $rating = $(replaceRating).first();
    if ($rating.length) {
      // 站点评分重写：把站点自身的星级图评分改成文字标签，并把另行展示的票数
      // 并进同一行，如 HDT 的「⭐ 6.5/10 + Votes: 38716」→「IMDB：6.5/10（Votes: 38716）」
      if (ratingRewriteHtml) {
        const ratingNode = $rating[0];
        // 评分值：取评分元素自身的 alt，取不到再取紧随其后的评分文本
        let siteScore = ratingNode.getAttribute('alt') || '';
        const ratingTrailing = ratingNode.nextSibling;
        if (!siteScore && ratingTrailing && ratingTrailing.nodeType === 3) {
          siteScore = ratingTrailing.textContent.trim();
        }
        siteScore = siteScore.replace(/\/\s*10\s*$/, '').trim();
        // 票数值：票数标签后紧跟的文本，取到后把整行票数清掉避免留下空行。
        // 票数必须紧跟标签之后，取不到就原样保留该行，避免误删站内其他内容
        let siteVotes = '';
        if (removeRatingVotes) {
          const $votesLabel = $(removeRatingVotes).first();
          const votesLabel = $votesLabel[0];
          const votesText = votesLabel && votesLabel.nextSibling;
          if (votesText && votesText.nodeType === 3 && /\d/.test(votesText.textContent)) {
            const votesParent = votesLabel.parentNode;
            const afterLabel = votesText.nextSibling;
            siteVotes = votesText.textContent.trim().replace(/,/g, '');
            votesParent.removeChild(votesText);
            votesParent.removeChild(votesLabel);
            if (afterLabel && afterLabel.nodeType === 1 && afterLabel.nodeName === 'BR') {
              votesParent.removeChild(afterLabel);
            }
          }
        }
        const siteVotesComma = siteVotes ? Number(siteVotes).toLocaleString('en-US') : '';
        const $rewritten = $(ratingRewriteHtml
          .replace(/\{siteScore\}/g, siteScore)
          .replace(/\{siteVotes\}/g, siteVotes)
          .replace(/\{siteVotesComma\}/g, siteVotesComma));
        $rewritten.insertBefore($rating);
        $rating.remove();
        // 原评分元素后面紧跟的评分文本（如「&nbsp;&nbsp;6.5/10」）一并移除
        if (ratingTrailing && ratingTrailing.nodeType === 3 && ratingTrailing.parentNode) {
          ratingTrailing.parentNode.removeChild(ratingTrailing);
        }
        $rating = $rewritten;
      }
      // 站点评分标签改名（如 HDB 的 Rating → IMDB Rating），豆瓣评分单独占一行
      if (renameRatingLabel) {
        const $label = $rating.find('th, td')
          .filter((index, element) => /^\s*Rating\b/i.test(element.textContent))
          .first();
        if ($label.length) {
          // 标签常包裹在 <b>Rating:</b> 这类加粗子元素里，改子元素文本以保留站点样式
          const $bold = $label.find('b, strong').first();
          if ($bold.length) {
            $bold.text(renameRatingLabel);
          } else {
            $label.text(renameRatingLabel);
          }
        }
      }
      // 站点评分未标注来源时（如 FL 的纯星图评分），在星星图标后补上来源名称
      if (ratingSourceLabel) {
        const $icon = $rating.find('img').first();
        if ($icon.length) {
          $icon.after(` ${ratingSourceLabel}`);
        }
      }
      // 星级条宽度：豆瓣分按 /10 换算成百分比，供站点自身的星级样式使用
      const scorePercent = /^\d+(?:\.\d+)?$/.test(String(score))
        ? `${Math.round(parseFloat(score) * 10)}%`
        : '0%';
      // 星级条宽度（像素）：按站点星级图总宽 200px / 10 分折算，
      // 供直接复用站点星级条元素的站点使用（如 IPT 的 .imdb-rating）
      const scoreWidth = /^\d+(?:\.\d+)?$/.test(String(score))
        ? `${Math.round(parseFloat(score) * 20)}px`
        : '0px';
      let ratingHtml = replaceRatingHtml
        .replace(/\{link\}/g, doubanLink)
        .replace(/\{score\}/g, score)
        .replace(/\{scorePercent\}/g, scorePercent)
        .replace(/\{scoreWidth\}/g, scoreWidth)
        .replace(/\{votesComma\}/g, votesComma);
      // 星星图标沿用站点自身的满星/空星片段（如 HDS 的盒式星级），按豆瓣分折算满星数
      if (starFullHtml && starEmptyHtml) {
        const fullStars = Math.max(0, Math.min(10, Math.round(parseFloat(score))));
        let stars = '';
        for (let star = 0; star < 10; star++) {
          stars += star < fullStars ? starFullHtml : starEmptyHtml;
        }
        ratingHtml = ratingHtml.replace(/\{stars\}/g, stars);
      }
      ratingHtml = ratingHtml.replace(/\{votes\}/g, votes);
      // 评分重写后原评分元素可能被换成多个节点，统一取首/末节点作为插入锚点，
      // 否则豆瓣评分会被重复插到每个节点后面
      const $ratingFirst = $rating.first();
      const $ratingLast = $rating.last();
      if (groupRating) {
        // 评分分组：站点评分框与豆瓣评分框放进同一个右对齐弹性容器，
        // 固定两行显示（站点评分与片名同行在上，豆瓣评分在下），两行左对齐
        const $group = $('<div class="douban-rating-group"></div>');
        $group.insertBefore($ratingFirst);
        $group.append($rating).append(ratingHtml);
      } else if (replaceRatingPosition === 'before') {
        $ratingFirst.before(ratingHtml);
      } else {
        $ratingLast.after(ratingHtml);
      }
      replaced = true;
    }
  }

  // Series Summary：以原生 tab 形式融入豆瓣简介（豆图标 + 中文简介）
  if (addDoubanSummaryTab(doubanData)) {
    replaced = true;
  }

  // 外链按钮：在站点自身的外部链接按钮旁加入豆瓣按钮
  if (addLinkButtonAfter && addLinkButtonHtml) {
    const $button = $(addLinkButtonAfter).first();
    if ($button.length) {
      $button.after(addLinkButtonHtml.replace(/\{link\}/g, doubanLink));
      replaced = true;
    }
  }

  if (replaced) {
    document.documentElement.dataset.doubanInserted = '1';
  }
  return replaced;
};
// 影片没有豆瓣条目时，在站点外链按钮处插入暗色占位按钮，
// 与站点自身的「无数据」按钮（暗色、不可点击）保持一致
const addDarkLinkButton = () => {
  const { addDarkLinkButtonAfter, addDarkLinkButtonHtml } = CURRENT_SITE_INFO;
  if (!addDarkLinkButtonAfter || !addDarkLinkButtonHtml) {
    return;
  }
  const $button = $(addDarkLinkButtonAfter).first();
  if ($button.length) {
    $button.after(addDarkLinkButtonHtml);
  }
};
// ---------- 列表页（如 BHD /torrents）：给每个种子标题下方补豆瓣中文片名 ----------
const LIST_SEARCH_CACHE_KEY = 'douban_list_v1';
const LIST_CACHE_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1000;
// 同时请求豆瓣的并发数，列表页几十行逐个串行等待太久
const LIST_SEARCH_CONCURRENCY = 5;
// 豆瓣接口有频控，一页几十行集中打出会被限流（报错或返回空结果）。
// 所有列表页请求排进同一个时间槽，相邻请求至少间隔这么久，
// 五个并发实际被削成串行，一页 70 多个请求约半分钟铺完
const LIST_REQUEST_INTERVAL = 400;
// 请求失败（网络波动或被频控）后，退避这么久再重试一次
const LIST_RETRY_DELAY = 1500;
// 简易频控闸门：多个并发调用按 interval 依次错开，不会同时打到豆瓣
const createRequestGate = (interval) => {
  let nextSlot = 0;
  return async () => {
    const now = Date.now();
    const slot = Math.max(now, nextSlot);
    nextSlot = slot + interval;
    if (slot > now) {
      await new Promise(resolve => setTimeout(resolve, slot - now));
    }
  };
};
const waitListRequestSlot = createRequestGate(LIST_REQUEST_INTERVAL);
// 悬浮面板的详情请求走单独一条闸门，不排在整页种子检索后面：一页几十行时
// 检索请求能占满半分钟，光标放上去要等它们逐个走完才出面板。
// 两条闸门各 400ms，最坏情况下每秒 5 个豆瓣请求，仍比豆瓣的限流宽裕
const LIST_DETAIL_INTERVAL = 400;
const waitListDetailSlot = createRequestGate(LIST_DETAIL_INTERVAL);
// 列表页的 TMDB 兜底能力：字段合并 + 单独取海报。common 与 tmdb 互相 import 会成环
// （tmdb 顶层的请求闸门要用 common 的 createRequestGate，模块求值时就取不到值），
// 所以由 index 在启动时注册进来；没注册时（如测试环境）行为与加 TMDB 前一致
let listTmdbMerge = null;
let listTmdbPoster = null;
let listTmdbSeasonCount = null;
const setListTmdb = (helper) => {
  listTmdbMerge = typeof helper?.merge === 'function' ? helper.merge : null;
  listTmdbPoster = typeof helper?.poster === 'function' ? helper.poster : null;
  listTmdbSeasonCount = typeof helper?.seasonCount === 'function' ? helper.seasonCount : null;
};
// 字段回退规则与详情页完全一致：片名、简介谁有中文就用谁的，
// 海报 豆瓣 → TMDB → 站点原始。拿不到 TMDB 数据时原样返回
// data 为空（豆瓣没有条目）时也要合并：整份数据都取自 TMDB，
// 由合并函数返回 null 表示两个数据源都没有这个条目
// imdbId 为空（如 BTN 的列表页不放外部编号）时带上发行名，
// 由 TMDB 按片名 + 年份检索，豆瓣没有条目也能兜底
const mergeListTmdb = async (data, imdbId, release = null) => {
  if (!listTmdbMerge || (!imdbId && !release?.queries?.length && !release?.name)) {
    return data;
  }
  try {
    return (await listTmdbMerge(data, imdbId, release)) || data;
  } catch (error) {
    console.log(error);
    return data;
  }
};
// 检索结果与条目详情的字段名略有差异，统一成详情的结构再合并，
// 悬浮面板因此能直接用合并结果（含 TMDB 兜底的那份）
const toListDetail = (subject) => ({
  title: subject.title || '',
  originalTitle: subject.originalTitle || '',
  year: subject.year || '',
  subtype: subject.subtype || '',
  poster: subject.poster || '',
  posterFallback: subject.posterFallback || subject.posterRaw || '',
  summary: subject.summary || '',
  genres: Array.isArray(subject.genres) ? subject.genres : [],
  countries: Array.isArray(subject.countries) ? subject.countries : [],
  rating: parseFloat(subject.rating) || 0,
  votes: parseInt(subject.votes, 10) || 0,
  ratingSource: subject.ratingSource || '',
  episodesCount: parseInt(subject.episodesCount, 10) || 0,
});
// 合并 TMDB 兜底数据。subject 为空表示豆瓣没有条目，此时整份数据都来自 TMDB；
// 两个数据源都没有这个条目时返回 null
const mergeListSubject = async (subject, imdbId, release = null) => {
  const base = subject
    ? {
        ...toListDetail(subject),
        // 检索结果带条目编号，详情接口返回的不带：编号只在有时才写上，
        // 塞空值会把调用方（如 getSubjectByImdb）手里的编号覆盖掉
        ...(subject.id ? { id: subject.id } : {}),
        chineseTitle: subject.title,
      }
    : null;
  const merged = (await mergeListTmdb(base, imdbId, release)) || base;
  if (!merged) {
    return null;
  }
  const title = merged.chineseTitle || subject?.title || '';
  // 统一整理成详情的结构：豆瓣没有条目时合并结果只有 TMDB 的字段，
  // 缺的字段补空，悬浮面板与跳转链接因此都能直接用
  return {
    ...toListDetail({ ...merged, title }),
    title,
    id: merged.id || '',
    chineseTitle: merged.chineseTitle || '',
    tmdbUrl: merged.tmdbUrl || '',
    titleSource: merged.titleSource || '',
    // 豆瓣没有条目时整份数据来自 TMDB，编号与媒体类型留着取该季总集数
    tmdbId: merged.tmdbId || '',
    mediaType: merged.mediaType || '',
  };
};
// 列表页统一走这个入口请求豆瓣，详情页的请求不受影响；
// 失败时退避重试一次，避免整行种子因为一次抖动拿不到中文片名。
// 悬浮面板的详情走 detailGate，排单独的闸门，不被整页检索堵住
const fetchDoubanListApi = async (path, allowRetry = true, detailGate = false) => {
  await (detailGate ? waitListDetailSlot() : waitListRequestSlot());
  try {
    return await fetchDoubanApi(path);
  } catch (error) {
    // 404 是豆瓣明确回答「没有这个条目」，重试一次还是一样的结果，白打一次接口
    if (!allowRetry || error?.status === 404) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, LIST_RETRY_DELAY));
    return fetchDoubanListApi(path, false, detailGate);
  }
};
// 发行名里的技术关键词，片名到它为止，如「Masters of the Universe 2026 BluRay 1080p」
const RELEASE_TECH_PATTERN = new RegExp(`\\b(?:${[
  'Blu-?Ray', 'BRRip', 'BDRip', 'DVDRip', 'DVD', 'HDTV', 'PDTV', 'WEB-?DL', 'WEB-?Rip',
  'REMUX', 'UHD', 'HDRip', 'HDRIp', 'PROPER', 'REPACK', 'COMPLETE',
  'AMZN', 'NF', 'HULU', 'DSNP', 'ATVP', 'HMAX', 'CRAV', 'PCOK', 'iTunes',
  'HEVC', 'AVC', 'x26[45]', 'H26[45]', 'VC-?1',
  'TrueHD', 'DTS(?:-HD)?(?: ?MA)?', 'DDP\\d?', 'DD\\+?', 'Atmos', 'FLAC', 'AAC', 'EAC3', 'LPCM', 'OPUS',
  'HDR\\d*\\+?', 'Do?Vi(?:sion)?\\d*', 'DV\\d*', 'SDR', '10bit', '8bit',
  // 分辨率只列真实出现过的档位（不按任意四位数匹配，避免吃掉片名里的 2049 这类数字），
  // 后缀 p/i 可选：HDS 写的是不带后缀的 2160
  '(?:480|576|720|1080|2160|4320)[pi]?', '\\d+x\\d+',
  // 混合版（HDT 的固定标签）；EXTENDED 这类版本词不列，片名本身可能带这些词
  'HYBRID', '[48]K',
  'S\\d{1,3}(?:E\\d{1,3})?(?:-E?\\d{1,3})?', 'E\\d{1,3}',
].join('|')})`, 'i');
// 季集标记：S02E04、S02-E04、S02 E04、S02E04E05、S01E1015、Season 2 Episode 4。
// 集数放宽到 4 位以兼容动画的绝对集数，附加集必须以 E 或连接号开头，避免吃掉集数本身
const RELEASE_SEASON_PATTERN = /S(\d{1,3})(?:[-\s]?E(\d{1,4})(?:[-\s]?E\d{1,3})*)?(?![a-z0-9])|Season\s+(\d{1,3})(?:\s+Episode\s+(\d{1,3}))?/i;
// 去掉豆瓣片名的季数后缀，如「中央情报局 第一季」→「中央情报局」；
// 番剧的季名常带副标题（如「银魂 第四季 烙阳决战篇」），从季数标记起整段去掉
const stripSeasonSuffix = (title) => (title || '').replace(/\s*第[一二三四五六七八九十百\d]+季.*$/, '').trim();
// 特典、OVA、饭制短片这类条目不是正片季，不参与剧集匹配
const isSpecialSubject = (item) => /特典|OVA|特別篇|特别篇|短片|饭制|花絮/.test(item.title || '');
let listSearchCache = null;
const getListSearchCache = () => {
  if (!listSearchCache) {
    listSearchCache = GM_getValue(LIST_SEARCH_CACHE_KEY) || {};
  }
  return listSearchCache;
};
// 解析发行名里的片名、年份、季集：
// 「Masters of the Universe 2026 BluRay 1080p ...」→ { name: 'Masters of the Universe', year: '2026' }
// 「CIA 2026 S02E04 Black Tie Optional 1080p ...」→ { name: 'CIA', year: '2026', season: 2, episode: 4 }
// 「Paranoia Agent S01 1080i BluRay ...」→ { name: 'Paranoia Agent', season: 1 }
const parseReleaseTitle = (rawTitle) => {
  // H.264、x.265 这类加点分隔的编码名先拼回整体，否则会被当成普通分隔符拆开
  const text = String(rawTitle || '')
    // LRM、RLM 与各种嵌入/隔断符不可见但占位，年份、片名匹配都会受影响，先剥掉
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/\b([hx])[._]?(26[45])\b/gi, '$1$2')
    .replace(/[._]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) {
    return null;
  }
  const tokens = text.split(' ');
  // 标记在句中的字符位置换算成词元下标，两个截止位置才能互相比较
  const toTokenIndex = (charIndex) => text.slice(0, charIndex).split(' ').length - 1;
  const seasonMatched = text.match(RELEASE_SEASON_PATTERN);
  const season = seasonMatched ? parseInt(seasonMatched[1] || seasonMatched[3], 10) : 0;
  const episode = seasonMatched ? parseInt(seasonMatched[2] || seasonMatched[4] || '0', 10) : 0;
  const seasonIndex = seasonMatched ? toTokenIndex(seasonMatched.index) : -1;
  const techMatched = text.match(RELEASE_TECH_PATTERN);
  const techIndex = techMatched ? toTokenIndex(techMatched.index) : tokens.length;
  // 剧集片名截止到季集标记，电影片名截止到第一个技术关键词
  let nameTokens = tokens.slice(0, seasonIndex >= 0 ? Math.min(seasonIndex, techIndex) : techIndex);
  // 年份取片名区段里最后一个四位数，且前面还有片名文字：从后往前找，
  // 兼容区段尾部带杂词的情况（如 ... 2026 H 264-NTb）；
  // 同时避免把片名里的数字（如 Blade Runner 2049）或纯数字片名（如 1923）当年份
  let year = '';
  for (let index = nameTokens.length - 1; index > 0; index--) {
    // 全局替换才会同时去掉两端的括号，如「(2021)」→「2021」
    const bareToken = nameTokens[index].replace(/^[[({<]+|[)\]}>:,;]+$/g, '');
    if (/^(?:19|20)\d{2}$/.test(bareToken)) {
      year = bareToken;
      // 片名到年份为止：后面的词元是技术参数或站点附加内容（如 HDF 组头里
      // 跟在年份后的类型标记、标签、投票数），截掉才是干净的可检索片名
      nameTokens = nameTokens.slice(0, index);
      break;
    }
  }
  const name = nameTokens.join(' ').replace(/[\s\-–—:;,]+$/, '').trim();
  if (!name) {
    return null;
  }
  // 片名里的 AKA 别名分段检索：「A Cat in the Brain AKA Un gatto nel cervello」→
  // 主片名与各别名都拿去搜豆瓣，整串直接搜经常一条都搜不到
  const akaParts = name.split(/\s+AKA\s+/i).map(part => part.trim()).filter(Boolean);
  // 「英文片名 / 中文片名」也拆开检索（ACM 的发行名惯例）：两段都是可检索的
  // 片名，整串带斜杠搜豆瓣一条都搜不到。只在有中文段时拆，避免误伤
  // 「Léon / The Professional」这类两边都能整串搜的写法
  const queries = akaParts.flatMap((part) => {
    const slashParts = part.split(/\s*\/\s*/).map(item => item.trim()).filter(Boolean);
    return slashParts.length > 1 && slashParts.some(item => /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(item))
      ? slashParts
      : [part];
  });
  return { name, queries, year, season, episode };
};
// 片名归一化：小写、去掉变音符号与非字母数字，用于中英文片名比对
const normalizeTitle = (title) => String(title || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '');
// 豆瓣 v2 检索接口按片名检索，一次返回中文片名、年份、原始片名和所有季的条目，
// 按查询词缓存，翻页和重复资源不再打接口
const searchDoubanSubjects = async (query) => {
  const cache = getListSearchCache();
  const cached = cache[query];
  if (cached && Date.now() - cached.updateTime < LIST_CACHE_EXPIRE_TIME) {
    return cached.subjects;
  }
  try {
    const data = await fetchDoubanListApi(`/search?q=${encodeURIComponent(query)}`);
    const subjects = (data?.subjects ?? []).map((item) => {
      // 检索结果里就带海报：条目接口对剧集不返回 images，悬浮面板的海报只能从这里拿
      const posterUrl = item.images?.large || item.images?.medium || item.images?.small || '';
      return {
        id: item.id,
        title: item.title || '',
        originalTitle: item.original_title || '',
        year: item.year || '',
        subtype: item.subtype || '',
        // 接口给的海报实际是小图，换成大图才清晰；原地址留作加载失败时的回退
        poster: getLargePoster(posterUrl),
        posterRaw: posterUrl,
      };
    }).filter(item => item.id);
    // 海报按条目编号缓存，详情接口没有 images 时（如剧集）用它兜底
    subjects.forEach((item) => {
      if (item.poster) {
        cache[`poster:${item.id}`] = { poster: item.poster, raw: item.posterRaw, updateTime: Date.now() };
      }
    });
    cache[query] = { subjects, updateTime: Date.now() };
    GM_setValue(LIST_SEARCH_CACHE_KEY, cache);
    return subjects;
  } catch (error) {
    console.log(error);
    return [];
  }
};
// 条目详情：海报、简介、类型、评分与该季总集数，悬浮简介弹窗用。
// 整季资源在列表渲染时本来就要拉一次条目接口，顺手全量缓存，悬浮时不必再请求
const getSubjectDetail = async (doubanId, imdbId = '', detailGate = false, release = null) => {
  if (!doubanId) {
    return null;
  }
  const cache = getListSearchCache();
  const cacheKey = `detail:${doubanId}`;
  const cached = cache[cacheKey];
  // 合并放在缓存读取之后：缓存里存的是豆瓣原始数据，TMDB 有自己的 30 天缓存，
  // 每次读都合一次也不会有额外请求，还能避免「没带 IMDb 编号时合过的结果被缓存」
  // release 一并带下去：没有 IMDb 编号时（torrents.php 有少量影片不放 IMDb 链接），
  // TMDB 合并要靠片名 + 年份检索，豆瓣没评分才补得到 TMDB 评分
  const applyTmdb = async (detail) => (detail ? mergeListSubject(detail, imdbId, release) : detail);
  if (cached && Date.now() - cached.updateTime < LIST_CACHE_EXPIRE_TIME) {
    return applyTmdb(cached.detail);
  }
  try {
    const data = await fetchDoubanListApi(`/subject/${doubanId}`, true, detailGate);
    // 条目下架或编号失效时豆瓣只返回 {msg: movie_not_found}，没有 id 和片名。
    // 这种空结果既不入缓存（否则 30 天都补不回来），也不往下拼面板
    if (!data || (!data.id && !data.title)) {
      return null;
    }
    // 条目接口对剧集不返回 images，海报回落到检索结果里按条目缓存的地址
    const images = data.images || {};
    const cachedPoster = cache[`poster:${doubanId}`] || {};
    const posterUrl = images.large || images.medium || images.small || cachedPoster.raw || cachedPoster.poster || '';
    const detail = {
      title: data.title || '',
      originalTitle: data.original_title || '',
      year: data.year || '',
      subtype: data.subtype || '',
      // 接口返回的海报实际是小图，换成大图才清晰；原地址留作加载失败时的回退
      poster: getLargePoster(posterUrl),
      posterFallback: posterUrl,
      summary: (data.summary || '').trim(),
      genres: Array.isArray(data.genres) ? data.genres.filter(Boolean) : [],
      countries: Array.isArray(data.countries) ? data.countries.filter(Boolean) : [],
      rating: parseFloat(data.rating?.average) || 0,
      votes: parseInt(data.ratings_count ?? data.rating?.numRaters, 10) || 0,
      episodesCount: parseInt(data.episodes_count, 10) || 0,
    };
    cache[cacheKey] = { detail, updateTime: Date.now() };
    GM_setValue(LIST_SEARCH_CACHE_KEY, cache);
    return applyTmdb(detail);
  } catch (error) {
    console.log(error);
    return null;
  }
};
// 按 IMDb 编号匹配豆瓣，与详情页一致：先取条目编号，再取条目详情拿中文片名。
// 列表页种子行的 library 属性对应悬浮面板，面板里带 IMDb 链接，能拿到就用它精确匹配
const getSubjectByImdb = async (imdbId) => {
  const cache = getListSearchCache();
  const cacheKey = `imdb:${imdbId}`;
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.updateTime < LIST_CACHE_EXPIRE_TIME) {
    return cached.subject;
  }
  try {
    const { id: idUrl } = await fetchDoubanListApi(`/imdb/${imdbId}`);
    // 条目编号的形如 https://api.douban.com/movie/{id}
    const doubanId = String(idUrl || '').match(/(?:movie|subject)\/(\d+)/)?.[1];
    if (!doubanId) {
      return null;
    }
    // 条目详情里带着中文片名、年份与该季总集数，一次请求全拿到
    const detail = await getSubjectDetail(doubanId);
    if (!detail) {
      // 反查到条目编号却拿不到详情，是条目已下架：返回标记告诉调用方
      // 「这部片豆瓣有记录但已不可用」，与「压根没有条目」区分开。
      // 标记不入缓存：网络抖动同样会走到这里，缓存下来会把后面 30 天的匹配都判死
      return { missing: true };
    }
    // 编号放展开之后：合并 TMDB 时可能带上详情里的字段，不能盖掉查到的编号
    const subject = { ...detail, id: doubanId };
    cache[cacheKey] = { subject, updateTime: Date.now() };
    GM_setValue(LIST_SEARCH_CACHE_KEY, cache);
    return subject;
  } catch (error) {
    console.log(error);
    return null;
  }
};
// 从检索结果里挑条目：剧集按「第N季」定位，电影按英文片名与年份匹配，
// 尽量不把不相关的条目挂到种子上。fuzzy 表示结果已由豆瓣补全匹配过（兜底路径），
// 此时第一个结果就是目标作品
const pickListSubject = (subjects, release, fuzzy = false) => {
  if (!subjects.length) {
    return null;
  }
  if (fuzzy) {
    return subjects.find(item => release.year && String(item.year) === String(release.year)) ||
      subjects[0];
  }
  const name = normalizeTitle(release.name);
  // AKA 别名：整串片名拆出的各段（「Enhver AKA Everyman」→ Enhver / Everyman）。
  // 精确匹配时别名与整串片名一视同仁：别名搜回的条目（original_title=Enhver）直接算命中，
  // 不再退到「年份 + 包含」兜底，年份对不上也能配上（原名带 AKA 的外语片常漏就是这原因）
  const aliasNames = (release.queries || [])
    .map(query => normalizeTitle(query))
    .filter(normalized => normalized.length > 2 && normalized !== name);
  const yearHit = (item) => release.year && String(item.year) === String(release.year);
  // 原始片名是韩语、日语等非拉丁文字时没法与英文片名比对，只能靠年份和检索排名判断
  const nonLatinHit = (item) => /[^\x20-\x7e]/.test(item.originalTitle || '');
  // 英文片名归一化后相等才算命中：包含关系太松，
  // 「Attack on Titan」会命中「Kane Pixels' Attack on Titan Shorts」这类条目；
  // 原始片名含中日韩文字时（如「BLEACH 千年血戦篇」）归一化会把非英文部分抹掉，
  // 造成「bleach」等于「bleach」的误判，这类条目不参与英文片名匹配
  const nameHit = (item) => {
    const original = item.originalTitle || '';
    if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(original)) {
      return false;
    }
    const normalized = normalizeTitle(original);
    // 整串片名精确匹配放宽到 2 字符：归一化后相等本就安全，短片名（It/Up/Us/Pi）也能配；
    // 别名只在 3 字符以上参与（aliasNames 已过滤），2 字符常见词别名（It/Her）不拿来精确配，
    // 免得误配到别部的同年片
    return (normalized.length >= 2 && normalized === name) || aliasNames.includes(normalized);
  };
  const seasonMarkers = release.season
    ? [`第${release.season}季`, `第${numberToChinese(release.season)}季`]
    : [];
  const seasonHit = (item) => seasonMarkers.some(marker => (item.title || '').includes(marker));
  // 剧集只在剧集条目里挑，电影相反
  const kindHit = (item) => (release.season ? item.subtype !== 'movie' : item.subtype !== 'tv');
  // 剧集条目的原始片名是拉丁文字时，要求与资源片名对得上（互相包含）：
  // 是中日韩等非拉丁文字时没法比对，只能认。两条兜底 clause 都靠它挡掉
  // 豆瓣检索混回来的别家剧集
  const nameRelated = (item) => {
    const original = item.originalTitle || '';
    if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(original)) {
      return true;
    }
    const normalized = normalizeTitle(original);
    return normalized.length > 2 && (
      name.includes(normalized) || normalized.includes(name) ||
      aliasNames.some(alias => alias.includes(normalized) || normalized.includes(alias))
    );
  };
  // 结果里有英文片名相等的条目，说明搜到了正确的作品
  const nameMatched = subjects.some(nameHit);
  if (release.season) {
    // 剧集只在正片剧集条目里挑：同名电影通常是另一部作品（如 Paranoia Agent 2011 电影版），
    // 特典、OVA、饭制短片也不是正片季
    const seasonCandidates = subjects.filter(item => kindHit(item) && !isSpecialSubject(item));
    // 带「第N季」标记的条目只有一条时就是目标季：番剧的豆瓣原始片名是日文，
    // 没法比对英文片名（如 Gintama S04 → 银魂 第四季 烙阳决战篇）
    const seasonOnly = seasonCandidates.filter(seasonHit);
    return subjects.find(item => seasonHit(item) && nameHit(item)) ||
      subjects.find(item => seasonHit(item) && yearHit(item)) ||
      (seasonOnly.length === 1 && nameRelated(seasonOnly[0]) ? seasonOnly[0] : null) ||
      subjects.find(item => nameHit(item) && kindHit(item)) ||
      subjects.find(item => yearHit(item) && kindHit(item)) ||
      // 豆瓣把原始片名写成中文/日文时（如 妄想代理人），英文片名相等的条目只是同名电影，
      // 这时若剧集条目只有一条，它就是目标作品；有多条时区分不出是哪一季，保持原样。
      // 原始片名是拉丁文字却与资源片名无关的同样是别家剧集
      // （如 Road Wars 会搜回 1989 年的《战争之路》），不能要
      (nameMatched && seasonCandidates.length === 1 && nameRelated(seasonCandidates[0])
        ? seasonCandidates[0]
        : null);
  }
  // 原始片名是韩语、日语等非拉丁文字时没法与英文片名比对，只能认；
  // 是英文时要求资源片名包含整个原始片名，兼容「片名 AKA 原始片名」的命名
  const titleHit = (item) => {
    if (nonLatinHit(item)) {
      return true;
    }
    const original = normalizeTitle(item.originalTitle);
    return original.length > 2 && name.includes(original);
  };
  return subjects.find(item => nameHit(item) && kindHit(item) && yearHit(item)) ||
    subjects.find(item => nameHit(item) && kindHit(item)) ||
    subjects.find(item => nameHit(item)) ||
    // 年份兜底：同年份、同类型，且原始片名对得上资源片名
    // （如 Parasite 2019 → 寄生虫、Dark Water 2002 → 鬼水怪谈）；
    // 原始片名是英文却与资源片名互不包含，说明是另一部片子，不能凭年份兜底
    // （如 What If Christmas 2026 不能错配成同年份的 What We Did at Christmas）
    subjects.find(item => yearHit(item) && kindHit(item) && titleHit(item));
};
// 两个条目是否同一部作品：中文片名（去掉季数后缀）直接比字符串——归一化会把
// 中日韩文字抹成空串，比不出来；原始片名多是拉丁文字，归一化后比。
// 季数精查时用它挡掉豆瓣检索混回来的别家剧集
const isSameListSubject = (a, b) => {
  const titleA = stripSeasonSuffix(a?.title || '');
  const titleB = stripSeasonSuffix(b?.title || '');
  const sameTitle = !!titleA && titleA === titleB;
  const sameOriginal = !!a?.originalTitle && !!b?.originalTitle &&
    normalizeTitle(a.originalTitle) === normalizeTitle(b.originalTitle);
  return sameTitle || sameOriginal;
};
// 列表条目匹配豆瓣：按片名（含 AKA 别名）逐个走 v2 检索，
// 再按 IMDb 编号精确匹配（与详情页一致）；
// 剧集最后定位到对应季的条目（其他季没有对应的 IMDB 条目，只能按片名检索）
const resolveListSubject = async (release, imdbId = '') => {
  const queries = release.queries?.length ? release.queries : [release.name];
  let subject = null;
  for (const query of queries) {
    subject = pickListSubject(await searchDoubanSubjects(query), release);
    if (subject) {
      break;
    }
  }
  // 电影检索结果与资源年份不一致时也走 IMDb 反查：英文片名完全相同的条目
  // 常是同名不同片（2019 的《返校》撞上 2008 的《Detention》），
  // 反查到的条目才是权威。剧集不查：条目年份是首播年，与资源里的季年份本就要错开
  const yearMismatch = !release.season && !!release.year && !!subject?.year &&
    String(subject.year) !== String(release.year);
  // 片名完全对不上、或检索到的条目没有中文片名时，
  // 按 IMDb 编号精确匹配再试一次（如外语片的豆瓣片名与资源片名毫无关系）
  if (imdbId && (!subject || !isChinese(stripSeasonSuffix(subject.title)) || yearMismatch)) {
    const imdbSubject = await getSubjectByImdb(imdbId);
    if (imdbSubject?.missing) {
      // 反查到条目却已下架：按片名命中的活条目是另一部片子，整个匹配作废
      // （如《返校》2019 反查到已下架的 Fanxiao，检索里的《Detention》2008 不能用）
      if (yearMismatch) {
        subject = null;
      }
    } else if (imdbSubject && isChinese(stripSeasonSuffix(imdbSubject.title))) {
      subject = imdbSubject;
    }
  }
  if (!subject) {
    return null;
  }
  // 挑到的条目带了其他季的标记（如要第二季却命中第一季）时，
  // 用中文片名 + 季数再查一次精确定位
  const hitSeason = (subject.title || '').match(/第(.+?)季/)?.[1] ?? '';
  if (release.season > 1 && hitSeason &&
    hitSeason !== String(release.season) && hitSeason !== numberToChinese(release.season)) {
    const seasonSubject = pickListSubject(
      await searchDoubanSubjects(`${stripSeasonSuffix(subject.title)} 第${release.season}季`),
      release,
    );
    // 精查结果必须还是同一部作品：豆瓣按「中文片名 第N季」检索时返回很松，
    // 会把别家剧集的同一季混进来（如《大战消费者》第9季搜回《乐高忍者》第九季），
    // 中文片名或原始片名对得上才认；对不上就沿用原条目，季数显示仍取资源里的
    if (seasonSubject && isSameListSubject(seasonSubject, subject)) {
      subject = seasonSubject;
    }
  }
  return subject;
};
// TMDB 兜底路径的该季总集数：只有剧集、且整季资源才需要，
// 编号或媒体类型对不上时返回 0，片名格式退回不带「全N集」
const getTmdbSeasonCount = async (merged, season) => {
  if (!listTmdbSeasonCount || !merged?.tmdbId || merged.mediaType !== 'tv' || !season) {
    return 0;
  }
  try {
    return (await listTmdbSeasonCount(merged.tmdbId, season)) || 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
};
// 整季资源要显示豆瓣该季的总集数，只有条目接口返回 episodes_count
const getSubjectEpisodeCount = async (doubanId) => {
  if (!doubanId) {
    return 0;
  }
  const detail = await getSubjectDetail(doubanId);
  return detail?.episodesCount || 0;
};
// 列表页中文片名：
// 电影「宇宙巨人：希曼崛起 (2026)」
// 单集「中央情报局 第二季 第4集 (2026)」
// 整季「妄想代理人 第一季 全13集 (2004)」，集数取豆瓣该季的总集数
const formatListTitle = (subject, release, episodeCount = 0) => {
  const baseTitle = stripSeasonSuffix(subject.title);
  const year = release.year || subject.year || '';
  const yearText = year ? ` (${year})` : '';
  if (!release.season) {
    return `${baseTitle}${yearText}`;
  }
  const seasonText = `第${numberToChinese(release.season)}季`;
  if (release.episode) {
    return `${baseTitle} ${seasonText} 第${release.episode}集${yearText}`;
  }
  if (episodeCount > 0) {
    return `${baseTitle} ${seasonText} 全${episodeCount}集${yearText}`;
  }
  return `${baseTitle} ${seasonText}${yearText}`;
};
// 悬浮在豆瓣片名上时弹出豆瓣简介。面板复刻原站的悬浮简介面板：同样的容器类名、
// 内联样式与内部结构（评分徽章、海报、片名年份、简介、类型），只把内容换成豆瓣的，
// 站点主题样式因此能原样生效，形式、大小、布局、颜色与原站一致
const LIST_POPUP_SHOW_DELAY = 700;
const LIST_POPUP_HIDE_DELAY = 400;
// 原站把面板放在链接上方 299px 处；链接太靠屏幕顶部时改放到链接所在行下方
const LIST_POPUP_OFFSET_TOP = 299;
const LIST_POPUP_OFFSET_LEFT = 2;
const listPopup = { node: null, inner: null, showTimer: 0, hideTimer: 0, hoverLink: null };
// 没有原站悬浮简介面板可复刻的站点（Blutopia，以及 BTN、FL、HDS、HDT、iTS），
// 面板按一套自包含的暗色卡片另做，不依赖站点自身的样式类
const isCardListPopup = () => CURRENT_SITE_INFO.listPage?.popupTheme === 'card';
const escapeListHtml = (text) => String(text ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const hideListPopup = () => {
  clearTimeout(listPopup.showTimer);
  if (listPopup.node) {
    listPopup.node.style.display = 'none';
  }
};
// 定位方式与原站一致：面板放链接上方，链接太靠屏幕顶部时改放到链接所在行下方
const positionListPopup = (node, link) => {
  const rect = link.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  let popupTop = top - LIST_POPUP_OFFSET_TOP;
  if (popupTop - window.scrollY < 0) {
    popupTop = top + (link.closest('tr')?.offsetHeight || rect.height) - 12;
  }
  node.style.top = `${popupTop}px`;
  node.style.left = `${Math.max(rect.left + window.scrollX - LIST_POPUP_OFFSET_LEFT, 0)}px`;
};
const getListPopup = () => {
  // 页面整体重写后原节点已不在文档里，重新挂一个
  if (!listPopup.node || !document.body.contains(listPopup.node)) {
    const node = document.createElement('div');
    node.className = 'librarydiv douban-list-popup';
    node.setAttribute('style', 'z-index: 99999; position: absolute; width: 680px; height: 300px; background: transparent; display: none;');
    const inner = document.createElement('div');
    if (isCardListPopup()) {
      // 配色、圆角、字体都取站点自己的变量，主题切换时面板跟着变
      inner.className = 'douban-list-popup-inner douban-card-inner';
      inner.setAttribute('style', 'width: 680px; position: absolute; height: 290px; box-sizing: border-box; padding: 0; overflow: hidden; background: var(--torrent-card-bg, #272727); border: 1px solid #3c3c3c; border-radius: 6px; color: var(--torrent-row-fg, #ccc); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.46667;');
    } else {
      inner.className = 'libraryinner';
      // 尺寸与原站完全一致：外层 680x300、内层 680x290，简介超长时内部滚动
      inner.setAttribute('style', 'width: 680px; position: absolute; height: 290px; border: 1px solid #343434; background-color: #242424; padding: 10px; border-radius: 2px;');
    }
    node.appendChild(inner);
    document.body.appendChild(node);
    // 鼠标移到面板上时保持显示，与原站一致，方便停留阅读、滚动简介
    node.addEventListener('mouseenter', () => clearTimeout(listPopup.hideTimer));
    node.addEventListener('mouseleave', () => {
      listPopup.hideTimer = setTimeout(hideListPopup, LIST_POPUP_HIDE_DELAY);
    });
    listPopup.node = node;
    listPopup.inner = inner;
  }
  return listPopup;
};
// 卡片式面板内容：顶部一条评分栏，下面左边海报、右边片名年份简介，
// 配色和圆角走站点变量（取不到时用内置的暗色值），字段缺失时去掉对应的小节
const buildCardPopupHtml = (detail, doubanUrl) => {
  const url = escapeListHtml(doubanUrl);
  const ratingBar = detail.rating
    ? `<div class="douban-card-head"><span class="douban-card-rating" title="豆瓣评分"><span class="douban-card-star">&#9733;</span> ${detail.rating.toFixed(1)}</span></div>`
    : '<div class="douban-card-head"></div>';
  const posterCell = detail.poster
    ? `<div class="douban-list-poster-cell douban-card-poster-cell"><a href="${url}" target="_blank" rel="noreferrer"><img class="douban-list-poster" src="${escapeListHtml(detail.poster)}" referrerpolicy="unsafe-url" style="width: 110px !important; height: 164px !important; object-fit: cover; border-radius: 5px;"></a></div>`
    : '';
  const year = detail.year ? `<span class="douban-card-year">(${escapeListHtml(detail.year)})</span>` : '';
  const summary = detail.summary
    ? `<div class="douban-card-summary">${escapeListHtml(detail.summary)}</div>`
    : '';
  const countries = detail.countries.length
    ? `<div class="douban-card-countries">${detail.countries.map(country => escapeListHtml(country)).join('<span class="douban-card-sep">|</span>')}</div>`
    : '';
  const genres = detail.genres.map(genre => `<span class="douban-card-genre">${escapeListHtml(genre)}</span>`).join('');
  return `${ratingBar}<div class="douban-card-body">${posterCell}<div class="douban-card-info">
<div class="douban-card-title-line"><a class="douban-card-title" href="${url}" target="_blank" rel="noreferrer">${escapeListHtml(detail.title)}</a>${year}</div>
<div class="douban-card-rule"></div>
${summary}${countries}<div class="douban-card-genres">${genres}</div></div></div>`;
};
// 面板内容照原站悬浮面板的结构拼装，字段缺失时去掉对应的小节
const buildListPopupHtml = (detail, doubanUrl) => {
  if (isCardListPopup()) {
    return buildCardPopupHtml(detail, doubanUrl);
  }
  const url = escapeListHtml(doubanUrl);
  const ratingRow = detail.rating
    ? `<div class="hd-table"><div class="bhd-td bhd-w100"><div class="rule-line" style="padding-bottom: 6px; margin-bottom: 12px;"><div class="button-holder"><div class="beta-td beta-w40 text-left"></div><div class="beta-td beta-w60 text-right"><h3 class="description_title class-standard" style="padding: 0; margin: 0; text-transform: uppercase; font-size: 12px;"><span class="badge-meta" title="豆瓣评分"><span class="movie-rating-stars"><i class="fal fa-star"></i></span> ${detail.rating.toFixed(1)}</span></h3></div></div></div></div></div>`
    : '';
  // 海报按原站的 110x164 裁切填充，面板高度因此与原站一致
  const posterCell = detail.poster
    ? `<div class="beta-td text-left douban-list-poster-cell" style="width: 120px;"><a href="${url}" target="_blank" rel="noreferrer"><img class="douban-list-poster" src="${escapeListHtml(detail.poster)}" referrerpolicy="unsafe-url" style="width: 110px !important; height: 164px !important; object-fit: cover;"></a></div>`
    : '';
  const yearCell = detail.year
    ? `<div class="beta-td text-right"><h3 class="beta-fix-desc-h3" style="margin: 0; padding: 0;"><a class="beta-link-blend" href="${url}" target="_blank" rel="noreferrer" style="text-decoration: none !important; border-bottom: none; font-size: 16px;"><span class="text-bold">${escapeListHtml(detail.year)}</span></a></h3></div>`
    : '';
  // 简介超长时在面板内部滚动，面板高度保持原站的 300px
  const summary = detail.summary
    ? `<a href="${url}" target="_blank" rel="noreferrer" class="beta-link-blend" style="display: block; max-height: 120px; overflow-y: auto;">${escapeListHtml(detail.summary)}</a><div style="margin-top: 12px;"></div>`
    : '';
  const countries = detail.countries.length
    ? `<div class="font-stat">${detail.countries.map(country => escapeListHtml(country)).join('<span style="margin: auto 6px;">|</span>')}</div>`
    : '';
  const genres = detail.genres.map(genre => `<span class="badge-meta beta-link-blend">${escapeListHtml(genre)}</span>`).join('');
  return `${ratingRow}<div class="hd-table">${posterCell}<div class="beta-td text-right" style="vertical-align: top; text-align: right;">
<div class="rule-line" style="text-align: right; width: 95%; margin: auto; padding-bottom: 6px;"><div class="bhd-table" style="width: 100%;">
<div class="beta-td text-left" style="width: 80%;"><h3 class="beta-fix-desc-h3" style="margin: 0; padding: 0; font-size: 16px;"><a href="${url}" target="_blank" rel="noreferrer" style="color: #ffffff; font-weight: bold !important;"><span class="beta-link-big">${escapeListHtml(detail.title)}</span></a></h3></div>${yearCell}
</div></div>
<div style="margin-right: 0; margin-top: 6px; padding-top: 6px;"></div>
<div style="font-size: 13px; color: #999999; text-align: left; width: 95%; margin: auto;">${summary}${countries}</div></div></div>
<div class="beta-divider" style="padding-top: 12px; margin-top: 12px; font-size: 13px; margin-left: auto; margin-right: auto;"></div>
<div style="width: 100%; text-align: right; margin-left: auto; margin-right: auto;">${genres}</div>`;
};
// 用脚本自己的请求拉豆瓣海报，返回 data 地址；失败返回空串。
// 站点 CSP、防盗链或浏览器安全设置都可能拦住外链图片，
// 脚本的请求与豆瓣接口是同一条通道，不受页面限制，能兜住大部分情况
const POSTER_FETCH_TIMEOUT = 15000;
// 响应体转成 data 地址。GM_xmlhttpRequest 多数环境给的是 Blob，个别实现
// （如某些版本的 Edge）会退回成字符串或 ArrayBuffer，统一包成 Blob 再读。
// Blob 还有可能是别的 realm 构造出来的（脚本沙箱与扩展进程各一份构造函数），
// instanceof 判断不可靠，那种情况走它自己的 arrayBuffer() 再包一层
const readPosterAsDataUrl = async (body) => {
  let blob = body;
  try {
    if (typeof body === 'string' || body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      blob = new Blob([body], { type: 'image/jpeg' });
    } else if (typeof Blob !== 'undefined' && !(blob instanceof Blob) && typeof blob?.arrayBuffer === 'function') {
      blob = new Blob([await blob.arrayBuffer()], { type: 'image/jpeg' });
    }
    if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
      return '';
    }
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return '';
  }
};
const fetchDoubanPoster = (url) => new Promise((resolve) => {
  if (!url) {
    resolve('');
    return;
  }
  // 无论成功失败都保证 promise 落地，调用方不会一直等下去
  let settled = false;
  const finish = (value) => {
    if (!settled) {
      settled = true;
      resolve(value);
    }
  };
  // 个别环境的 GM_xmlhttpRequest 既不回调也不抛错，超时兜底让海报格不会一直空着
  const timer = setTimeout(() => finish(''), POSTER_FETCH_TIMEOUT);
  const done = (value) => {
    clearTimeout(timer);
    finish(value);
  };
  // blob 拿不到时再试一次 arraybuffer：个别实现（旧版 Edge 等）不返回 Blob，
  // 但 ArrayBuffer 都能给，统一包成 Blob 再读
  const attempt = (responseType, allowRetry = true) => {
    try {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType,
        timeout: POSTER_FETCH_TIMEOUT,
        headers: { Referer: 'https://movie.douban.com/' },
        onload: (res) => {
          if (res.status !== 200 || !res.response) {
            if (allowRetry) {
              attempt('arraybuffer', false);
              return;
            }
            done('');
            return;
          }
          readPosterAsDataUrl(res.response).then(done);
        },
        onerror: () => {
          if (allowRetry) {
            attempt('arraybuffer', false);
            return;
          }
          done('');
        },
        ontimeout: () => done(''),
      });
    } catch (error) {
      if (allowRetry) {
        attempt('arraybuffer', false);
        return;
      }
      done('');
    }
  };
  attempt('blob');
});
// 原站页面里同一条资源的海报：BHD 在悬浮面板 #librarydiv{id} 里，Blutopia 海报视图的
// 行里有站点自己的海报图，HDS、HDT 把海报挂在原标题的 onmouseover 悬浮里。都拿不到时返回空串
// overlib 悬浮里的海报，如 <img src=./imdbphp/images/0045875.jpg width=180 border=0>
const parseHoverPoster = (link) => {
  const hoverAttr = `${link.getAttribute('onmouseover') || ''} ${link.getAttribute('title') || ''}`;
  // 站点把属性值里的引号写成转义形式（HDT 的 overlib 参数），\? 兼容这种写法
  const hoverPoster = hoverAttr.match(/\bsrc=\\?["']?([^"'\s>]+\.(?:jpe?g|png|webp))/i)?.[1];
  if (!hoverPoster) {
    return '';
  }
  // 站点写的是相对地址，按当前页面补成绝对地址
  try {
    return new URL(hoverPoster, location.href).href;
  } catch (error) {
    return hoverPoster;
  }
};
const getNativeListPoster = (link, row) => {
  const libraryId = link.closest('tr')?.getAttribute('library') || link.getAttribute('library') || '';
  const panelPoster = libraryId
    ? document.querySelector(`#librarydiv${libraryId} img`)?.getAttribute('src')
    : '';
  if (panelPoster) {
    return panelPoster;
  }
  const rowPoster = (row || link.closest('tr'))?.querySelector('.torrent-search--list__poster-img')?.getAttribute('src');
  if (rowPoster) {
    return rowPoster;
  }
  // HDBits 在名称格放 IMDb 海报，HDF 在组头放封面图，外链图片全被拦时靠它们兜底
  const cellPoster = (row || link.closest('tr'))?.querySelector('.browse_imdb_poster img, .group_image img')?.getAttribute('src');
  if (cellPoster) {
    return cellPoster;
  }
  // HDS、HDT 的海报只挂在 onmouseover 里，而绑定豆瓣面板时这个属性已被摘掉，
  // 所以摘之前先把地址存到链接上，外链图片全被拦时靠它兜底
  const stashed = link.dataset.doubanListPoster ||
    link.closest('[data-douban-list-poster]')?.dataset.doubanListPoster ||
    (row || link.closest('tr'))?.querySelector('[data-douban-list-poster]')?.dataset.doubanListPoster ||
    '';
  return stashed || parseHoverPoster(link);
};
// 脚本拉到的豆瓣海报（data 地址）按地址缓存，重复悬浮不再请求豆瓣
const listPosterCache = new Map();
// 同一个海报只拉一次：多条资源对应同一条豆瓣条目时共用一次请求
const listPosterFetching = new Map();
// 海报加载链。站点普遍不发 Referer（BHD 是 no-referrer、BTN 是 same-origin），
// 豆瓣图床对无 Referer 的请求一律返回 418，页面里直连必失败；TMDB 图床不校验
// Referer，是直连失败后的主力兜底。
// 顺序：豆瓣大图 → 豆瓣原图 → TMDB → 原站海报；同时由脚本带上 Referer 拉豆瓣图，
// 拉到就换成豆瓣的（数据源优先级 豆瓣 > TMDB > 原站）。全部来源都失败才收起海报格
const loadListPoster = (img, urls, getTmdbPoster) => {
  const hide = () => {
    img.closest('.douban-list-poster-cell')?.style.setProperty('display', 'none');
  };
  const [doubanLarge, doubanRaw, nativePoster] = urls;
  let shown = '';
  let kind = '';
  let loaded = false;
  let pending = false;
  // 兜底来源的状态：脚本拉图进行中 / 拉到的 data 地址、TMDB 海报是否已取到
  let scriptPending = false;
  let scriptData = '';
  let tmdbPending = false;
  let fallbackStarted = false;
  const show = (url, from) => {
    if (!url || url === shown) {
      return false;
    }
    kind = from;
    shown = url;
    loaded = false;
    pending = true;
    img.src = url;
    return true;
  };
  img.addEventListener('load', () => {
    loaded = true;
    pending = false;
  });
  img.addEventListener('error', () => {
    loaded = false;
    pending = false;
    advance();
  });
  // 直连链：豆瓣大图 → 豆瓣原图，两个都失败才启动兜底。
  // Referer 正常发出的站点一次兜底请求都不会多打
  const direct = [doubanLarge, doubanRaw].filter(Boolean);
  let index = 0;
  const advance = () => {
    if (!fallbackStarted) {
      // 同一个地址重复赋值不会触发新的 load/error，直接跳过找下一个来源
      while (index < direct.length) {
        const url = direct[index];
        index += 1;
        if (show(url, 'douban')) {
          return;
        }
      }
      fallbackStarted = true;
      runFallback();
      return;
    }
    // 兜底阶段出错（TMDB 或原站海报挂了）：脚本也拉不到图就没有海报了
    if (!scriptPending && !scriptData) {
      hide();
    }
  };
  // 兜底：原站海报先顶上，保证立刻有图；随后脚本拉到的豆瓣图、TMDB 海报
  // 并行取，谁先出来按优先级换掉它（豆瓣 > TMDB > 原站）
  const runFallback = () => {
    const settle = () => {
      if (scriptPending || tmdbPending || pending || loaded || scriptData) {
        return;
      }
      hide();
    };
    if (nativePoster) {
      show(nativePoster, 'native');
    }
    if (doubanLarge) {
      const cached = listPosterCache.get(doubanLarge);
      if (cached) {
        scriptData = cached;
        show(cached, 'script');
      } else {
        scriptPending = true;
        let fetching = listPosterFetching.get(doubanLarge);
        if (!fetching) {
          fetching = fetchDoubanPoster(doubanLarge);
          listPosterFetching.set(doubanLarge, fetching);
        }
        fetching.then((dataUrl) => {
          listPosterFetching.delete(doubanLarge);
          scriptPending = false;
          scriptData = dataUrl || '';
          // 豆瓣优先：直连失败后，无论当前显示的是 TMDB 还是原站海报，都换成豆瓣的
          if (scriptData && (kind !== 'douban' || !loaded)) {
            show(scriptData, 'script');
          }
          settle();
        });
      }
    }
    if (typeof getTmdbPoster === 'function') {
      tmdbPending = true;
      Promise.resolve()
        .then(() => getTmdbPoster())
        .then((url) => {
          tmdbPending = false;
          // 脚本还没拉到时先用 TMDB 顶着，保证尽快出图；脚本拉到后会换成豆瓣海报
          if (url && !scriptData && show(url, 'tmdb')) {
            return;
          }
          settle();
        })
        .catch(() => {
          tmdbPending = false;
          settle();
        });
    }
    settle();
  };
  const cached = doubanLarge ? listPosterCache.get(doubanLarge) : '';
  if (cached) {
    scriptData = cached;
    show(cached, 'script');
  } else {
    advance();
  }
};
const showListPopup = async (link, doubanId, doubanUrl, imdbId = '', release = null) => {
  // 豆瓣有条目时拉豆瓣详情（缺字段由 TMDB 补），走详情闸门不被整页检索堵住；
  // 豆瓣没有条目时面板直接用 TMDB 的数据（BTN 这类没有 IMDb 编号的站按片名检索）
  const detail = doubanId
    ? await getSubjectDetail(doubanId, imdbId, true, release)
    : await mergeListSubject(null, imdbId, release);
  // 请求期间鼠标可能已经移开，也可能移到了另一个片名上
  if (!detail || listPopup.hoverLink !== link) {
    return;
  }
  // 原站自己有同一条资源的海报，与页面同源，浏览器不会拦：
  // 豆瓣没给海报时先用它顶上，外链图片全被拦时也靠它兜底
  const { listPage = {} } = CURRENT_SITE_INFO;
  const row = link.closest(listPage.row || 'tr');
  const nativePoster = getNativeListPoster(link, row);
  // 豆瓣条目没有海报（多见于刚上线的新剧集）时借站点海报，缓存里的详情不改动
  const popupDetail = detail.poster || !nativePoster ? detail : { ...detail, poster: nativePoster };
  const { node, inner } = getListPopup();
  inner.innerHTML = buildListPopupHtml(popupDetail, doubanUrl);
  // 海报走加载链：豆瓣大图、原图直连失败后换 TMDB、再换原站海报，
  // 同时由脚本拉豆瓣海报换上。TMDB 海报懒取，只有豆瓣图直连全失败才去请求
  const poster = inner.querySelector('img.douban-list-poster');
  if (poster) {
    const getTmdbPoster = async () => {
      if (!listTmdbPoster) {
        return '';
      }
      try {
        // 优先按 IMDb 编号匹配；站点行里没有 IMDb 编号时（如 BTN），
        // 用豆瓣条目的原始片名 + 年份检索，两个数据源路径都走同一份缓存
        // mediaType 传豆瓣条目的 subtype（'tv'/'movie'），TMDB 检索接口按它选 /search/tv 或 /search/movie
        return (await listTmdbPoster(imdbId, popupDetail.originalTitle, popupDetail.year, popupDetail.subtype)) || '';
      } catch (error) {
        console.log(error);
        return '';
      }
    };
    loadListPoster(poster, [popupDetail.poster, popupDetail.posterFallback, nativePoster], getTmdbPoster);
  }
  positionListPopup(node, link);
  node.style.display = 'block';
  // 淡入与原站的 fadeIn 一致，浏览器不支持动画时直接显示
  node.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
};
const scheduleListPopup = (link, doubanId, doubanUrl, imdbId = '', release = null) => {
  clearTimeout(listPopup.showTimer);
  listPopup.hoverLink = link;
  listPopup.showTimer = setTimeout(() => showListPopup(link, doubanId, doubanUrl, imdbId, release), LIST_POPUP_SHOW_DELAY);
};
// 原标题与豆瓣片名视为一组，共用同一个简介面板：原站的悬浮面板在列表页已停用，
// 光标放到哪个标题上都弹豆瓣的，延迟与收起时序和原站一致
const bindListPopup = (links, doubanId, doubanUrl, imdbId = '', release = null) => {
  links.forEach((link) => {
    // 站点把原生悬浮挂在 inline 的 onmouseover/onmouseout 上（HDS、HDT 的 overlib），
    // 摘掉它，避免和豆瓣面板同时弹出；悬浮里的海报地址先留下来兜底
    const hoverPoster = parseHoverPoster(link);
    if (hoverPoster) {
      link.dataset.doubanListPoster = hoverPoster;
    }
    link.removeAttribute('onmouseover');
    link.removeAttribute('onmouseout');
    link.addEventListener('mouseenter', () => {
      clearTimeout(listPopup.hideTimer);
      scheduleListPopup(link, doubanId, doubanUrl, imdbId, release);
    });
    link.addEventListener('mouseleave', (event) => {
      clearTimeout(listPopup.showTimer);
      // 光标移到同组的另一个标题上：面板不灭，已打开的直接换个位置
      if (links.includes(event.relatedTarget)) {
        if (listPopup.node && listPopup.node.style.display === 'block') {
          listPopup.hoverLink = event.relatedTarget;
          positionListPopup(listPopup.node, event.relatedTarget);
        } else {
          scheduleListPopup(event.relatedTarget, doubanId, doubanUrl, imdbId, release);
        }
        return;
      }
      if (listPopup.hoverLink === link) {
        listPopup.hoverLink = null;
      }
      listPopup.hideTimer = setTimeout(hideListPopup, LIST_POPUP_HIDE_DELAY);
    });
    link.addEventListener('click', hideListPopup);
  });
};
// 中文片名挂在原标题下方：块级元素、左对齐，字体样式逐个拷贝原标题的计算样式，
// 保证大小、颜色、粗细与原标题一致
const insertListTitle = (titleLink, titleText, doubanLink, doubanId, imdbId = '', release = null) => {
  // 站点异步重绘后行里可能留着上一轮的豆瓣片名，先摘掉再插，避免同一行出现两条
  const staleSibling = titleLink.nextElementSibling;
  if (staleSibling?.classList.contains('douban-list-title')) {
    staleSibling.remove();
  }
  const wrapper = document.createElement('div');
  wrapper.className = 'douban-list-title';
  // 块级 + 左对齐，用 important 压过站点自身可能存在的容器对齐规则
  // （如 .torrent .torrent-title 的居中对齐）
  wrapper.style.setProperty('display', 'block', 'important');
  wrapper.style.setProperty('text-align', 'left', 'important');
  const anchor = document.createElement('a');
  anchor.href = doubanLink;
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  anchor.title = titleText;
  anchor.textContent = titleText;
  // 字体样式逐个拷贝原标题的计算样式，直接设在链接元素上：
  // 站点样式表往往单独规定 a 的颜色与下划线，设在父容器上会被它盖掉，
  // 中文片名就会变成默认的链接蓝色，与原标题不一致
  const titleStyle = getComputedStyle(titleLink);
  ['fontSize', 'color', 'fontWeight', 'fontFamily', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'textDecoration'].forEach(property => {
    anchor.style[property] = titleStyle[property];
  });
  wrapper.appendChild(anchor);
  const parent = titleLink.parentNode;
  // 原标题在弹性/网格容器里时包一层纵向容器，否则中文片名会排到原标题右边
  if (/flex|grid/.test(getComputedStyle(parent).display)) {
    // 上一轮已经包过的（站点重绘后链接还在老盒子里），直接复用那个盒子
    const oldBox = titleLink.parentElement?.classList.contains('douban-list-title-box')
      ? titleLink.parentElement
      : null;
    if (oldBox) {
      oldBox.querySelector('.douban-list-title')?.remove();
      oldBox.appendChild(wrapper);
      bindListPopup([titleLink, anchor], doubanId, doubanLink, imdbId, release);
      return;
    }
    const box = document.createElement('div');
    box.className = 'douban-list-title-box';
    // 原标题是网格项时（如 Blutopia 用命名网格区域排标题行），把它的网格定位
    // 整个挪到盒子上，片名才会排在原标题正下方；否则盒子被自动排到网格后面的行里，
    // 跑到上传者、图标那一行下面去了
    ['gridArea', 'gridRow', 'gridColumn'].forEach(property => {
      if (titleStyle[property] && titleStyle[property] !== 'auto') {
        box.style[property] = titleStyle[property];
      }
    });
    parent.insertBefore(box, titleLink);
    box.appendChild(titleLink);
    box.appendChild(wrapper);
    // 原标题的网格定位已由盒子接管，清掉它自己的，免得在盒子的内层布局里错排
    titleLink.style.gridArea = 'auto';
  } else {
    // 标题同一行的行内内容常以 br 显式换行收尾（BTN 是「标题 - 镜像链接」一行、
    // 标签一行）：块级的豆瓣片名若插在 br 之前，br 会落到新块开头撑出一个空行，
    // 行高凭空比站点数据多一行；行内流里没有 br 时也要走到行内内容的尽头再插，
    // 否则标题后面的文字、标签会被截断成新的一行（如 BTN 标签结尾的 "]"）。
    // 插在标题行的换行处，片名紧挨原标题下方，行高只多片名本身那一行
    let ref = titleLink;
    while (ref.nextSibling) {
      const next = ref.nextSibling;
      // 3 是文本节点：标题后面的文字、标签都属于标题这一行，插到它们后面
      if (next.nodeType === 3) {
        ref = next;
        continue;
      }
      if (next.nodeType !== 1 || !/^inline(-block|-flex|-grid)?$/.test(getComputedStyle(next).display)) {
        break;
      }
      ref = next;
      if (next.tagName === 'BR') {
        break;
      }
    }
    // 插入点跳过行内内容后，上一轮的豆瓣片名挂在后面，按新位置再清一次
    if (ref.nextElementSibling?.classList.contains('douban-list-title')) {
      ref.nextElementSibling.remove();
    }
    parent.insertBefore(wrapper, ref.nextSibling);
  }
  // 原标题与豆瓣片名都绑同一个简介面板，光标放到哪个上都弹豆瓣的
  bindListPopup([titleLink, anchor], doubanId, doubanLink, imdbId, release);
};
// 种子行的 library 属性对应悬浮面板 #librarydiv{id}，面板里带 IMDb 链接。
// 详情页就是按 IMDb 编号精确匹配豆瓣的，列表页能拿到时也用它兜底
const getListTitleImdbId = (link, row) => {
  // Blutopia 把 IMDb 编号放在种子行的 data-imdb-id 上，存的是不带前导零的数字
  const dataImdbId = row?.getAttribute('data-imdb-id') ||
    link.closest('[data-imdb-id]')?.getAttribute('data-imdb-id') || '';
  const imdbDigits = (dataImdbId.match(/^(?:tt)?(\d+)$/i) || [])[1];
  if (imdbDigits) {
    // IMDb 编号形如 tt 加 7 位数字，豆瓣接口只认补零后的形式（tt167404 查不到，tt0167404 可以）
    return `tt${imdbDigits.padStart(7, '0')}`;
  }
  // HDS、HDT 的列表页在行内直接放 IMDb 评分链接，取它的编号
  const rowImdb = (row || link.closest('tr'))?.querySelector('a[href*="imdb.com/title/"]')
    ?.getAttribute('href')?.match(/imdb\.com\/title\/(tt\d+)/);
  if (rowImdb) {
    return rowImdb[1];
  }
  // AlphaRatio 把 IMDb 编号放在行的标签链接里（taglist=tt0763840），
  // 行内没有 imdb.com 链接，按配置的正则从这些链接的 href 里提取
  const tagPattern = CURRENT_SITE_INFO.listPage?.imdbTagPattern;
  if (tagPattern) {
    const tagLinks = (row || link.closest('tr'))?.querySelectorAll('a[href]') || [];
    for (const tagLink of tagLinks) {
      const tagMatched = tagLink.getAttribute('href')?.match(new RegExp(tagPattern));
      if (tagMatched?.[1]) {
        return tagMatched[1];
      }
    }
  }
  // HDBits 的 IMDb 链接挂在 film info 链接的 data-imdb-link 属性上，取属性的编号
  const dataImdbLink = (row || link.closest('tr'))?.querySelector('[data-imdb-link*="imdb.com/title/"]')
    ?.getAttribute('data-imdb-link')?.match(/imdb\.com\/title\/(tt\d+)/);
  if (dataImdbLink) {
    return dataImdbLink[1];
  }
  const libraryId = link.getAttribute('library');
  if (!libraryId || !/^\d+$/.test(libraryId)) {
    return '';
  }
  const panel = document.querySelector(`#librarydiv${libraryId}`);
  const matched = panel?.querySelector('a[href*="imdb.com/title/"]')
    ?.getAttribute('href')?.match(/imdb\.com\/title\/(tt\d+)/);
  return matched?.[1] ?? '';
};
// 默认的种子编号提取规则：href 形如 /torrents/{slug}.{id}（也兼容 /torrents/{id}）。
// 各站写法不一样（details.php?id=、id=40位哈希等），用配置里的 idPattern 覆盖
const DEFAULT_LIST_ID_PATTERN = /\/torrents\/(?:.+\.)?(\d+)(?:[/?#]|$)/;
// 配置可以给多条编号规则，按顺序试，先命中的赢。同一个链接里常带两个编号，
// 必须取到单条种子那一级：BTN 的 View Torrent 是 torrents.php?id={组}&torrentid={种子}，
// 取 id= 拿到的是剧集组编号，同一集的所有压制版本共用它，会被并成一组、
// 只给其中一个插片名；取不到单条种子编号时才退回组编号
const getListTorrentId = (link, idPattern) => {
  const href = link.getAttribute('href') || '';
  const patterns = Array.isArray(idPattern) ? idPattern : [idPattern || DEFAULT_LIST_ID_PATTERN];
  for (const pattern of patterns) {
    const matched = href.match(new RegExp(pattern));
    if (matched?.[1]) {
      return matched[1];
    }
  }
  return '';
};
// 原标题的显示文本。站点常把标题截断，完整发行名放在元素属性（FileList 的 title、
// iTS 的 output）或行内另一个元素（BTN 的 Release Name）里，优先取完整的那个
const getListTitleText = (link, listPage, row) => {
  const fromAttr = listPage.titleAttr ? link.getAttribute(listPage.titleAttr) : '';
  if (fromAttr && fromAttr.trim()) {
    return fromAttr.trim();
  }
  if (listPage.releaseName && row) {
    const releaseNode = row.querySelector(listPage.releaseName);
    const release = releaseNode?.getAttribute('title') || releaseNode?.textContent || '';
    if (release.trim()) {
      return release.trim();
    }
  }
  // 站点把工具提示的文本放在标题链接里面（IPT 的悬浮卡片占位就是链接的子
  // div），取正文前先剔掉这些节点，否则「Loading...」会粘在发行名尾巴上，
  // 片名检索跟着受影响
  if (listPage.titleTextStrip) {
    const clone = link.cloneNode(true);
    clone.querySelectorAll(listPage.titleTextStrip).forEach((node) => node.remove());
    const stripped = (clone.textContent || '').trim();
    if (stripped) {
      return stripped;
    }
  }
  return (link.textContent || '').trim();
};
// 列表页的种子标题链接。同一个种子常有标题、做种数、评论数等多个链接，
// 按种子编号分组，取文本最长的作为原标题，避免同一行插多条豆瓣片名
const collectListTitleLinks = () => {
  const { listPage = {} } = CURRENT_SITE_INFO;
  const selector = listPage.titleLink || 'a[href*="/torrents/"]';
  const rowSelector = listPage.row || 'tr';
  const groups = new Map();
  Array.from(document.querySelectorAll(selector)).forEach(link => {
    const id = getListTorrentId(link, listPage.idPattern);
    const text = getListTitleText(link, listPage, link.closest(rowSelector));
    if (!id || !text) {
      return;
    }
    if (!groups.has(id)) {
      groups.set(id, []);
    }
    groups.get(id).push({ link, text });
  });
  const titles = [];
  groups.forEach((items, id) => {
    // 已处理过的种子不再处理，避免异步渲染时反复请求
    if (items.some(item => item.link.dataset.doubanListTitle)) {
      return;
    }
    const title = items.reduce((longest, item) => (item.text.length > longest.text.length ? item : longest));
    const row = title.link.closest(rowSelector);
    titles.push({ ...title, id, imdbId: getListTitleImdbId(title.link, row), row, links: items });
  });
  return titles;
};
// 同一部作品的多个版本共用一次检索结果：BTN 这类站同一集常有十几种压制版本，
// 逐个查豆瓣又慢又费配额，而它们的片名、季数、集数完全一样，只是发行名后缀不同。
// 键里带上季集——单集与整季的展示格式不同，集数还要拿去校验匹配是否可靠，不能混。
// 缓存按文档隔离，换页面、换站点自动失效（脚本只处理当前页面，跨页面不共享）
const listResolveCaches = new WeakMap();
// 片名归一化要保住中日韩文字：normalizeTitle 会把非拉丁字符全抹掉，
// 中文片名会塌成空串而互相撞键
const listResolveKeyTitle = (name) => String(name || '')
  .toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, '');
const getListResolveCache = () => {
  let cache = listResolveCaches.get(document);
  if (!cache) {
    cache = new Map();
    listResolveCaches.set(document, cache);
  }
  return cache;
};
// 检索 + TMDB 合并 + 该季总集数一次算完，同键的后续版本直接拿现成结果。
// 匹配不可靠（没有中文片名、单集集数远超该季总集数）时返回 null，同样入缓存，
// 免得同一集的每个版本都把失败的检索再走一遍
const resolveListEntry = async (release, imdbId) => {
  // 编号与片名都进键：单看编号，站点给出占位或错误编号时会把不同作品并成一组；
  // 单看片名，同一集各版本的发行名后缀不同也可能解析出不一样的片名。
  // 两者都对上才认同一份结果，宁可不共用也不要把别的内容挂过来
  const key = [
    imdbId ? `imdb:${imdbId}` : '',
    `name:${listResolveKeyTitle(release.name)}`,
    release.year || '',
    release.season || 0,
    release.episode || 0,
  ].join('|');
  const cache = getListResolveCache();
  if (cache.has(key)) {
    return cache.get(key);
  }
  // 存 Promise 而不是结果：同一集的多个版本由并发的工作协程同时处理，
  // 先到的那个发起请求，后来的直接挂在同一个 Promise 上等，不会重复打接口
  const pending = (async () => {
    const subject = await resolveListSubject(release, imdbId);
    // 豆瓣缺中文片名（或压根没有条目）时按字段从 TMDB 兜底：谁有中文片名就用谁的，
    // 两个数据源都没有中文片名才保持原样。BTN 这类行内没有 IMDb 编号的站，
    // 带上发行名让 TMDB 按片名 + 年份检索，豆瓣没有条目也能兜底
    const merged = await mergeListSubject(subject, imdbId, release);
    if (!merged || !isChinese(stripSeasonSuffix(merged.title))) {
      return null;
    }
    // 剧集都要取该季总集数：整季用来显示「全N集」，单集用来校验匹配是否可靠。
    // 豆瓣没有条目（整份数据来自 TMDB）时改按 TMDB 剧集编号取这一季的集数
    const episodeCount = release.season
      ? (merged.id ? await getSubjectEpisodeCount(merged.id) : await getTmdbSeasonCount(merged, release.season))
      : 0;
    // 单集条目的集数远超该季总集数，说明匹配错了条目（如动画版匹配到真人版），保持原样
    if (release.episode && episodeCount > 0 && release.episode > episodeCount * 2 + 5) {
      return null;
    }
    return { merged, episodeCount };
  })();
  cache.set(key, pending);
  return pending;
};
const addDoubanTitleToList = async (item) => {
  const release = parseReleaseTitle(item.text);
  item.links.forEach(({ link }) => {
    link.dataset.doubanListTitle = '1';
  });
  if (!release) {
    return;
  }
  // 同一集（同一部作品 + 同季同集）的多个版本共用一次检索与合并结果
  const entry = await resolveListEntry(release, item.imdbId);
  if (!entry) {
    return;
  }
  const { merged, episodeCount } = entry;
  // 片名取谁的数据就跳谁的详情页：豆瓣的中文片名跳豆瓣，TMDB 补的中文片名跳 TMDB
  const doubanId = merged.id || '';
  const titleLink = merged.titleSource === 'tmdb' && merged.tmdbUrl
    ? merged.tmdbUrl
    : DOUBAN_SUBJECT_URL.replace('{doubanId}', doubanId);
  insertListTitle(item.link, formatListTitle(merged, release, episodeCount), titleLink, doubanId, item.imdbId, release);
};
// 列表可能由脚本异步渲染（筛选、翻页、无限滚动），监听 DOM 变化补插新增的种子
const observeListTitles = () => {
  if (document.documentElement.dataset.doubanListObserver) {
    return;
  }
  document.documentElement.dataset.doubanListObserver = '1';
  let timer = null;
  new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const titles = collectListTitleLinks();
      for (const item of titles) {
        await addDoubanTitleToList(item);
      }
    }, 300);
  }).observe(document.body, { childList: true, subtree: true });
};
const addDoubanTitlesToList = async () => {
  // 列表页标记：原站自己的悬浮简介面板在本页停用，统一换成豆瓣简介面板
  document.documentElement.dataset.doubanListPage = '1';
  // 站点名标记：个别站点的行间距要按站点微调（如 BHD 原标题下方自带间距），
  // CSS 按这个属性区分，避免一套间距套到所有站点上
  document.documentElement.dataset.doubanListSite = CURRENT_SITE_INFO.siteName || '';
  // 先挂上 DOM 监听：列表可能整块异步渲染（Livewire 翻页、筛选后暂无结果），
  // 首屏扫不到种子也要能补上后面出现的行
  observeListTitles();
  const titles = collectListTitleLinks();
  if (!titles.length) {
    return;
  }
  // 控制并发，避免一次打出几十个豆瓣请求
  const workers = Array.from({ length: Math.min(LIST_SEARCH_CONCURRENCY, titles.length) }, async () => {
    while (titles.length) {
      await addDoubanTitleToList(titles.shift());
    }
  });
  await Promise.all(workers);
};
// PTP 的影片列表页有两处，结构完全相同：Top 10 Movies（top10.php，Top 10 /
// Top 100 / Top 250）与影片浏览页（torrents.php，带分页）。
// 两种页面都有 Cover、Huge、List、Compact list 四种视图，每个资源是一部影片而不是发行名。
// 四种视图统一做三件事：原标题下方补豆瓣中文片名（点击跳站点详情页，与原片名一致）、
// 评分栏补豆瓣（或 TMDB）评分、悬浮窗的片名与简介换成中文。
// 两个实现要点：
// 1. 视图由站点脚本在切换时整块重绘（innerHTML 换掉），插进去的内容会掉，
//    因此扫到新出现的资源要由 DOM 监听补上，数据走文档级缓存不再发请求
// 2. 悬浮窗是 qTip 在弹窗 show 时用站点脚本渲染的，脚本跑在沙箱里拿不到页面的
//    jQuery 与全局数据，改成渲染好的 DOM 最稳： MutationObserver 盯着 body，
//    出现 .qtip 就改里面的片名、简介与评分，其余内容原样不动
// 32×32 的评分行图标另做一份：详情页那个 64×64 票根缩到 32 字会认不出
const PTP_TOP10_DOUBAN_ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">' +
  '<g transform="translate(2.5 -2.5) rotate(13 16 16)">' +
  '<rect x="5" y="8.5" width="22" height="15" rx="2" fill="#009845"/></g>' +
  '<path fill="#007722" d="M6 10h20a2 2 0 0 1 2 2v3a1.8 1.8 0 0 0 0 3.6v3a2 2 0 0 1-2 2H6' +
  'a2 2 0 0 1-2-2v-3a1.8 1.8 0 0 0 0-3.6v-3a2 2 0 0 1 2-2z"/>' +
  '<text x="16" y="20.4" text-anchor="middle" font-family="PingFang SC,Hiragino Sans GB,' +
  'Microsoft YaHei,Noto Sans CJK SC,sans-serif" font-size="9" font-weight="700" ' +
  'fill="#ffffff">豆瓣</text>' +
  '</svg>',
)}`;
const PTP_TOP10_TMDB_ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">' +
  // 底色比文字宽出约 2px：TMDB 四个字母按 8.5px 算有 26px 宽，原来的 24px 底色
  // 左右各溢出 1px。文字收到 7.6px、去掉字距，底色放到 26px，两边都留得住
  '<rect x="3" y="6" width="26" height="20" rx="4" fill="#01b4e4"/>' +
  '<text x="16" y="18.2" text-anchor="middle" font-family="PingFang SC,Hiragino Sans GB,' +
  'Microsoft YaHei,Noto Sans CJK SC,sans-serif" font-size="7.6" font-weight="700" ' +
  'fill="#ffffff">TMDB</text>' +
  '</svg>',
)}`;
// 每部影片的中文信息按组编号存放：四种视图与悬浮窗都按 torrents.php?id= 对应同一部片
const ptpTop10Infos = new Map();
// 标题链接与悬浮窗片名链接都是 torrents.php?id={GroupId}
const getTop10GroupId = (link) => (link?.getAttribute('href')?.match(/torrents\.php\?id=(\d+)/) || [])[1] || '';
const getTop10ImdbId = (scope) => {
  const href = scope.querySelector('a[href*="imdb.com/title/"]')?.getAttribute('href') || '';
  return (href.match(/imdb\.com\/title\/(tt\d+)/) || [])[1] || '';
};
// 年份在单独的元素里：Cover 与 List 是 [2026]，Huge 是 (2026)
const getTop10Year = (text) => (String(text || '').match(/((?:19|20)\d{2})/) || [])[1] || '';
const hasChineseText = (text) => !!text && text !== '暂无相关剧情介绍' && isChinese(text);
// 评分二选一：豆瓣优先，豆瓣没有评分（含豆瓣没有条目）时用 TMDB 的，两个都没有就不加。
// 评分取谁的数据就跳谁的详情页。doubanId 由调用方从检索结果带进来：条目详情接口
// 返回的对象不带编号，直接读会拿不到豆瓣链接
const getTop10Rating = (info, doubanId) => {
  const score = parseFloat(info.rating) || 0;
  if (!score) {
    return null;
  }
  // 站点自己的评分都带一位小数（IMDb 6.0、MC 38），豆瓣与 TMDB 的原始值
  // 有的是整数，统一成一位小数与站点格式一致
  const value = score.toFixed(1);
  if (info.ratingSource === 'tmdb') {
    return info.tmdbUrl ? { label: 'TMDB', value, link: info.tmdbUrl } : null;
  }
  return doubanId
    ? { label: '豆瓣', value, link: DOUBAN_SUBJECT_URL.replace('{doubanId}', doubanId) }
    : null;
};
// 中文片名挂在原标题下方：块级、左对齐，字体样式逐个拷贝原标题的计算样式，
// 与列表页的片名同一套做法；链接指向站点详情页，与原片名跳同一处
const insertTop10Title = (titleLink, text, parent, ref) => {
  parent.querySelectorAll(':scope > .douban-top10-title').forEach(node => node.remove());
  const anchor = document.createElement('a');
  anchor.href = titleLink.getAttribute('href') || '#';
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  anchor.title = text;
  anchor.textContent = text;
  const titleStyle = getComputedStyle(titleLink);
  ['fontSize', 'color', 'fontWeight', 'fontFamily', 'fontStyle', 'lineHeight', 'letterSpacing', 'textTransform', 'textDecoration'].forEach(property => {
    anchor.style[property] = titleStyle[property];
  });
  const wrapper = document.createElement('div');
  wrapper.className = 'douban-top10-title';
  wrapper.style.setProperty('display', 'block', 'important');
  // 对齐方式跟着站点走，不自己指定：Cover 视图的标题行是居中的（原标题与海报
  // 都按卡片中线排），Huge 与两个列表视图是左对齐。继承容器原生的对齐，
  // 中文片名才与原标题、海报的中线对得上
  // 原标题行常禁止换行，长片名一行放不下会溢出，中文片名允许折行
  wrapper.style.setProperty('white-space', 'normal', 'important');
  wrapper.appendChild(anchor);
  parent.insertBefore(wrapper, ref || null);
};
// Cover 视图的评分是一个个裸链接（IMDb 那条也只有数字），豆瓣评分照样做成链接跟在右边；
// 原站的 IMDb 评分没有来源名，按站点外的惯例补上 IMDB 前缀
const addTop10CoverRating = (movie, rating) => {
  const host = movie.node.querySelector('.cover-movie-list__movie__rating-and-tags');
  if (!host) {
    return;
  }
  const imdbLink = host.querySelector('a.cover-movie-list__movie__rating');
  if (imdbLink && !imdbLink.dataset.doubanTop10ImdbLabel) {
    imdbLink.dataset.doubanTop10ImdbLabel = '1';
    imdbLink.textContent = `IMDB${imdbLink.textContent}`;
  }
  if (!rating) {
    return;
  }
  // 同一部影片可能被处理多遍（批次重入、站点重绘后补扫），
  // 先摘掉上一轮的豆瓣评分再插，避免评分链接重复出现
  host.querySelectorAll('a.douban-top10-rating').forEach(node => node.remove());
  const anchor = document.createElement('a');
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  anchor.className = 'cover-movie-list__movie__rating douban-top10-rating';
  anchor.href = rating.link;
  anchor.textContent = `${rating.label}${rating.value}`;
  if (imdbLink) {
    imdbLink.after(anchor);
  } else {
    host.prepend(anchor);
  }
};
// List 与 Compact 视图的评分是一排「IMDb: 6.0」容器，豆瓣评分照样做一个容器跟在 IMDb 右边
const addTop10ListRating = (movie, rating) => {
  const host = movie.node.querySelector('.basic-movie-list__movie__ratings-and-tags');
  if (!host || !rating) {
    return;
  }
  host.querySelectorAll('.douban-top10-rating').forEach(node => node.remove());
  const box = document.createElement('div');
  box.className = 'basic-movie-list__movie__rating-container douban-top10-rating';
  const title = document.createElement('span');
  title.className = 'basic-movie-list__movie__rating__title';
  const link = document.createElement('a');
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.href = rating.link;
  link.textContent = rating.label;
  title.appendChild(link);
  title.appendChild(document.createTextNode(': '));
  const value = document.createElement('span');
  value.className = 'basic-movie-list__movie__rating__rating';
  value.textContent = String(rating.value);
  box.appendChild(title);
  box.appendChild(value);
  const boxes = Array.from(host.querySelectorAll('.basic-movie-list__movie__rating-container'));
  const imdbBox = boxes.find(item => item.querySelector('a[href*="imdb.com/title/"]'));
  if (imdbBox) {
    imdbBox.after(box);
  } else {
    host.prepend(box);
  }
};
// Huge 视图的评分是图标 + 数值 + 票数的一列，整行克隆 IMDb 行再换内容，
// 结构、类名、尺寸与站点原生的 IMDb、MC 行完全一致
const addTop10HugeRating = (movie, rating, votes) => {
  const table = movie.node.querySelector('.huge-movie-list__movie__ratings');
  if (!table || !rating) {
    return;
  }
  table.querySelectorAll('tr.douban-top10-rating').forEach(node => node.remove());
  const imdbRow = Array.from(table.querySelectorAll('tr'))
    .find(row => row.querySelector('a[href*="imdb.com/title/"]'));
  let row;
  if (imdbRow) {
    row = imdbRow.cloneNode(true);
    row.classList.add('douban-top10-rating');
  } else {
    row = document.createElement('tr');
    // 标记类与克隆分支一致：重复渲染时先按这个类摘掉旧行，
    // 漏打会在一部影片下叠加出多条评分行
    row.classList.add('douban-top10-rating');
    row.innerHTML = '<td colspan="1" class="nobr huge-movie-list__movie__ratings__icon-column" width="1%">' +
      '<center><a class="rating"><img style="height: 32px; width: 32px;"></a></center></td>' +
      '<td class="nobr huge-movie-list__movie__ratings__votes-column" width="99%">' +
      '<span class="rating"></span> <span class="mid">/</span> <span class="outof"> 10</span></td>';
  }
  const link = row.querySelector('a');
  if (!link) {
    return;
  }
  link.href = rating.link;
  link.target = '_blank';
  link.rel = 'noreferrer';
  const img = row.querySelector('img');
  if (img) {
    img.src = rating.label === 'TMDB' ? PTP_TOP10_TMDB_ICON : PTP_TOP10_DOUBAN_ICON;
    img.title = rating.label === 'TMDB' ? 'TMDB' : 'Douban';
    img.style.height = '32px';
    img.style.width = '32px';
  }
  const votesCell = row.querySelector('td.huge-movie-list__movie__ratings__votes-column');
  const valueNode = votesCell?.querySelector('span.rating');
  if (valueNode) {
    valueNode.textContent = String(rating.value);
  }
  // 票数在 <br> 后的文本节点里；没有票数时整行票数去掉，与站点 MC 行一致
  const br = votesCell?.querySelector('br');
  if (br) {
    if (votes) {
      br.nextSibling.textContent = `(${votes.toLocaleString('en-US')} votes)`;
    } else {
      br.nextSibling.textContent = '';
      br.remove();
    }
  }
  if (imdbRow) {
    imdbRow.after(row);
  } else {
    table.prepend(row);
  }
};
// 悬浮窗改的是站点渲染好的 DOM：片名与简介换成中文，IMDb 评分旁补豆瓣/TMDB 评分，
// 其余内容（导演、标签、预告片、清晰度、收藏与评分操作）原样不动
const applyTop10Tooltip = (titleLink) => {
  if (titleLink.classList.contains('douban-top10-tooltip-title')) {
    return;
  }
  const info = ptpTop10Infos.get(getTop10GroupId(titleLink));
  if (!info) {
    return;
  }
  titleLink.classList.add('douban-top10-tooltip-title');
  if (isChinese(info.title)) {
    titleLink.textContent = info.title;
  }
  const tooltip = titleLink.closest('.qtip');
  const synopsis = tooltip?.querySelector('.movie-tooltip__synopsis');
  if (synopsis && info.summary) {
    synopsis.textContent = info.summary;
  }
  if (!info.rating) {
    return;
  }
  const ratings = tooltip?.querySelector('.movie-tooltip__ratings');
  if (!ratings) {
    return;
  }
  const box = document.createElement('div');
  box.className = 'movie-tooltip__rating-container douban-top10-rating';
  const title = document.createElement('span');
  title.className = 'movie-tooltip__rating__title';
  const link = document.createElement('a');
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.href = info.rating.link;
  link.textContent = info.rating.label;
  title.appendChild(link);
  title.appendChild(document.createTextNode(': '));
  const value = document.createElement('span');
  value.className = 'movie-tooltip__rating__rating';
  value.textContent = String(info.rating.value);
  box.appendChild(title);
  box.appendChild(value);
  const imdbBox = ratings.querySelector('.movie-tooltip__rating-container');
  if (imdbBox) {
    imdbBox.after(box);
  } else {
    ratings.prepend(box);
  }
};
// 数据是异步到齐的，悬浮窗可能已经开着：到齐后把已渲染出来的悬浮窗再刷一次
const refreshTop10Tooltips = () => {
  document.querySelectorAll('.qtip .movie-tooltip__title').forEach(applyTop10Tooltip);
};
const observeTop10Tooltips = () => {
  new MutationObserver(refreshTop10Tooltips).observe(document.body, { childList: true, subtree: true });
};
// 四种视图各扫一遍。站点整块重绘后新节点没有标记，会被再扫一次，数据走缓存不再请求
const collectTop10Movies = () => {
  const movies = [];
  document.querySelectorAll('.cover-movie-list__movie').forEach(node => {
    const titleLink = node.querySelector('.cover-movie-list__movie__title');
    const groupId = getTop10GroupId(titleLink);
    if (node.dataset.doubanTop10 || !titleLink || !groupId) {
      return;
    }
    movies.push({
      node,
      view: 'cover',
      titleLink,
      groupId,
      title: (titleLink.textContent || '').trim(),
      year: getTop10Year(node.querySelector('.cover-movie-list__movie__year')?.textContent),
      imdbId: getTop10ImdbId(node),
      titleParent: titleLink.parentNode,
      titleRef: null,
    });
  });
  document.querySelectorAll('.huge-movie-list__movie').forEach(node => {
    const titleLink = node.querySelector('.huge-movie-list__movie__title');
    const groupId = getTop10GroupId(titleLink);
    if (node.dataset.doubanTop10 || !titleLink || !groupId) {
      return;
    }
    movies.push({
      node,
      view: 'huge',
      titleLink,
      groupId,
      title: (titleLink.textContent || '').trim(),
      year: getTop10Year(node.querySelector('.huge-movie-list__movie__year')?.textContent),
      imdbId: getTop10ImdbId(node),
      titleParent: node.querySelector('.huge-movie-list__movie__details'),
      titleRef: node.querySelector('.huge-movie-list__movie__tag-list'),
    });
  });
  // 两个列表页的行类名不一样：top10.php 是 basic-movie-list__details-row 再加一个
  // js- 前缀的类，torrents.php 只有前者。用前者能同时覆盖两个页面
  document.querySelectorAll('.basic-movie-list__details-row').forEach(node => {
    const titleLink = node.querySelector('.basic-movie-list__movie__title');
    const groupId = getTop10GroupId(titleLink);
    if (node.dataset.doubanTop10 || !titleLink || !groupId) {
      return;
    }
    movies.push({
      node,
      view: 'list',
      titleLink,
      groupId,
      title: (titleLink.textContent || '').trim(),
      year: getTop10Year(node.querySelector('.basic-movie-list__movie__year')?.textContent),
      imdbId: getTop10ImdbId(node),
      titleParent: titleLink.closest('td'),
      titleRef: node.querySelector('.basic-movie-list__movie__ratings-and-tags'),
    });
  });
  return movies;
};
// 同一份数据在各个视图、各个榜单分类里的渲染：片名、评分、简介各自插入，
// 插入都是幂等的（先摘掉上一轮的再插），站点重绘后补扫直接复用
const renderTop10Movie = (movie, data) => {
  insertTop10Title(movie.titleLink, data.titleText, movie.titleParent, movie.titleRef);
  if (movie.view === 'cover') {
    addTop10CoverRating(movie, data.rating);
  } else if (movie.view === 'huge') {
    addTop10HugeRating(movie, data.rating, data.votes);
    // 简介就地替换为中文，字号颜色沿用站点自己的样式
    const synopsis = movie.node.querySelector('.huge-movie-list__movie__synopsis');
    if (synopsis && data.summary) {
      synopsis.textContent = data.summary;
    }
  } else {
    addTop10ListRating(movie, data.rating);
  }
  refreshTop10Tooltips();
};
// 同一部影片在一页里会出现多次（多个榜单分类），站点重绘后也会再扫到。
// 按组编号存正在处理的任务：并发的工作协程同时拿到同一部影片时挂在同一个
// Promise 上等，条目详情与 TMDB 兜底都只走一次，不会重复打接口
const ptpTop10Pending = new Map();
const addToPtpTop10Movie = async (movie) => {
  movie.node.dataset.doubanTop10 = '1';
  if (ptpTop10Infos.has(movie.groupId)) {
    const cached = ptpTop10Infos.get(movie.groupId);
    if (cached) {
      renderTop10Movie(movie, cached);
    }
    return;
  }
  let pending = ptpTop10Pending.get(movie.groupId);
  if (!pending) {
    pending = (async () => {
      try {
        const parsed = parseReleaseTitle(movie.title) || {};
        // 年份取站点显示的，解析发行名时可能把片名里的数字（2049）当年份，站点有就不用它
        const release = { ...parsed, year: movie.year || parsed.year || '' };
        // 与列表页同一套匹配：片名（含 AKA）检索 + IMDb 反查 + TMDB 兜底，
        // 匹配不到豆瓣条目、或没有中文片名时整个资源保持原样
        const entry = await resolveListEntry(release, movie.imdbId);
        if (!entry) {
          return null;
        }
        const { merged } = entry;
        // 评分与简介在条目详情里，检索结果没有：走详情闸门，不被整页检索排队堵住。
        // 豆瓣没有条目时 merged 整份是 TMDB 数据，直接用它
        const detail = merged.id ? await getSubjectDetail(merged.id, movie.imdbId, true, release) : null;
        const info = detail || merged;
        const data = {
          title: merged.title,
          summary: hasChineseText(info.summary) ? info.summary : '',
          rating: getTop10Rating(info, merged.id),
          votes: parseInt(info.votes, 10) || 0,
          titleText: formatListTitle(merged, release, 0),
        };
        ptpTop10Infos.set(movie.groupId, data);
        return data;
      } catch (error) {
        // 一部影片的意外不能把整批 Worker 带崩：其余影片继续处理
        console.log(error);
        return null;
      }
    })();
    ptpTop10Pending.set(movie.groupId, pending);
  }
  const data = await pending;
  if (data) {
    renderTop10Movie(movie, data);
  }
};
// 与列表页一致的控制并发：一页最多 250 部影片，逐个排队请求，避开豆瓣限流。
// 批次不重入：首屏批次要一部部过闸门，我们自己的插入又会触发 observer 补扫，
// 重入会让同一部影片并行处理多遍——评分行插两遍、条目详情多打几次接口。
// 补扫在批次结束后自动再跑一轮，批次期间新出现的资源（切换视图整块重绘）不会漏
let top10BatchRunning = false;
const processTop10Movies = async () => {
  if (top10BatchRunning) {
    return;
  }
  top10BatchRunning = true;
  try {
    let movies = collectTop10Movies();
    while (movies.length) {
      const workers = Array.from({ length: Math.min(LIST_SEARCH_CONCURRENCY, movies.length) }, async () => {
        while (movies.length) {
          await addToPtpTop10Movie(movies.shift());
        }
      });
      await Promise.all(workers);
      movies = collectTop10Movies();
    }
  } finally {
    top10BatchRunning = false;
  }
};
const observeTop10Movies = () => {
  let timer = null;
  new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(processTop10Movies, 300);
  }).observe(document.body, { childList: true, subtree: true });
};
const addDoubanTitlesToPtpTop10 = async () => {
  observeTop10Movies();
  observeTop10Tooltips();
  await processTop10Movies();
};
// 已做就地融合的站点只替换站内原生内容，不生成豆瓣卡片；
// 其余站点保持原有的豆瓣信息卡片
// link 由调用方给出：豆瓣有条目时是豆瓣详情页，只有 TMDB 兜底到时是 TMDB 条目页
const renderDoubanInfo = async (doubanInfo, doubanId, imdbId, link, titleLink) => {
  const nativeReplaceFields = [
    'addTitleAfter', 'addTitleBefore', 'addTitleInside', 'addTitleLineAfter',
    'addSummaryTab', 'replaceOverview', 'replaceOverviewLabel',
  ];
  if (nativeReplaceFields.some(field => CURRENT_SITE_INFO[field])) {
    const doubanData = doubanInfo || await getDoubanInfo(doubanId, imdbId);
    if (doubanData) {
      replaceNativeInfo(
        doubanData,
        link || `https://movie.douban.com/subject/${doubanId}`,
        titleLink,
      );
    }
  } else {
    await createDoubanDom(doubanId, imdbId, doubanInfo, link);
  }
};
function fetch (url, options = {}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'json',
      ...options,
      onload: (res) => {
        const { statusText, status, response } = res;
        if (status !== 200) {
          // 状态码挂到错误上：调用方要区分「确定没有条目（404）」与网络抖动，
          // 前者重试没有意义
          reject(Object.assign(new Error(statusText || status), { status }));
        } else {
          resolve(response);
        }
      },
      ontimeout: () => {
        reject(new Error('timeout'));
      },
      onerror: (error) => {
        reject(error);
      },
    });
  });
}
// TMDB 模块复用同一条通道：GM_xmlhttpRequest 不受页面 CSP 与跨域限制，与豆瓣保持一致；
// 图片 CDN（image.tmdb.org）免鉴权，海报仍然走 <img> 直连，不占用这条通道
const gmFetch = fetch;
export {
  gmFetch,
  isChinese,
  normalizeTitle,
  createRequestGate,
  getImdbId,
  getDoubanInfo,
  createDoubanDom,
  addToPtpPage,
  addToANTPage,
  getDoubanId,
  getTvSeasonData,
  getDoubanIdByIMDB,
  getDoubanInfoByIMDB,
  getDoubanInfoBySubject,
  getDoubanInfoFallback,
  renderDoubanInfo,
  addDarkLinkButton,
  addDoubanTitlesToList,
  addDoubanTitlesToPtpTop10,
  setListTmdb,
};
