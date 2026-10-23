import {
  CURRENT_SITE_INFO,
  DOUBAN_API_URL, DOUBAN_SEARCH_API, CURRENT_SITE_NAME, DOUBAN_SUGGEST_API,
  DOUBAN_SUGGEST_API_URL, DOUBAN_SUBJECT_URL,
} from './const';
import $ from 'jquery';

const isChinese = (title) => {
  return /[\u4e00-\u9fa5]+/.test(title);
};
const addToPtpPage = (data) => {
  console.log(data);
  $('.page__title').prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
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
    $('#movie-ratings-table tr').prepend(
    `<td colspan="1" style="width: 152px;">
    <center>
    <a target="_blank" class="rating" href="${data.link}" rel="noreferrer">
    <div style="font-size: 0;min-width: 105px;">
        <span class="icon-pt1">豆</span>
        <span class="icon-pt2">豆瓣评分</span>
    </div>
    </a>
    </center>
    </td>
    <td style="width: 153px;">
    <span class="rating">${data.average}</span>
    <span class="mid">/</span>
    <span class="outof"> 10</span>
    <br>(${data.votes} votes)</td>`);
  }
  $('.main-column').prepend($('#movie-ratings-table').parent());
};
const addToANTPage = (data) => {
  console.log(data);
  $('.header h2').prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
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
const getDoubanInfoByIMDB = async (imdbId) => {
  try {
    const doubanData = await fetchDoubanApi(`/imdb/${imdbId}`);
    const { title = '', attrs = {}, image = '', summary = '', rating = {}, alt_title: altTitle, mobile_link: mobileLink } = doubanData;
    if (!mobileLink) {
      throw new Error('豆瓣API未返回条目');
    }
    let chineseTitle = title;
    const isChineseReg = /[\u4e00-\u9fa5]+/;
    if (!isChineseReg.test(title) && !title.match(/^\d+$/)) {
      if (altTitle) {
        chineseTitle = altTitle.split('/')[0].trim();
      } else {
        chineseTitle = title;
      }
    }
    const subjectLink = mobileLink.replace('m.douban.com/movie', 'movie.douban.com').replace(/\/$/, '');
    const doubanId = subjectLink.match(/subject\/(\d+)/)?.[1] ?? '';
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
const createDoubanDom = async (doubanId, imdbId, doubanInfo) => {
  const div = document.createElement('div');
  let { doubanContainerDom, insertDomSelector, siteName, poster } = CURRENT_SITE_INFO;
  if (siteName.match(/(HDT)$/)) {
    insertDomSelector = $(insertDomSelector).parent();
  }
  $(insertDomSelector).before(doubanContainerDom);
  const doubanLink = `https://movie.douban.com/subject/${doubanId}`;

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
  const posterImg = $(poster).attr('src') ? $(poster).attr('src') : doubanData?.poster;
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
  const titleHtml = addTitleLineHtml
    .replace(/\{link\}/g, doubanLink)
    .replace(/\{title\}/g, chineseTitle)
    .replace(/\{nativeTitle\}/g, year ? `${nativeTitle} (${year})` : nativeTitle)
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
const replaceNativeInfo = (doubanData, doubanLink) => {
  const {
    addTitleAfter, addTitleBefore, addTitleInside, addTitleHtml, addTitleYearFrom,
    replaceOverview, replaceOverviewLabel,
    replaceRating, replaceRatingHtml, replaceRatingPosition, renameRatingLabel,
    starFullHtml, starEmptyHtml,
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

  // 中文片名：挂在站内原片名旁边，点击跳转豆瓣
  if (addTitleHtml && chineseTitle) {
    // 年份从配置的元素里提取（如站点信息表的 Released 行），取不到时 {year} 替换为空，
    // 便于拼出「追风筝的人 (2007)」这类片名
    const yearSource = addTitleYearFrom ? $(addTitleYearFrom).first().text() : '';
    const yearMatched = yearSource.match(/\b(?:19|20)\d{2}\b/);
    const titleHtml = addTitleHtml
      .replace(/\{link\}/g, doubanLink)
      .replace(/\{title\}/g, chineseTitle)
      .replace(/\{year\}/g, yearMatched ? ` (${yearMatched[0]})` : '');
    if (addTitleInside) {
      const host = $(addTitleInside).first()[0];
      if (host) {
        const link = $(titleHtml)[0];
        const lastText = host.lastChild;
        // 行尾的 (年份) 挪到中文片名之后，如 Wings of Dread (2026) → Wings of Dread 追风筝的人 (2026)
        const yearMatched = lastText && lastText.nodeType === 3 &&
          lastText.textContent.match(/^([\s\S]*?)(\s*\(\d{4}\)\s*)$/);
        if (yearMatched) {
          lastText.textContent = `${yearMatched[1].replace(/\s+$/, '')} `;
          host.appendChild(link);
          host.appendChild(document.createTextNode(` ${yearMatched[2].trim()}`));
        } else {
          if (lastText && lastText.nodeType === 3 && !/\s$/.test(lastText.textContent)) {
            host.appendChild(document.createTextNode(' '));
          }
          host.appendChild(link);
        }
        replaced = true;
      }
    } else {
      const $titleAnchor = $(addTitleAfter || addTitleBefore).first();
      if ($titleAnchor.length) {
        if (addTitleAfter) {
          $titleAnchor.after(titleHtml);
        } else {
          $titleAnchor.before(titleHtml);
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
    const $rating = $(replaceRating).first();
    if ($rating.length) {
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
      // 星级条宽度：豆瓣分按 /10 换算成百分比，供站点自身的星级样式使用
      const scorePercent = /^\d+(?:\.\d+)?$/.test(String(score))
        ? `${Math.round(parseFloat(score) * 10)}%`
        : '0%';
      let ratingHtml = replaceRatingHtml
        .replace(/\{link\}/g, doubanLink)
        .replace(/\{score\}/g, score)
        .replace(/\{scorePercent\}/g, scorePercent)
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
      if (replaceRatingPosition === 'before') {
        $rating.before(ratingHtml);
      } else {
        $rating.after(ratingHtml);
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
// 已做就地融合的站点只替换站内原生内容，不生成豆瓣卡片；
// 其余站点保持原有的豆瓣信息卡片
const renderDoubanInfo = async (doubanInfo, doubanId, imdbId) => {
  const nativeReplaceFields = [
    'addTitleAfter', 'addTitleBefore', 'addTitleInside', 'addTitleLineAfter',
    'addSummaryTab', 'replaceOverview', 'replaceOverviewLabel',
  ];
  if (nativeReplaceFields.some(field => CURRENT_SITE_INFO[field])) {
    const doubanData = doubanInfo || await getDoubanInfo(doubanId, imdbId);
    if (doubanData) {
      replaceNativeInfo(doubanData, `https://movie.douban.com/subject/${doubanId}`);
    }
  } else {
    await createDoubanDom(doubanId, imdbId, doubanInfo);
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
          reject(new Error(statusText || status));
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
export {
  isChinese,
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
};
