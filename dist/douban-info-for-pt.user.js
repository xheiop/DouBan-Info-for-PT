// ==UserScript==
// @name            douban-info-for-pt
// @name:en         douban-info-for-pt
// @namespace       https://github.com/techmovie/DouBan-Info-for-PT
// @version         1.9.0
// @author          birdplane
// @description     在PT站电影详情页展示部分中文信息
// @description:en  Display some Chinese information on the PT site movie details page
// @license         MIT
// @source          git@github.com:techmovie/DouBan-Info-for-PT.git
// @downloadURL     https://github.com/techmovie/DouBan-Info-for-PT/raw/main/dist/douban-info-for-pt.user.js
// @updateURL       https://github.com/techmovie/DouBan-Info-for-PT/raw/main/dist/douban-info-for-pt.user.js
// @match           *://passthepopcorn.me/torrents.php*
// @match           *://passthepopcorn.me/torrents.php?id=*
// @match           *://passthepopcorn.me/requests.php?action=view&id=*
// @match           *://passthepopcorn.me/top10.php*
// @match           *://anthelion.me/torrents.php?id=*
// @match           *://anthelion.me/requests.php?action=view&id=*
// @match           *://beyond-hd.me/torrents
// @match           *://beyond-hd.me/torrents?*
// @match           *://beyond-hd.me/torrents/*
// @match           *://beyond-hd.me/library/title/*
// @match           *://alpharatio.cc/torrents.php*
// @match           *://blutopia.cc/torrents
// @match           *://blutopia.cc/torrents?*
// @match           *://blutopia.cc/torrents/*
// @match           *://eiga.moi/torrents/*
// @match           *://eiga.moi/torrents
// @match           *://eiga.moi/torrents?*
// @match           *://hdbits.org/browse.php*
// @match           *://hdbits.org/details.php?id=*
// @match           *://hdbits.org/requests/show_request?id=*
// @match           *://broadcasthe.net/torrents.php*
// @match           *://filelist.io/browse.php*
// @match           *://filelist.io/details.php?id=*
// @match           *://hd-torrents.org/torrents.php*
// @match           *://hd-torrents.org/details.php?id=*
// @match           *://hdf.world/torrents.php*
// @match           *://hd-space.org/index.php?page=torrents*
// @match           *://hd-space.org/index.php?page=torrent-details*
// @match           *://karagarga.in/details.php?id=*
// @match           *://privatehd.to/torrent/*
// @match           *://broadcasthe.net/series.php?id=*
// @match           *://iptorrents.com/torrent.php?id=*
// @match           *://www.iptorrents.com/torrent.php?id=*
// @match           *://iptorrents.com/t
// @match           *://iptorrents.com/t?*
// @match           *://www.iptorrents.com/t
// @match           *://www.iptorrents.com/t?*
// @match           *://www.torrentleech.org/torrent/*
// @match           *://avistaz.to/torrent/*
// @match           *://secret-cinema.pw/torrents.php?id=*
// @match           *://aither.cc/torrents/*
// @match           *://shadowthein.net/browse.php*
// @match           *://shadowthein.net/details.php?id=*
// @match           *://tgx.rs/torrent/*
// @require         https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @connect         movie.douban.com
// @connect         www.douban.com
// @connect         api.douban.com
// @connect         *.doubanio.com
// @connect         api.themoviedb.org
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_openInTab
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// ==/UserScript==

(g=>{if(typeof GM_addStyle=="function"){GM_addStyle(g);return}const t=document.createElement("style");t.textContent=g,document.head.append(t)})(' .col-container .fix-col,.ll{float:left}#douban-wrapper #content{background-image:url(data:image/png;base64,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);background-repeat:no-repeat;height:325px;min-height:auto;padding:10px;width:750px}#douban-wrapper #content h1{font-size:20px}#douban-wrapper #content .grid{border-radius:9px;height:325px;width:750px}#douban-wrapper #content .grid .grid-col1{width:225px}#douban-wrapper #content .grid .grid-col2{height:277px;overflow:hidden;padding:24px 18px;width:254px}#douban-wrapper #content .grid .grid-col3{height:100%;width:18px}#douban-wrapper #content .grid .grid-col4{font-size:14px;padding:27px 14px 0 12px;width:190px}#douban-wrapper #content .picture-douban-wrapper{background-position:50%;background-size:cover;border-bottom-left-radius:9px;border-top-left-radius:9px;height:325px;width:225px}#douban-wrapper #content .main-title h1,#douban-wrapper #content .sub-title h2{display:-webkit-box;-webkit-line-clamp:2;line-height:1.2;max-height:2.5em;overflow:hidden;word-break:break-all;-webkit-box-orient:vertical}#douban-wrapper #content .main-title h1{color:#000;font-size:30px;font-weight:500}#douban-wrapper #content .sub-title{margin-top:9px}#douban-wrapper #content .sub-title h2{color:#adadad;font-size:18px;font-weight:400}#douban-wrapper #content .baseinfo{color:#000;display:-webkit-box;font-size:16px;font-weight:400;letter-spacing:1px;-webkit-line-clamp:5;line-height:25px;margin-top:18px;overflow:hidden;word-break:break-all;-webkit-box-orient:vertical}#douban-wrapper #content .line-wrap{background-image:url(data:image/png;base64,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);background-size:contain;height:100%;position:relative;width:18px}#douban-wrapper #content .douban-icon{font-size:0}#douban-wrapper #content .douban-icon>span{border:1px solid #41be57;display:inline-block;font-size:14px;text-align:center}#douban-wrapper #content .douban-icon .icon-pt1{background-color:#41be57;border-bottom-left-radius:4px;border-top-left-radius:4px;color:#fff;height:24px;line-height:24px;width:24px}#douban-wrapper #content .douban-icon .icon-pt2{background:#fff;border-bottom-right-radius:4px;border-top-right-radius:4px;color:#3ba94d;height:24px;line-height:24px;width:69px}#douban-wrapper #content .score-container .rating_self{clear:none;margin-top:15px;overflow:hidden}#douban-wrapper #content .score-container .rating_self .rating_num{color:#000;font-size:48px;font-weight:400;line-height:1;padding:0}#douban-wrapper #content .score-container .rating_self .rating_right{float:left;padding-left:10px;padding-top:5px}#douban-wrapper #content .score-container .rating_self .rating_right .ll{float:none}#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum{color:#3b3b3b}#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people,#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people:hover,#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people:link,#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people:visited{background:none;color:#3b3b3b}#douban-wrapper #content .score-container .ratings-on-weight{margin-top:10px;min-height:1px}#douban-wrapper #content .score-container .ratings-on-weight .item{line-height:1.5}#douban-wrapper #content .score-container .ratings-on-weight .item .starstop{color:#3b3b3b;float:none;margin-right:0}#douban-wrapper #content .score-container .ratings-on-weight .item>div,#douban-wrapper #content .score-container .ratings-on-weight .item>span{display:inline-block}#douban-wrapper #content .score-container .ratings-on-weight .item .power{background:#faa032;border-radius:3px;height:6px;vertical-align:middle}#douban-wrapper #content .bottom-row{align-items:center;display:flex;justify-content:space-between}#douban-wrapper #content .bottom-row .rating-betterthan{color:#1c1c1c;font-size:14px;line-height:21px;width:117px}#douban-wrapper #content .bottom-row .rating-betterthan .number{color:#41be57;font-size:14px}#douban-wrapper #content .bottom-row .qr-code{height:64px;overflow:hidden;width:64px}#douban-wrapper #content .bottom-row .qr-code img{height:100%;width:100%}.contentlayout.douban-info{display:flex;justify-content:space-around}.contentlayout.douban-info .detail{flex:1}.detail .title{font-size:26px;font-weight:600;margin-bottom:20px}.detail .title a{text-decoration:none}.movie-detail{display:flex;justify-content:space-between}.movie-detail .synopsis{width:60%}.movie-detail .movieinfo{margin-right:20px;max-width:30%}.icon-pt1{font-size:14px;display:inline-block;text-align:center;border:1px solid #41be57;background-color:#41be57;color:#fff;border-top-left-radius:4px;border-bottom-left-radius:4px;width:24px;height:24px;line-height:24px}.ant .icon-pt1{border-radius:4px}.icon-pt2{display:inline-block;text-align:center;border:1px solid #41be57;color:#3ba94d;background:#fff;border-top-right-radius:4px;border-bottom-right-radius:4px;width:69px;height:24px;line-height:24px;font-size:14px}.douban-dom{display:flex;cursor:pointer}.douban-dom{text-align:left}#douban-wrapper *{box-sizing:content-box}#douban-wrapper .clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}#douban-wrapper .clearfix{zoom:1;display:inline-block;_height:1px}#douban-wrapper .clearfix{height:1%}#douban-wrapper .clearfix{display:block}#douban-wrapper .rating_per{color:#111}#douban-wrapper .grid{overflow:initial}.content-rounded #douban-wrapper div{margin-left:0}#douban-wrapper #content .douban-icon .icon-pt1{background-image:none}#douban-wrapper h2,#douban-wrapper h1{border:none;background-image:none;background-color:transparent;text-shadow:none;padding:0;margin:0;line-height:normal}#douban-wrapper .grid-col5{font-size:14px;padding:27px 14px 0 12px;width:190px;overflow-y:auto;height:277px;width:calc(100% - 795px)}.bigstar50:after{width:100%}.bigstar45:after{width:90%}.bigstar40:after{width:80%}.bigstar35:after{width:70%}.bigstar30:after{width:60%}.bigstar25:after{width:50%}.bigstar20:after{width:40%}.bigstar15:after{width:30%}.bigstar10:after{width:20%}.bigstar05:after{width:10%}.bigstar00:after{width:0}.bigstar00,.bigstar05,.bigstar10,.bigstar15,.bigstar20,.bigstar25,.bigstar30,.bigstar35,.bigstar40,.bigstar45,.bigstar50{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdGggZmlsbC1vcGFjaXR5PSIuMTIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0ibTUuNDg2LjU0IDEuMDAzIDIuNTY0YS4zMS4zMSAwIDAgMCAuMjcyLjE5OGwyLjc0OC4xNjJhLjUyMS41MjEgMCAwIDEgLjMuOTI0TDcuNjgxIDYuMTMzYS4zMS4zMSAwIDAgMC0uMTA0LjMyMWwuNjk1IDIuNjY0YS41MjEuNTIxIDAgMCAxLS43ODUuNTdMNS4xNjkgOC4yMDVhLjMxLjMxIDAgMCAwLS4zMzggMEwyLjUxMyA5LjY5YS41MjEuNTIxIDAgMCAxLS43ODUtLjU3bC42OTUtMi42NjVhLjMxLjMxIDAgMCAwLS4xMDQtLjMyTC4xOSA0LjM4N2EuNTIxLjUyMSAwIDAgMSAuMy0uOTI0bDIuNzQ4LS4xNjJhLjMxLjMxIDAgMCAwIC4yNzItLjE5OEw0LjUxNC41NGEuNTIxLjUyMSAwIDAgMSAuOTcyIDAiLz48L3N2Zz4=);background-repeat:repeat-x;background-size:auto 100%;height:15px;margin:1px 0 5px;overflow:hidden;position:relative;width:75px}.bigstar00:after,.bigstar05:after,.bigstar10:after,.bigstar15:after,.bigstar20:after,.bigstar25:after,.bigstar30:after,.bigstar35:after,.bigstar40:after,.bigstar45:after,.bigstar50:after{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdGggZmlsbD0iI2Y5MCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJtNS40ODYuNTQgMS4wMDMgMi41NjRhLjMxLjMxIDAgMCAwIC4yNzIuMTk4bDIuNzQ4LjE2MmEuNTIxLjUyMSAwIDAgMSAuMy45MjRMNy42ODEgNi4xMzNhLjMxLjMxIDAgMCAwLS4xMDQuMzIxbC42OTUgMi42NjRhLjUyMS41MjEgMCAwIDEtLjc4NS41N0w1LjE2OSA4LjIwNWEuMzEuMzEgMCAwIDAtLjMzOCAwTDIuNTEzIDkuNjlhLjUyMS41MjEgMCAwIDEtLjc4NS0uNTdsLjY5NS0yLjY2NWEuMzEuMzEgMCAwIDAtLjEwNC0uMzJMLjE5IDQuMzg3YS41MjEuNTIxIDAgMCAxIC4zLS45MjRsMi43NDgtLjE2MmEuMzEuMzEgMCAwIDAgLjI3Mi0uMTk4TDQuNTE0LjU0YS41MjEuNTIxIDAgMCAxIC45NzIgMCIvPjwvc3ZnPg==);background-repeat:repeat-x;background-size:auto 100%;content:"";height:100%;left:0;position:absolute;top:0}.bigstar00+span.rating_num,.bigstar05+span.rating_num,.bigstar10+span.rating_num,.bigstar15+span.rating_num,.bigstar20+span.rating_num,.bigstar25+span.rating_num,.bigstar30+span.rating_num,.bigstar35+span.rating_num,.bigstar40+span.rating_num,.bigstar45+span.rating_num,.bigstar50+span.rating_num{font-size:16px;line-height:1}#douban-wrapper .summary{padding-top:10px;color:#000;line-height:25px;letter-spacing:1px;word-break:break-all;font-weight:400}#douban-wrapper{width:100%!important}.douban-dom>div{width:100%}#douban-wrapper #content{background-image:none!important;background:#fff;padding:0!important;width:calc(100% - 20px)!important}#douban-wrapper #content .grid{width:100%!important}.bhd #douban-wrapper ::-webkit-scrollbar-track{background-color:#fff}.bhd #douban-wrapper ::-webkit-scrollbar-thumb{background-color:#ddd}.btn #douban-wrapper .grid-col1,.hdb #douban-wrapper .grid-col1,.hdt #douban-wrapper .grid-col1,.sc #douban-wrapper .grid-col1,.bb #douban-wrapper .grid-col1{display:none}.btn #douban-wrapper .grid-col5,.hdt #douban-wrapper .grid-col5,.hdb #douban-wrapper .grid-col5,.sc #douban-wrapper .grid-col5,.bb #douban-wrapper .grid-col5{width:calc(100% - 570px)}.douban-title-blu{color:#2196f3;font-size:inherit;font-weight:700;margin-left:8px;white-space:nowrap}.douban-title-hdb{margin-left:6px}.douban-title-line{margin:5px 0;font:700 16px tahoma,helvetica,sans-serif;text-align:center;color:#fff}.douban-title-line .douban-title-link{color:#fff;text-decoration:none}.douban-title-line .douban-title-link:hover{text-decoration:underline}.douban-summary-tab-text{line-height:1.6}.douban-title-bhd{margin-left:5px}.douban-rating-group{float:right;max-width:100%;display:flex;flex-direction:column;align-items:flex-start;row-gap:6px}.cblock-innercontent span:has(img[src*=starbig]){font-size:13px!important;white-space:nowrap}.cblock-innercontent span:has(img[src*="date.png"]){white-space:nowrap}[data-douban-list-site=BHD] .douban-list-title{margin-top:6px}.douban-list-title{display:block;text-align:left}.douban-list-title-box{display:flex;flex-direction:column;align-items:flex-start}[data-douban-list-page] .librarydiv:not(.douban-list-popup){display:none!important}[data-douban-list-page]:not([data-douban-list-site=HDF]) #overDiv,[data-douban-list-page]:not([data-douban-list-site=HDF]) .tooltip{display:none!important}[data-douban-list-page][data-douban-list-site=HDB] .browse_imdb_poster,[data-douban-list-page][data-douban-list-site=IPT] #torrents a.hv .tTip{display:none!important}.douban-card-inner .douban-card-head{height:30px;box-sizing:border-box;padding:0 10px;display:flex;align-items:center;background:var(--torrent-card-head-bg, #1c1c1c);border-bottom:1px solid #3c3c3c}.douban-card-inner .douban-card-rating{color:#fff;font-size:12px;font-weight:700}.douban-card-inner .douban-card-rating--none{color:#878787;font-weight:400}.douban-card-inner .douban-card-star{color:#ffb800;margin-right:4px}.douban-card-inner .douban-card-body{display:flex;align-items:flex-start;gap:12px;box-sizing:border-box;height:calc(100% - 30px);padding:10px}.douban-card-inner .douban-card-poster-cell{flex:0 0 120px;width:120px}.douban-card-inner .douban-card-info{flex:1;min-width:0;text-align:left}.douban-card-inner .douban-card-title-line{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px}.douban-card-inner .douban-card-title{color:#fff;font-size:16px;font-weight:700}.douban-card-inner .douban-card-title:hover{color:var(--color-light-blue, #42a5f5)}.douban-card-inner .douban-card-year{color:#878787;font-size:13px}.douban-card-inner .douban-card-rule{height:1px;margin:8px 0;background:#3c3c3c}.douban-card-inner .douban-card-summary{max-height:118px;overflow-y:auto;color:#ddd;font-size:13px;text-align:left}.douban-card-inner .douban-card-countries{margin-top:8px;color:#878787;font-size:12px}.douban-card-inner .douban-card-sep{margin:auto 6px}.douban-card-inner .douban-card-genres{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}.douban-card-inner .douban-card-genre{padding:2px 10px;border-radius:9999px;background:rgba(255,255,255,.1);color:#eee;font-size:12px} ');

(function ($) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var _a, _b, _c;
  const PT_SITE = /* @__PURE__ */ JSON.parse('{"aither.cc":{"url":"https://aither.cc","host":"aither.cc","siteName":"Aither","poster":"#meta-poster","imdb":".badge-user a[href*=\\"imdb.com/title\\"]:nth-child(1)","insertDomSelector":".torrent-buttons","doubanContainerDom":"<div class=\\"movie-wrapper\\"><div class=\\"movie-overlay\\" style=\\"background-color: rgba(81, 51, 40, 0.75);\\"></div><div class=\\"douban-dom\\" style=\\"position: relative;z-index: 2;\\"></div></div>"},"alpharatio.cc":{"url":"https://alpharatio.cc","host":"alpharatio.cc","siteName":"AR","imdb":"a[href*=\\"imdb.com/title\\"]","titleDom":"span.size6","addTitleAfter":"span.size6","addTitleHtml":"<br><a class=\\"douban-title-link douban-title-ar\\" style=\\"color:#008000;\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\"><span class=\\"size6\\">{title}</span></a>","replaceOverviewLabel":"PLOT","addLinkButtonAfter":"a[href*=\\"themoviedb.org\\"]","addLinkButtonHtml":" <a rel=\\"noreferrer\\" target=\\"_blank\\" href=\\"{link}\\"><img class=\\"scale_image\\" src=\\"data:image/png;base64,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\\" alt=\\"Douban\\" title=\\"Douban\\"></a>","listPage":{"path":"^/torrents\\\\.php$","excludeQuery":"[?&]id=","titleLink":"a[href*=\\"torrentid=\\"]","row":"tr.torrent","idPattern":["[?&]torrentid=(\\\\d+)","[?&]id=(\\\\d+)"],"imdbTagPattern":"taglist=(tt\\\\d+)","popupTheme":"card"}},"anthelion.me":{"url":"https://anthelion.me","host":"anthelion.me","siteName":"ANT","siteType":"gazelle","imdb":{"request":".layout a[href*=\\"imdb.com/title\\"]:first","torrent":".torrent_ratings a[href*=\\"imdb.com/title\\"]:first"}},"avistaz.to":{"url":"https://avistaz.to","host":"avistaz.to","siteName":"AvistaZ","imdb":".movie-details .badge-extra a[href*=\\"imdb.com/title\\"]:first","titleDom":".title .torrent-filename","poster":".movie-poster img","insertDomSelector":".movie-poster","doubanContainerDom":"<div class=\\"douban-dom\\" style=\\"justify-content: flex-start;\\"></div>"},"beyond-hd.me":{"url":"https://beyond-hd.me","host":"beyond-hd.me","siteName":"BHD","imdb":".movie-details a[href*=\\"imdb.com/title\\"]:nth-child(1)","addTitleAfter":"h1.bhd-title-h1 a.beta-link-blend","addTitleHtml":"<a class=\\"douban-title-link douban-title-bhd\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\">{title}</a>","replaceOverview":".movie-overview","replaceRating":".badge-meta[title=\\"IMDb Rating\\"]","replaceRatingHtml":"<span class=\\"badge-meta\\" title=\\"豆瓣评分\\"><a rel=\\"noreferrer\\" href=\\"{link}\\" target=\\"_blank\\"><span class=\\"movie-rating-stars\\"><span class=\\"douban-badge-icon\\">豆</span></span> {score}</a></span>","addLinkButtonAfter":".badge-meta:has(.fa-tv-retro)","addLinkButtonHtml":"<span class=\\"badge-meta\\"><a rel=\\"noreferrer\\" href=\\"{link}\\" title=\\"Douban\\" target=\\"_blank\\" class=\\"beta-link-blend\\"> DOUBAN</a></span>","addDarkLinkButtonAfter":".badge-meta:has(.fa-tv-retro)","addDarkLinkButtonHtml":"<span class=\\"badge-meta class-base\\"><span class=\\"class-base\\">DOUBAN</span></span>","listPage":{"path":"^/torrents/?$","titleLink":"a.torrent-name"}},"blutopia.cc":{"url":"https://blutopia.cc","host":"blutopia.cc","siteName":"BLU","imdb":".meta__imdb a[href*=\\"imdb.com/title\\"]:nth-child(1)","titleDom":".torrent__name","addTitleInside":"h1.meta__title","addTitleHtml":"<a class=\\"douban-title-link douban-title-blu\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\">{title}</a>","replaceOverview":"p.meta__description","replaceRating":"li.work__rating","replaceRatingHtml":"<li class=\\"work__rating\\"><a href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"豆瓣评分 {votes}人评价\\"><span class=\\"work__rating-text\\">豆瓣 {score}</span></a></li>","addLinkButtonAfter":"ul.meta__ids li.meta__imdb","addLinkButtonHtml":"<li class=\\"meta__douban\\"><a class=\\"meta-id-tag\\" href=\\"{link}\\" title=\\"Douban\\" target=\\"_blank\\" rel=\\"noreferrer\\"><img src=\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAARCAYAAACilZ5PAAAEHElEQVR42s2Wy29VVRTGf2uffe7j9N5a+uZRCgJpMLUVkdAUhCYycuCMARP/AU30HzBiYkIiE00U49DEGF8JAxONAyOIaGKICgIRMbQX5EJf3F7u+55z9nLQYhwg9Bg17GRnD85e63z723t96xMOHvTGpq4dFl9eUKcdOAQQHqyhGFSM1DTUN86dGDrsjT+fP2zz/kuu6dLovw9a/iadJPuNoAiOtM3bff3rS8ijb020xeDhkCTZjJh7fne6nDB0IdZYjBhEhNjFqCpOHZ7xEARFV8u7YlB1xFYMPpqMZ6eORti4556MnyF0If1BH7eaJWrtGqELyafyWM+SsRmq7Sqhi0gZf3Xgl08pYjB2JWJVsEWEZtRipGcrh0YP0orbyF0iU16Kd396n5mlAs+OH+LS4mUuLf7G/uE9bOvZwpnij6S8NKqOjy8eR1WTvniVsWMTiaKcOjr8gN6gh1bcxv8LWwKELiLrZ5kuzTA5tJs9GyewxuIbn7RN83v5Ohk/TegierLdnCp8y2eXvyCXyuHUrRqHTVps1niUmmWCVMCLE88xW53DMwYFVJXeoIejp1+nHjaYLhXoznZTbpXpC3oZyPVTDWvM1xcpVorkUjkuzv+CNTYx6za5LoGqY21ukFJjiVdPvUZXqhMFamGdI0+9TF/Qy43KLP25PnYMjmGM4cqtaXzj49SRT+fY1bmTjQ9tYLY2x/VKMbFa2X8qc7HGrMsPsn94L93ZNSjK7WaF3qCXWB3WWBbrizTjFqVqCYcSuYjIRRgxLDXL5FIdlJtlrNj/AbhC2maYLhX4ee4Ce4YmmF6aQRC2bxjh7Ox5ipUbZP0M1ys3WagvUKzcJPCzBH6WcrOM7/m0ouX6KJSvISIrd7n6YZLjVkCZrc7y0fnj5NN53jv7AW9+/w5GDF9Nn2S+tkAravNI7wiPr32MXet3smXNZmar8wzk+tnWvZXJod2MDmxnfGCUdtxeAf8fMu7U0ZXpYlPXMPWwjhFhatM+glTAtp4t1MM644OjlFsVzhR/4MLcJF8XTvPEuh3UwxrPjDxNoXyVb65+h2c8vrxykrX5QSIXJevIY8cm3Gp13IihFtY4sHmKJ4f30o5bRC7CMx6BHxC7mEbUpMMP+PTXz0l7KTZ1DeNQZkoFMjbNgYenWKjfInIRxepNPjz/CZ2pTmKNE128jL09oUme1502HroI0JVmBs7FiAhGlqXRikc+naMRNsn4GZpRkzCOcOrI2DRZP4sVj3Lr9n3tw11AYNURJvEqiuIbn5SXuu++etjAiKGxsqZtCkFw6qi1ayiKJ16yAlvxKsaIHrEd1iQxWMqySbrXVNU/mbyz3jFXAJ54yWVQENthjRE94s0Gk6f61i0Z8WUHrBiuB9WPe1J1DXf03ImNr/wBwjPs2VghyRoAAAAASUVORK5CYII=\\" alt=\\"Douban\\" title=\\"Douban\\"></a></li>","listPage":{"path":"^/torrents/?$","titleLink":"a.torrent-search--list__name","popupTheme":"card"}},"broadcasthe.net":{"url":"https://broadcasthe.net","host":"broadcasthe.net","siteName":"BTN","imdb":".stats td a[href*=\\"imdb.com/title\\"]","titleDom":"h2:first","addTitleLineAfter":"img#banner","addTitleLineHtml":"<div class=\\"douban-title-line\\"><a class=\\"douban-title-link\\" target=\\"_blank\\" rel=\\"noreferrer\\" href=\\"{link}\\" title=\\"{title}\\">{title} {nativeTitle}</a></div>","addSummaryTab":"#tabs","addSummaryTabIcon":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAACh0lEQVR42o2SvWvUWRSGn3M//CVjSCaChQbNLCqioCgoxhhxkXW3EHYLS/0TVKx2RVAQKzuLmNJOEBEVwRQGxUYk6ILFqohhk4iLC4lhNJmZ/D7uPRYmE+Mg+sLlVuflfc95BGDHpT2btGQuqfIzgXZQ4ZsSxdIQ4aHU46lnp0Zfy87Bvo3By4hNbCXWA4ryPQmCKVlCGiZsrodMFAZtYivFXJ5nIeNHlIaUfC7PXWIrURh0EQ5KI+p8TP25A6cZWL+XqBEjpmVYNSJieDH1kj/vnfWhHjTCQSeCB4ga6e1aR6W8/oeSLJQWEbxsH+pTQSi0oDPppCvpJA85kdgybMTgjWc2naWafsCJQ1EcgKIkdgXvZt+xb90eft98mDaXYI0DFBBCLJgvUu68usuN57dZVeqmiAHgs8lSZ2Xr6i3s7+3n1fRrFEVEUFUEYXfPJsZm/kW5tSzhchOULGTkMefw1SNU04+0uzYaxTzlpJOXJ/4mC1kLBu7r3s44vPEMH7tJEQP1vE7Jl3DG4o3HGde6qy+reOMZr04y+t9TpmrTqEZ2rd2JamSqNs3o2yeMVyfxxqO6lEa2D/XplyRmIcMaS6Xcy4bun7j46wX+uneW8eokk9U3pCElccm3TYwYalmNgd5+rvwx1BL7zP3zXPvnBuW2LsLCZQBk2+W+TAQHyCJ0K32JA5UBvPUIn68TUR69ecz7+gzOuMXlqiqFM/DAlNxvxVyRi8EbMdTyOtef32oysviv9KWmgUZy1+F8rBUPnFGOhzSMuA5bCfXQrNXdVl7ItqQYY/O8rsP6kIYJqxy3/w+/nVnzS8+wGjYg0rNAsSiK6vLXxMlKg6gjphGPPjs5OvYJRYI+gaJ9V4UAAAAASUVORK5CYII=","replaceRating":"tr:has(b:contains(\\"TVDB Rating\\"))","replaceRatingHtml":"<tr><td><b>DouBan Rating:</b></td><td>{score}</td></tr>","replaceRatingPosition":"after","addLinkButtonAfter":"a[href*=\\"thetvdb.com\\"]","addLinkButtonHtml":" <a target=\\"_blank\\" rel=\\"noreferrer\\" href=\\"{link}\\"><img src=\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACT0lEQVR42oWTv2sUQRzFP9/Z2du93J5GLRJJkAO1sfAHCElnlIhgJSgICpapQkgriGCaWFrE/Aci2AgKQUkTRYSgSGwkqGDQRM4faDTn7d3uzn4tjpy5GPTBNDNvHu99540AHL4xsF+7zA2QIXEUAWFrqHrEoHNSz8cXxuffyJGpwX3Ol1kbeJV4LSbXnH9BxFAsF3FNt+SletLmolM2sJXGWjPtLff4kV9Ct7CwvtdwTT7+qKZBuVBxWTplVcyJZi3RbWHk3z1/m+3hNv6H07fO+u++L2nghSesCL6IkOUZi19fs7O4A6cO2eRBUTzxyPKMOG1gxAiivhycHlQBnOZkuWPP9n4CG6CabwiiiBiaWZMPP5cxYrBiURS7ns8aS+JSJo5fYaD/6JbW55efc+nuCKEf4tQBtATW4dRRDiKerbxg4tEk3WE3AKuNVa4eu0w5iHDqULR9x24edetQEaRNXJ+Htggd6BAwxlBLfjHQd5R7F+78HWHlOcaYzl4cnB7UPzVTess9lIMyjSTm6tBlACbmJgn9kLWkRrX2qeOFOgQ84/Gp9pnrw9c4d+AMRb8IQJzGPH7/lJH7Y+wKu3Eb2mpVSUWwgKgqUaHEqy+LzC09IXEJAvhegYXqS7psuHEEqkomh24OPjAleyqrZamYVqnqSZ3EpYhIm2mNR1SIUBTNSW1k/fxX9tAaZdQ13ayNvIqrO1SVUqFEJJuaqNr+aDbyfNd0S54y6lVnlr/tHu6bUcNeRPpQrKKiqnSslnnFk5hcZ02cX1wYm3/7G0f0F7GPR+eKAAAAAElFTkSuQmCC\\" border=\\"0\\" width=\\"16\\" height=\\"16\\" alt=\\"Douban\\" title=\\"Douban\\"></a>","listPage":{"path":"^/torrents\\\\.php$","excludeQuery":"[?&]id=","titleLink":"a[title=\\"View Torrent\\"]","row":"tr.torrent","idPattern":["[?&]torrentid=(\\\\d+)","[?&]id=(\\\\d+)"],"releaseName":"div.nobr span[title]","popupTheme":"card"}},"eiga.moi":{"url":"https://eiga.moi","host":"eiga.moi","siteName":"ACM","imdb":".meta__imdb a[href*=\\"imdb.com/title\\"]:nth-child(1)","titleDom":".torrent__name","addTitleInside":"h1.meta__title","addTitleHtml":"<a class=\\"douban-title-link douban-title-acm\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\">{title}</a>","replaceOverview":"p.meta__description","replaceRating":"li.work__rating","replaceRatingHtml":"<li class=\\"work__rating\\"><a href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"豆瓣评分 {votes}人评价\\"><span class=\\"work__rating-text\\">豆瓣 {score}</span></a></li>","addLinkButtonAfter":"ul.meta__ids li.meta__imdb","addLinkButtonHtml":"<li class=\\"meta__douban\\"><a class=\\"meta-id-tag\\" href=\\"{link}\\" title=\\"Douban\\" target=\\"_blank\\" rel=\\"noreferrer\\"><img src=\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAARCAYAAACilZ5PAAAEHElEQVR42s2Wy29VVRTGf2uffe7j9N5a+uZRCgJpMLUVkdAUhCYycuCMARP/AU30HzBiYkIiE00U49DEGF8JAxONAyOIaGKICgIRMbQX5EJf3F7u+55z9nLQYhwg9Bg17GRnD85e63z723t96xMOHvTGpq4dFl9eUKcdOAQQHqyhGFSM1DTUN86dGDrsjT+fP2zz/kuu6dLovw9a/iadJPuNoAiOtM3bff3rS8ijb020xeDhkCTZjJh7fne6nDB0IdZYjBhEhNjFqCpOHZ7xEARFV8u7YlB1xFYMPpqMZ6eORti4556MnyF0If1BH7eaJWrtGqELyafyWM+SsRmq7Sqhi0gZf3Xgl08pYjB2JWJVsEWEZtRipGcrh0YP0orbyF0iU16Kd396n5mlAs+OH+LS4mUuLf7G/uE9bOvZwpnij6S8NKqOjy8eR1WTvniVsWMTiaKcOjr8gN6gh1bcxv8LWwKELiLrZ5kuzTA5tJs9GyewxuIbn7RN83v5Ohk/TegierLdnCp8y2eXvyCXyuHUrRqHTVps1niUmmWCVMCLE88xW53DMwYFVJXeoIejp1+nHjaYLhXoznZTbpXpC3oZyPVTDWvM1xcpVorkUjkuzv+CNTYx6za5LoGqY21ukFJjiVdPvUZXqhMFamGdI0+9TF/Qy43KLP25PnYMjmGM4cqtaXzj49SRT+fY1bmTjQ9tYLY2x/VKMbFa2X8qc7HGrMsPsn94L93ZNSjK7WaF3qCXWB3WWBbrizTjFqVqCYcSuYjIRRgxLDXL5FIdlJtlrNj/AbhC2maYLhX4ee4Ce4YmmF6aQRC2bxjh7Ox5ipUbZP0M1ys3WagvUKzcJPCzBH6WcrOM7/m0ouX6KJSvISIrd7n6YZLjVkCZrc7y0fnj5NN53jv7AW9+/w5GDF9Nn2S+tkAravNI7wiPr32MXet3smXNZmar8wzk+tnWvZXJod2MDmxnfGCUdtxeAf8fMu7U0ZXpYlPXMPWwjhFhatM+glTAtp4t1MM644OjlFsVzhR/4MLcJF8XTvPEuh3UwxrPjDxNoXyVb65+h2c8vrxykrX5QSIXJevIY8cm3Gp13IihFtY4sHmKJ4f30o5bRC7CMx6BHxC7mEbUpMMP+PTXz0l7KTZ1DeNQZkoFMjbNgYenWKjfInIRxepNPjz/CZ2pTmKNE128jL09oUme1502HroI0JVmBs7FiAhGlqXRikc+naMRNsn4GZpRkzCOcOrI2DRZP4sVj3Lr9n3tw11AYNURJvEqiuIbn5SXuu++etjAiKGxsqZtCkFw6qi1ayiKJ16yAlvxKsaIHrEd1iQxWMqySbrXVNU/mbyz3jFXAJ54yWVQENthjRE94s0Gk6f61i0Z8WUHrBiuB9WPe1J1DXf03ImNr/wBwjPs2VghyRoAAAAASUVORK5CYII=\\"></a></li>","listPage":{"path":"^/torrents/?$","titleLink":"a.torrent-search--list__name","popupTheme":"card"}},"filelist.io":{"url":"https://filelist.io","host":"filelist.io","siteName":"FL","imdb":".cblock-innercontent div a[href*=\\"imdb.com/title\\"]:first","titleDom":".cblock-header h4","addTitleBefore":".cblock-innercontent span[style*=\\"padding-left:25px\\"]","addTitleHtml":"<a class=\\"douban-title-link douban-title-fl\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\">{title}</a>","replaceOverview":".cblock-innercontent span[style*=\\"padding-left:25px\\"]","replaceRating":".cblock-innercontent span:has(img[src*=\\"starbig\\"])","replaceRatingPosition":"before","ratingSourceLabel":"IMDb","replaceRatingHtml":"<span style=\\"font-size:18px;float:right;margin-right:12px;\\"><img src=\\"/styles/images/starbig.png\\" alt=\\"豆瓣评分\\" style=\\"position:relative;bottom:2px;\\"> 豆瓣 {score}</span>","addLinkButtonAfter":".cblock-innercontent a:has(img[src*=\\"imdb.png\\"])","addLinkButtonHtml":" <a href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\"><img src=\\"data:image/png;base64,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\\" alt=\\"Douban\\" title=\\"Douban\\"></a>","listPage":{"path":"^/browse\\\\.php$","titleLink":".torrentrow a[href*=\\"details.php?id=\\"]","row":"div.torrentrow","idPattern":"[?&]id=(\\\\d+)","titleAttr":"title","popupTheme":"card"}},"hd-space.org":{"url":"https://hd-space.org","host":"hd-space.org","siteName":"HDS","imdb":"#imdb a[href*=\\"imdb.com/title\\"]","titleDom":"#imdb td.header a","addTitleInside":"#imdb td.header b a","addTitleHtml":"<a class=\\"douban-title-link\\" style=\\"color:inherit; text-decoration: underline;\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\">{title}</a>","replaceRating":"#imdb tr:has(b:contains(\\"Rating:\\"))","replaceRatingPosition":"after","renameRatingLabel":"IMDB Rating:","starFullHtml":"<span class=\\"star\\" style=\\"background-image: url(https://hd-space.org/imdbphp/imgs/star_boxed_full.png); background-repeat: no-repeat; display: inline-block; width: 8px; height: 16px; background-position: 0px 0px; cursor: default;\\"></span><span class=\\"star\\" style=\\"background-image: url(https://hd-space.org/imdbphp/imgs/star_boxed_full.png); background-repeat: no-repeat; display: inline-block; width: 9px; height: 16px; background-position: -8px 0px; cursor: default;\\"></span>","starEmptyHtml":"<span class=\\"star\\" style=\\"background-image: url(https://hd-space.org/imdbphp/imgs/star_boxed_empty.png); background-repeat: no-repeat; display: inline-block; width: 8px; height: 16px; background-position: 0px 0px; cursor: default;\\"></span><span class=\\"star\\" style=\\"background-image: url(https://hd-space.org/imdbphp/imgs/star_boxed_empty.png); background-repeat: no-repeat; display: inline-block; width: 9px; height: 16px; background-position: -8px 0px; cursor: default;\\"></span>","replaceRatingHtml":"<tr><td class=\\"lista\\"><b>DouBan Rating:</b></td><td class=\\"lista\\"><a href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"豆瓣评分 {votes}人评价\\" style=\\"text-decoration:none\\">{stars}<span style=\\"color:#999;font-size:12px;font-weight:bold\\">{score}/10</span></a></td></tr>","replaceOverview":"#imdb tr:has(b:contains(\\"Plot:\\")) > td + td","listPage":{"path":"^/index\\\\.php$","query":"[?&]page=torrents(?:&|$)","titleLink":"a[href*=\\"page=torrent-details\\"]","row":"tr","idPattern":"id=([0-9a-f]{40})","popupTheme":"card"}},"hd-torrents.org":{"url":"https://hd-torrents.org","host":"hd-torrents.org","siteName":"HDT","imdb":".imdbnew2 a[href*=\\"imdb.com/title\\"]:first","addTitleAfter":".imdbnew2 a[href*=\\"imdb.com/title\\"]","addTitleHtml":"<strong><font color=\\"black\\"> <img src=\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAMCAIAAAD3UuoiAAAB/0lEQVR4nHWTPWhUQRDHZ3b3vUu4u9wlohIT9RA/CitLsRYsxMJKucI2YB2tLRS1UMQijViIiBY2FmKlFioEYhMRMa2gJuTOJN69d+/tzozs3b13H8Fhi2WY/4+Z2f/i2vv5IDAiAkOhFExOKKWGcz6EoZOKcyPFiGitM1oZY4IcRAzlIr79FN182DAGmAcCo9E6uXRhaqFebW6T0ZiDmMA4J0pLDhKBOJb5/WahXi0VEaFf3RVAO+KDB4JWm4XBZRJEcE4MEzB5fT8LEEVwrBb+2eL7j5vOCYtPKuUFF8+VT5+a/L3pAo15r4ieMA4C8OOQg69ryefVzqPbs6kVZpmpmOt3Nz6uxJfPV5iARnb0f5Cwn9wEyAJJ6gd3JGGACpHZ1/NuEJEQDXbUA8Ud3jut9s3oxVvrpaJihtSK1nC8Frb9gmSsI6JdO+pFFMnZM6VqWS/e2Xh2b+7EkfDKtZ/lorpan17fJBD/TGMdqR4oP0QAAo0mr35LQFAr/LASvX7Xevnmb20u/PI9+fHL9qcbPbj84lBYGPjIkeypmAdPGk9fbRdCDAw6knbELDBVUp1ETh4tLN2YjRNRmTEQMU0sLj8/PAwSAIXQiji1vtQbEkH7t0cibwQEqJT1mLPTxJrWjjNB14hZCIDWOKF7tywpYrIfs7NlBzbtkpx1/wDkbTxzYNS8TAAAAABJRU5ErkJggg==\\" border=\\"0\\"> </font></strong><a class=\\"douban-title-link douban-title-hdt\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\"><font size=\\"3\\"><b>{title}</b></font></a>","replaceOverviewLabel":"Plot:","replaceRating":".imdbnew2 img[src*=\\"ratings/\\"]","ratingRewriteHtml":"<strong><font color=\\"black\\">IMDB：</font></strong>{siteScore}/10<strong><font color=\\"black\\">（Votes: {siteVotesComma}）</font></strong>","removeRatingVotes":".imdbnew2 strong:has(> font:contains(\\"Votes\\"))","replaceRatingHtml":"<br><strong><font color=\\"black\\">豆瓣: </font></strong>{score}/10 <strong><font color=\\"black\\">（Votes: {votesComma}）</font></strong>","listPage":{"path":"^/torrents\\\\.php$","titleLink":"a[href*=\\"details.php?id=\\"]","row":"tr","idPattern":"id=([0-9a-f]{40})","popupTheme":"card"}},"hdbits.org":{"url":"https://hdbits.org","host":"hdbits.org","siteName":"HDB","imdb":{"movie":".contentlayout h1 a","tv":"#details .showlinks li:nth-child(2) a","tvRequest":".lottery_table2 .showlinks li:nth-child(2) a"},"titleDom":"table.contentlayout h1","addTitleInside":"table.contentlayout h1","addTitleHtml":"<a class=\\"douban-title-link douban-title-hdb\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\">{title}</a>","replaceOverview":"#plotcell tr:has(th:contains(\\"Plot\\")) + tr > td","replaceRating":"#imdbinfo tr:has(th:contains(\\"Rating\\"))","renameRatingLabel":"IMDB Rating","replaceRatingHtml":"<tr><th>DouBan Rating</th><td>{score} ({votesComma} votes)</td></tr>","replaceRatingPosition":"after","listPage":{"path":"^/browse\\\\.php$","titleLink":"td.browse_td_name_cell b a","idPattern":"[?&]id=(\\\\d+)","popupTheme":"card"}},"hdf.world":{"url":"https://hdf.world","host":"hdf.world","siteName":"HDF","imdb":"a[href*=\\"imdb.com/title\\"]","titleDom":"h2","addTitleAfter":"h2 span[dir=\\"ltr\\"]","addTitleHtml":" <a class=\\"douban-title-link\\" style=\\"color: #36F69F; text-decoration: none;\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\">{title}</a>","replaceOverview":"#plotcell tr:has(th:contains(\\"Synopsis\\")) + tr > td","replaceOverviewLabel":"Synopsis","replaceRating":".torrent_description a[href*=\\"wikipedia.org\\"]","replaceRatingPosition":"before","replaceRatingHtml":"<a href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"豆瓣评分\\"><img class=\\"scale_image\\" src=\\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgNjAiIHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIHJ4PSIxMiIgZmlsbD0iIzAwNzcyMiIvPjx0ZXh0IHg9IjYwIiB5PSI0MyIgZm9udC1mYW1pbHk9IlBpbmdGYW5nIFNDLEhpcmFnaW5vIFNhbnMgR0IsTWljcm9zb2Z0IFlhSGVpLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7osYbnk6M8L3RleHQ+PC9zdmc+\\" width=\\"62\\" height=\\"30\\" alt=\\"Douban\\"></a> : <strong>{score}</strong>/10 | ","addLinkButtonAfter":".db-links-container-details a[href*=\\"imdb.com/title\\"]","addLinkButtonHtml":"<a href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" class=\\"tooltip db-link db-link-copy\\" title=\\"Douban\\"><img src=\\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgNjAiIHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIHJ4PSIxMiIgZmlsbD0iIzAwNzcyMiIvPjx0ZXh0IHg9IjYwIiB5PSI0MyIgZm9udC1mYW1pbHk9IlBpbmdGYW5nIFNDLEhpcmFnaW5vIFNhbnMgR0IsTWljcm9zb2Z0IFlhSGVpLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7osYbnk6M8L3RleHQ+PC9zdmc+\\" alt=\\"Douban\\"></a>","listPage":{"path":"^/torrents\\\\.php$","excludeQuery":"[?&]id=","titleLink":".group_info a[href*=\\"torrents.php?id=\\"]","row":"tr.group","idPattern":"[?&]id=(\\\\d+)","releaseName":".group_info","popupTheme":"card"}},"iptorrents.com":{"url":"https://iptorrents.com","host":"iptorrents.com","siteName":"IPT","imdb":".main td a[href*=\\"imdb.com/title\\"]","titleDom":".tt","addTitleInside":".tt","addTitleHtml":"<a class=\\"douban-title-link\\" style=\\"color:inherit\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\">{title}</a>","replaceRating":".imdb-voters","groupRating":true,"replaceRatingHtml":"<div class=\\"douban-voters rbox\\" title=\\"豆瓣评分 {score} / 10, {votes} votes\\" style=\\"padding-right:25px;font-size:12px\\"><a class=\\"rsrc\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer nofollow\\" style=\\"background:#007722;color:#fff\\">豆瓣</a>{score} / 10<div class=\\"imdb-rating\\" style=\\"width:{scoreWidth}\\"></div><div class=\\"rvotes\\">{votesComma} votes</div></div>","replaceOverview":".main tr:has(td:contains(\\"Plot\\")) > td + td","addLinkButtonAfter":".main td:has(a[href*=\\"imdb.com/title\\"]) a[href*=\\"imdb.com/title\\"]","addLinkButtonHtml":" <a class=\\"douban-ipt-btn\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer nofollow\\" style=\\"display:inline-flex;align-items:center;gap:5px;background:#007722;color:#fff;padding:6px 14px;border-radius:5px;text-decoration:none;font-weight:700;font-size:13px;border:1px solid #005c1b;transition:background .15s,color .15s\\" onmouseover=\\"this.style.background=\'#005c1b\'\\" onmouseout=\\"this.style.background=\'#007722\'\\">豆瓣</a>","listPage":{"path":"^/t$","titleLink":"#torrents a[href*=\\"/t/\\"]","row":"tr","idPattern":"/t/(\\\\d+)","titleTextStrip":".tTip","popupTheme":"card"}},"karagarga.in":{"url":"https://karagarga.in","host":"karagarga.in","siteName":"KG","imdb":"td a[href*=\\"imdb.com/title\\"]:first","insertDomSelector":".outer h1~table:first","doubanContainerDom":"<div class=\\"douban-dom kg\\" style=\\"width:1100px;padding-top:20px;\\"></div>"},"passthepopcorn.me":{"url":"https://passthepopcorn.me","host":"passthepopcorn.me","siteName":"PTP","siteType":"gazelle","imdb":{"request":"#request-table a[href*=\\"imdb.com/title\\"]:first","torrent":"#imdb-title-link"},"top10":{"path":"^/top10\\\\.php$","browsePath":"^/torrents\\\\.php$"}},"privatehd.to":{"url":"https://privatehd.to","host":"privatehd.to","siteName":"PHD","imdb":".movie-details .badge-extra a[href*=\\"imdb.com/title\\"]:first","titleDom":".title .torrent-filename","poster":".movie-poster img","insertDomSelector":".movie-poster","doubanContainerDom":"<div class=\\"douban-dom\\" style=\\"justify-content: flex-start;\\"></div>"},"secret-cinema.pw":{"url":"https://secret-cinema.pw","host":"secret-cinema.pw","siteName":"SC","imdb":".torrent_row a[href*=\\"imdb.com/title\\"]:first","insertDomSelector":".linkbox:first","doubanContainerDom":"<div class=\\"douban-dom sc\\"></div>"},"shadowthein.net":{"url":"http://shadowthein.net","host":"shadowthein.net","siteName":"iTS","imdb":".IMDBtable a[href*=\\"imdb.com/title\\"]:first","titleDom":"h1:first","addTitleAfter":".IMDBtable tr:has(td:contains(\\"Title:\\")) b","addTitleHtml":" <a class=\\"douban-title-link\\" style=\\"color:inherit;font-weight:bold;\\" href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"{title}\\">{title}</a>{year}","addTitleYearFrom":".IMDBtable tr:has(td:contains(\\"Released:\\")) td + td","replaceRating":".IMDBtable tr:has(td:contains(\\"Rating:\\"))","replaceRatingPosition":"after","renameRatingLabel":"IMDB Rating:","replaceRatingHtml":"<tr><td>DouBan Rating:</td><td><a href=\\"{link}\\" target=\\"_blank\\" rel=\\"noreferrer\\" title=\\"豆瓣评分 {votes}人评价\\" style=\\"color:darkorange\\">{score}</a></td></tr>","replaceOverview":".IMDBtable tr:has(td:contains(\\"Plot:\\")) > td + td","addLinkButtonAfter":".IMDBtable tr:has(td:contains(\\"Link:\\")) a","addLinkButtonHtml":" <a href=\\"redir.php?{link}\\" style=\\"color:darkorange\\">{link}</a>","listPage":{"path":"^/browse\\\\.php$","titleLink":"a[href*=\\"/details.php?id=\\"]","row":"tr","idPattern":"[?&]id=(\\\\d+)","titleAttr":"output","popupTheme":"card"}},"tgx.rs":{"url":"https://tgx.rs","host":"tgx.rs","siteName":"TorrentGalaxy","poster":"#covercell img","imdb":"#imdbpage[href*=\\"imdb.com/title\\"]","titleDom":".torrentpagetable.limitwidth:first a.textshadow","insertDomSelector":".buttonbox","doubanContainerDom":"<div class=\\"douban-dom\\" style=\\"display:flex;justify-content: center;\\"></div>"},"www.torrentleech.org":{"url":"https://www.torrentleech.org","host":"torrentleech.org","siteName":"IPT","imdb":".imdb-info a[href*=\\"imdb.com/title\\"]","titleDom":"#torrentnameid","poster":".imdb_cover img","insertDomSelector":".torrent-info .torrent-info-details","doubanContainerDom":"<div class=\\"douban-dom\\"></div>"}}');
  const host = location.host;
  let siteInfo = (_a = PT_SITE == null ? void 0 : PT_SITE[host]) != null ? _a : "";
  if (host && host.match(/iptorrents/i)) {
    siteInfo = PT_SITE["iptorrents.com"];
  } else {
    siteInfo = (_b = PT_SITE == null ? void 0 : PT_SITE[host]) != null ? _b : "";
  }
  const CURRENT_SITE_INFO = siteInfo;
  const CURRENT_SITE_NAME = (_c = CURRENT_SITE_INFO == null ? void 0 : CURRENT_SITE_INFO.siteName) != null ? _c : "";
  const DOUBAN_SUBJECT_URL = "https://movie.douban.com/subject/{doubanId}";
  const DOUBAN_SEARCH_API = "https://movie.douban.com/j/subject_suggest?q={query}";
  const DOUBAN_SUGGEST_API = "https://www.douban.com/search?cat=1002&q={query}";
  const DOUBAN_API_URL = "https://api.douban.com/v2/movie";
  const DOUBAN_SUGGEST_API_URL = "https://movie.douban.com/j/subject_suggest";
  const isChinese = (title) => {
    return /[\u4e00-\u9fa5]+/.test(title);
  };
  const PTP_DOUBAN_RATING_ICON = "data:image/svg+xml,".concat(encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><g transform="translate(32 32) scale(0.74) translate(-32 -32)"><g transform="translate(5 -5) rotate(13 32 32)"><rect x="10" y="17" width="44" height="30" rx="4" fill="#009845"/></g><path fill="#007722" d="M12 20h40a4 4 0 0 1 4 4v6a3.6 3.6 0 0 0 0 7.2v6a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-6a3.6 3.6 0 0 0 0-7.2v-6a4 4 0 0 1 4-4z"/><text x="32" y="41.2" text-anchor="middle" font-family="PingFang SC,Hiragino Sans GB,Microsoft YaHei,Noto Sans CJK SC,sans-serif" font-size="18" font-weight="700" fill="#ffffff" letter-spacing="1">豆瓣</text></g></svg>'
  ));
  const addToPtpPage = (data) => {
    console.log(data);
    $(".page__title").prepend("<a target='_blank' href=\"".concat(data.link, '">[').concat(data.chineseTitle, "] </a>"));
    dedupePrependedTitle(".page__title", data.chineseTitle);
    if (hasChineseText(data.summary)) {
      $("#synopsis-and-trailer #synopsis").text(data.summary);
    }
    $("#movieinfo").before('\n    <div class="panel">\n    <div class="panel__heading"><span class="panel__heading__title">电影信息</span></div>\n    <div class="panel__body">\n    <div><strong>导演:</strong> '.concat(data.director, "</div>\n    <div><strong>类型:</strong> ").concat(data.genre, "</div>\n    <div><strong>制片国家/地区:</strong> ").concat(data.region, "</div>\n    <div><strong>语言:</strong> ").concat(data.language, "</div>\n    <div><strong>时长:</strong> ").concat(data.runtime, "</div>\n    <div><strong>又名:</strong>  ").concat(data.aka, "</div\n    </div>"));
    if (data.average) {
      const votesText = data.votes ? Number(data.votes).toLocaleString("en-US") : "";
      $("#movie-ratings-table tr").prepend(
        '<td colspan="1" style="width: 63px;"><center><a target="_blank" class="rating" href="'.concat(data.link, '" rel="noreferrer"><img src="').concat(PTP_DOUBAN_RATING_ICON, '" style="height:64px;width:64px;" title="Douban"></a></center></td>\n    <td style="width: 90px;"><span class="rating">').concat(data.average, '</span> <span class="mid">/</span> <span class="outof"> 10</span><br>(').concat(votesText, " votes)</td>")
      );
    }
    $(".main-column").prepend($("#movie-ratings-table").parent());
    normalizePtpRatingsTable();
    addPtpGroupNames();
  };
  const normalizePtpRatingsTable = () => {
    const $row = $("#movie-ratings-table tr:first");
    if (!$row.length) {
      return;
    }
    const cells = Array.from($row.children("td"));
    const starIndex = cells.findIndex((cell) => cell.id === "ptp_rating_td");
    const external = starIndex > 0 ? cells.slice(0, starIndex) : cells.slice(0, Math.max(0, cells.length - 2));
    const pairs = [];
    let iconWidth = 0;
    let valueWidth = 0;
    for (let i = 0; i + 1 < external.length; i += 2) {
      const icon = external[i];
      const value = external[i + 1];
      if (!icon.querySelector("img") || value.querySelector("img") || !value.querySelector(".rating")) {
        break;
      }
      pairs.push([icon, value]);
      iconWidth = Math.max(iconWidth, cellWidth($(icon)));
      valueWidth = Math.max(valueWidth, cellWidth($(value)));
    }
    if (!pairs.length || !iconWidth || !valueWidth) {
      return;
    }
    pairs.forEach(([icon, value]) => {
      icon.style.width = "".concat(iconWidth, "px");
      value.style.width = "".concat(valueWidth, "px");
    });
  };
  const cellWidth = ($cell) => {
    var _a2, _b2;
    return parseFloat((_b2 = (_a2 = $cell[0]) == null ? void 0 : _a2.style) == null ? void 0 : _b2.width) || $cell.width() || 0;
  };
  const addPtpGroupNames = () => {
    const table = document.querySelector("#torrent-table");
    if (table && typeof MutationObserver === "function" && !table.dataset.groupObserver) {
      table.dataset.groupObserver = "1";
      let timer = null;
      new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(() => addPtpGroupNames(), 300);
      }).observe(table, { childList: true, subtree: true });
    }
    $("#torrent-table a.torrent-info-link:not([data-group-name])").each(function() {
      const $link = $(this);
      const onclick = $link.attr("onclick") || "";
      const groupFromRow = String($link.parent().parent().data("releasegroup") || "").trim();
      let groupname = groupFromRow || groupFromTorrentId((onclick.match(/#torrent_(\d+)/) || [])[1] || "");
      if (!groupname && $link.text().split(" / ").includes("TBB")) {
        $link.html((index, html) => html.replace(" / TBB", ""));
        groupname = "TBB";
      }
      if (groupname) {
        $link.attr("data-group-name", groupname).append(" / ").append('<span style="font-weight:bold">'.concat(groupname, "</span>"));
      }
    });
  };
  const GROUP_FROM_FILENAME = /[-_]([A-Za-z0-9_[\]]{2,})\.(?:mkv|mp4|avi|m2ts|ts|vob|iso|mov|wmv|mpg|mpeg|flac|srt|idx|sub|ass|sup)$/i;
  const groupFromTorrentId = (torrentId) => {
    var _a2, _b2;
    if (!torrentId) {
      return "";
    }
    const infoRow = document.getElementById("torrent_".concat(torrentId));
    if (!infoRow) {
      return "";
    }
    const fileName = ((_b2 = (_a2 = infoRow.querySelector("#files_".concat(torrentId, " td"))) == null ? void 0 : _a2.textContent) == null ? void 0 : _b2.trim()) || (infoRow.textContent.match(/Complete name\s*:\s*(\S+)/) || [])[1] || "";
    return (fileName.match(GROUP_FROM_FILENAME) || [])[1] || "";
  };
  const addToANTPage = (data) => {
    console.log(data);
    $(".header h2").prepend("<a target='_blank' href=\"".concat(data.link, '">[').concat(data.chineseTitle, "] </a>"));
    dedupePrependedTitle(".header h2", data.chineseTitle);
    if (data.summary) {
      const synopsisDom = '\n    <div class="box torrent_description">\n      <div class="head"><a href="#">↑</a>&nbsp;<strong>中文简介</strong></div>\n      <div class="body" style="text-align:justify">'.concat(data.summary, "</div>\n    </div>");
      $(".torrent_description,.box_request_desc").after(synopsisDom);
    }
    $(".box_details:first").before('\n    <div class="box box_details">\n      <div class="head"><strong></strong>电影信息</div>\n      <div class="pad">\n        <ul class="stats nobullet">\n          <li><strong>导演:</strong> '.concat(data.director, "</li>\n          <li><strong>类型:</strong> ").concat(data.genre, "</li>\n          <li><strong>制片国家/地区:</strong> ").concat(data.region, "</li>\n          <li><strong>语言:</strong> ").concat(data.language, "</li>\n          <li><strong>时长:</strong> ").concat(data.runtime, "</li>\n          <li><strong>又名:</strong>  ").concat(data.aka, "</li\n      </ul>\n      </div>    \n    </div>"));
    if (data.average) {
      $(".box.torrent_ratings .body tr").prepend(
        '<td colspan="1">\n      <center>\n        <a target="_blank" class="rating ant" href="'.concat(data.link, '" rel="noreferrer">\n          <div style="font-size: 0;">\n            <span class="icon-pt1">豆</span>\n          </div>\n        </a>\n      </center>\n    </td>\n    <td>\n      <span class="rating">').concat(data.average, '</span>\n      <span class="mid">/</span>\n      <span class="outof"> 10</span>\n      <br>(').concat(data.votes, " votes)</td>")
      );
    }
    $(".main_column").prepend($(".box.torrent_ratings"));
  };
  const getImdbId = () => {
    var _a2, _b2;
    let imdbLink = "";
    const imdbConfig = CURRENT_SITE_INFO.imdb;
    if (typeof imdbConfig === "object") {
      try {
        Object.keys(imdbConfig).forEach((key) => {
          if ($("".concat(imdbConfig[key]))[0]) {
            imdbLink = $(imdbConfig[key]).attr("href");
            throw new Error("end loop");
          }
        });
      } catch (error) {
        if (error.message !== "end loop") {
          console.log(error);
        }
      }
    } else {
      imdbLink = $(imdbConfig).attr("href");
    }
    console.log(imdbLink);
    return (_b2 = (_a2 = /tt\d+/.exec(imdbLink)) == null ? void 0 : _a2[0]) != null ? _b2 : "";
  };
  const getDoubanId = async (imdbId) => {
    try {
      const url = DOUBAN_SEARCH_API.replace("{query}", imdbId);
      const res = await fetch(url, {
        responseType: "json"
      });
      if (res && res.length > 0 && res[0].id) {
        const { id, title, episode } = res[0];
        return {
          id,
          season: episode,
          title
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDoubanIdByIMDB = async (imdbId) => {
    var _a2, _b2, _c2, _d;
    try {
      const url = DOUBAN_SUGGEST_API.replace("{query}", imdbId);
      const options = {
        cookie: "",
        anonymous: false,
        responseType: void 0
      };
      const data = await fetch(url, options);
      const doc = new DOMParser().parseFromString(data, "text/html");
      const linkDom = doc.querySelector(".result-list .result h3 a");
      if (!linkDom) {
        throw new Error("豆瓣ID获取失败");
      } else {
        const { href, textContent } = linkDom;
        const season = (_b2 = (_a2 = textContent == null ? void 0 : textContent.match(/第(.+?)季/)) == null ? void 0 : _a2[1]) != null ? _b2 : "";
        const doubanId = (_d = (_c2 = decodeURIComponent(href).match(/subject\/(\d+)/)) == null ? void 0 : _c2[1]) != null ? _d : "";
        return {
          id: doubanId,
          season,
          title: textContent || ""
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const fetchDoubanApi = (path) => {
    return fetch("".concat(DOUBAN_API_URL).concat(path), {
      data: encodeURI("apikey=0ab215a8b1977939201640fa14c66bab"),
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
  };
  const getLargePoster = (url = "") => {
    return url.replace(/s(_ratio_poster|pic)/g, "l$1").replace(/img\d/, "img9");
  };
  const formatAverage = (average) => {
    return parseFloat(average) ? average : "";
  };
  const numberToChinese = (num) => {
    const digits = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const value = parseInt(num, 10);
    if (!value || value < 1) {
      return "";
    }
    if (value >= 100) {
      return String(value);
    }
    if (value < 10) {
      return digits[value];
    }
    if (value === 10) {
      return "十";
    }
    if (value < 20) {
      return "十".concat(digits[value - 10]);
    }
    const tens = digits[Math.floor(value / 10)];
    const ones = value % 10 ? digits[value % 10] : "";
    return "".concat(tens, "十").concat(ones);
  };
  const matchSeasonSubject = (subjects, chineseTitle, seasonNumber, strict = true) => {
    const cnSeason = numberToChinese(seasonNumber);
    const seasonMarkers = [
      "第".concat(seasonNumber, "季"),
      cnSeason ? "第".concat(cnSeason, "季") : "",
      "season ".concat(seasonNumber)
    ].filter(Boolean);
    const nameHit = (subject) => {
      const title = subject.title || "";
      const originalTitle = subject.original_title || "";
      return title.includes(chineseTitle) || originalTitle.includes(chineseTitle);
    };
    const seasonHit = (subject) => {
      const title = (subject.title || "").toLowerCase();
      return seasonMarkers.some((marker) => title.includes(marker.toLowerCase()));
    };
    const bothMatched = subjects.find((subject) => nameHit(subject) && seasonHit(subject));
    if (bothMatched || strict) {
      return bothMatched;
    }
    return subjects.find((subject) => nameHit(subject));
  };
  const getTvSeasonData = async (data) => {
    var _a2, _b2;
    const torrentTitle = getTorrentTitle();
    const { episodes = "", chineseTitle } = data;
    if (episodes) {
      const seasonNumber = (_b2 = (_a2 = torrentTitle.match(/S(?!eason)\s*?0?(\d+)\.?(EP?\d+)?/i)) == null ? void 0 : _a2[1]) != null ? _b2 : 1;
      if (parseInt(seasonNumber) === 1) {
        return data;
      } else {
        const query = "".concat(chineseTitle, " 第").concat(seasonNumber, "季");
        let subjects = [];
        try {
          const searchData = await fetchDoubanApi("/search?q=".concat(query));
          if (searchData.count > 0) {
            subjects = searchData.subjects;
          }
        } catch (error) {
          console.log(error);
        }
        let subject = matchSeasonSubject(subjects, chineseTitle, seasonNumber);
        if (!subject) {
          try {
            const suggestData = await fetch("".concat(DOUBAN_SUGGEST_API_URL, "?q=").concat(encodeURIComponent(query)), {
              responseType: "json"
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
      const url = DOUBAN_SUBJECT_URL.replace("{doubanId}", doubanId);
      const data = await fetch(url, {
        responseType: "text"
      });
      if (data) {
        const doubanInfo = await formatDoubanInfo(data);
        const savedIds = GM_getValue("ids_v2") || {};
        savedIds[imdbId] = __spreadValues({
          doubanId,
          updateTime: Date.now()
        }, doubanInfo);
        GM_setValue("ids_v2", savedIds);
        return doubanInfo;
      } else {
        console.log("豆瓣数据获取失败");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getSubjectTitle = async (doubanId) => {
    try {
      const { title = "" } = await fetchDoubanApi("/subject/".concat(doubanId));
      return isChinese(title) ? title.replace(/\s*第.+?季$/, "") : "";
    } catch (error) {
      console.log(error);
      return "";
    }
  };
  const getDoubanInfoByIMDB = async (imdbId) => {
    var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k;
    try {
      const doubanData = await fetchDoubanApi("/imdb/".concat(imdbId));
      const { title = "", attrs = {}, image = "", summary = "", rating = {}, alt_title: altTitle, mobile_link: mobileLink } = doubanData;
      if (!mobileLink) {
        throw new Error("豆瓣API未返回条目");
      }
      const subjectLink = mobileLink.replace("m.douban.com/movie", "movie.douban.com").replace(/\/$/, "");
      const doubanId = (_b2 = (_a2 = subjectLink.match(/subject\/(\d+)/)) == null ? void 0 : _a2[1]) != null ? _b2 : "";
      let chineseTitle = title;
      if (!isChinese(title) && !title.match(/^\d+$/)) {
        chineseTitle = altTitle ? altTitle.split("/")[0].trim() : await getSubjectTitle(doubanId) || title;
      }
      const doubanInfo = {
        director: (_c2 = attrs.director) == null ? void 0 : _c2.join(" / "),
        runtime: (_d = attrs.movie_duration) == null ? void 0 : _d.join(" / "),
        language: (_e = attrs.language) == null ? void 0 : _e.join(" / "),
        genre: (_g = (_f = attrs.movie_type) == null ? void 0 : _f.join(" / ")) != null ? _g : "",
        aka: altTitle || "",
        region: (_h = attrs.country) == null ? void 0 : _h.join(" / "),
        link: subjectLink,
        poster: getLargePoster(image),
        summary,
        chineseTitle,
        votes: (_i = rating.numRaters) != null ? _i : 0,
        average: formatAverage(rating.average),
        id: doubanId,
        episodes: (_k = (_j = attrs.episodes) == null ? void 0 : _j.join(" / ")) != null ? _k : ""
      };
      if (!attrs.episodes) {
        const savedIds = GM_getValue("ids_v2") || {};
        savedIds[imdbId] = __spreadValues({
          doubanId,
          updateTime: Date.now()
        }, doubanInfo);
        GM_setValue("ids_v2", savedIds);
      }
      return doubanInfo;
    } catch (error) {
      console.log(error);
    }
  };
  const getDoubanInfoBySubject = async (doubanId) => {
    try {
      const doubanData = await fetchDoubanApi("/subject/".concat(doubanId));
      if (!(doubanData == null ? void 0 : doubanData.id)) {
        throw new Error("豆瓣API未返回条目");
      }
      const {
        title = "",
        aka = [],
        images = {},
        summary = "",
        rating = {},
        ratings_count: votes,
        genres = [],
        countries = [],
        directors = []
      } = doubanData;
      return {
        director: directors.map((item) => item.name).join(" / "),
        runtime: "",
        language: "",
        genre: genres.join(" / "),
        aka: aka.join(" / "),
        region: countries.join(" / "),
        link: "https://movie.douban.com/subject/".concat(doubanData.id),
        poster: getLargePoster(images.large),
        summary,
        chineseTitle: title,
        votes: votes != null ? votes : 0,
        average: formatAverage(rating.average),
        id: doubanData.id
      };
    } catch (error) {
      console.log(error);
    }
  };
  const getDoubanInfoFallback = async (imdbId) => {
    let subject = await getDoubanId(imdbId);
    if (!(subject == null ? void 0 : subject.id)) {
      subject = await getDoubanIdByIMDB(imdbId).catch((error) => console.log(error));
    }
    if (!(subject == null ? void 0 : subject.id)) {
      return;
    }
    const doubanInfo = await getDoubanInfo(subject.id, imdbId);
    return doubanInfo && __spreadProps(__spreadValues({}, doubanInfo), { id: subject.id });
  };
  const formatDoubanInfo = async (domString) => {
    var _a2, _b2;
    const dom = new DOMParser().parseFromString(domString, "text/html");
    const chineseTitle = $("title", dom).text().replace("(豆瓣)", "").trim();
    const ldJson = $('head > script[type="application/ld+json"]', dom).html();
    if (!ldJson) {
      throw new Error("豆瓣条目页面解析失败，可能触发了豆瓣安全验证");
    }
    const jsonData = JSON.parse(ldJson.replace(/(\r\n|\n|\r|\t)/gm, ""));
    const fetchAnchor = function(anchor) {
      var _a3, _b3, _c2, _d;
      return (_d = (_c2 = (_b3 = (_a3 = anchor == null ? void 0 : anchor[0]) == null ? void 0 : _a3.nextSibling) == null ? void 0 : _b3.nodeValue) == null ? void 0 : _c2.trim()) != null ? _d : "";
    };
    const rating = jsonData.aggregateRating ? jsonData.aggregateRating.ratingValue : 0;
    const votes = jsonData.aggregateRating ? jsonData.aggregateRating.ratingCount : 0;
    const director = jsonData.director ? jsonData.director : [];
    const poster = getLargePoster(jsonData.image);
    const link = "https://movie.douban.com".concat(jsonData.url);
    const introductionDom = $('#link-report > span.all.hidden,#link-report-intra > [property="v:summary"], #link-report > [property="v:summary"]', dom);
    const summary = (introductionDom.length > 0 ? introductionDom.text() : "暂无相关剧情介绍").split("\n").map((a) => a.trim()).filter((a) => a.length > 0).join("\n");
    const genre = $('#info span[property="v:genre"]', dom).map(function() {
      return $(this).text().trim();
    }).toArray();
    const language = fetchAnchor($('#info span.pl:contains("语言")', dom));
    const region = fetchAnchor($('#info span.pl:contains("制片国家/地区")', dom));
    const runtimeAnchor = $('#info span.pl:contains("单集片长")', dom);
    const runtime = runtimeAnchor[0] ? fetchAnchor(runtimeAnchor) : $('#info span[property="v:runtime"]', dom).text().trim();
    const akaAnchor = $('#info span.pl:contains("又名")', dom);
    let aka = [];
    if (akaAnchor.length > 0) {
      aka = fetchAnchor(akaAnchor).split(" / ").sort(function(a, b) {
        return a.localeCompare(b);
      }).join("/");
      aka = aka.split("/");
    }
    return {
      director: director.map((item) => item.name),
      runtime,
      language,
      genre: (_a2 = genre == null ? void 0 : genre.join(" / ")) != null ? _a2 : "",
      aka: (_b2 = aka == null ? void 0 : aka.join(" / ")) != null ? _b2 : "",
      region,
      link,
      poster,
      summary,
      chineseTitle,
      votes,
      average: rating
    };
  };
  const getTorrentTitle = () => {
    let { titleDom } = CURRENT_SITE_INFO;
    if (!titleDom) {
      if (CURRENT_SITE_NAME === "BHD") {
        titleDom = $(".dotborder").find("td:contains(Name)").next("td");
      } else if (CURRENT_SITE_NAME.match(/ACM|BLU/)) {
        const keyMap = {
          Name: "Name",
          名称: "Name",
          名稱: "Name"
        };
        $("#vue+.panel table tr").each((index, element) => {
          const key = $(element).find("td:first").text().replace(/\s|\n/g, "");
          if (keyMap[key]) {
            titleDom = $(element).find("td:last");
          }
        });
      } else if (CURRENT_SITE_NAME === "HDT") {
        return document.title.replace(/HD-Torrents.org\s*-/ig, "").trim();
      }
    }
    return $(titleDom).text();
  };
  const createDoubanDom = async (doubanId, imdbId, doubanInfo, link) => {
    const div = document.createElement("div");
    let { doubanContainerDom, insertDomSelector, siteName, poster } = CURRENT_SITE_INFO;
    if (siteName.match(/(HDT)$/)) {
      insertDomSelector = $(insertDomSelector).parent();
    }
    $(insertDomSelector).before(doubanContainerDom);
    const doubanLink = link || "https://movie.douban.com/subject/".concat(doubanId);
    let htmlData = await fetch("".concat(doubanLink, "/output_card"), {
      responseType: "text"
    });
    htmlData = htmlData.replace(/wrapper/g, "douban-wrapper").replace(/<script.+?script>/g, "");
    htmlData = htmlData.replace(/(html,)body,/, "$1");
    let headDom = htmlData.match(/<head>((.|\n)+)<\/head>/)[1];
    headDom = headDom.replace(/<link.+?>/g, "");
    const bodyDom = htmlData.match(/<body>((.|\n)+)<\/body>/)[1];
    div.insertAdjacentHTML("beforeend", headDom);
    div.insertAdjacentHTML("beforeend", bodyDom);
    $(".douban-dom").append(div).attr("douban-link", doubanLink);
    $(".douban-dom .grid-col4").after('\n  <div class="fix-col grid-col3">\n  <div class="line-wrap">\n  </div>\n  </div>\n  <div class="fix-col grid-col5"></div>');
    const doubanData = doubanInfo || await getDoubanInfo(doubanId, imdbId);
    $(".douban-dom .grid-col5").html('<div class="summary">'.concat((doubanData == null ? void 0 : doubanData.summary) || "暂无简介", "</div>"));
    let posterStyle = $(".picture-douban-wrapper").attr("style");
    const posterImg = (doubanData == null ? void 0 : doubanData.poster) || $(poster).attr("src") || "";
    posterStyle = posterStyle == null ? void 0 : posterStyle.replace(/\(.+\)/, "(".concat(posterImg, ")"));
    $(".picture-douban-wrapper").attr("style", posterStyle);
    $(".douban-dom").click(() => {
      GM_openInTab(doubanLink);
    });
  };
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
    const host2 = (anchor.closest("h2") || anchor).parentNode;
    if (!host2 || !host2.parentNode || document.querySelector(".douban-title-line")) {
      return true;
    }
    const rawTitle = (document.title.split(" :: ")[0] || "").trim();
    const titleYear = rawTitle.match(/\((\d{4})\)\s*$/);
    const nativeTitle = rawTitle.replace(/\s*\(\d{4}\)\s*$/, "");
    const airedRow = Array.prototype.find.call(
      document.querySelectorAll("tr"),
      (row) => /First Aired/i.test(row.textContent)
    );
    const airedYear = airedRow && airedRow.textContent.match(/\b(?:19|20)\d{2}\b/);
    const year = airedYear && airedYear[0] || titleYear && titleYear[1] || "";
    const titleDuplicated = isSameTitle(chineseTitle, nativeTitle);
    const titleText = titleDuplicated && year && !matchTrailingYear(chineseTitle) ? "".concat(chineseTitle, " (").concat(year, ")") : chineseTitle;
    const titleHtml = addTitleLineHtml.replace(/\{link\}/g, doubanLink).replace(/\{title\}/g, titleText).replace(/\{nativeTitle\}/g, titleDuplicated ? "" : year ? "".concat(nativeTitle, " (").concat(year, ")") : nativeTitle).replace(/\s+<\/a>/, "</a>");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = titleHtml;
    host2.parentNode.insertBefore(wrapper.firstChild, host2.nextSibling);
    return true;
  };
  const addDoubanSummaryTab = (doubanData) => {
    const { addSummaryTab, addSummaryTabIcon } = CURRENT_SITE_INFO;
    const summary = doubanData.summary && doubanData.summary !== "暂无相关剧情介绍" && isChinese(doubanData.summary) ? doubanData.summary : "";
    if (!addSummaryTab || !summary) {
      return false;
    }
    const tabs = document.querySelector(addSummaryTab);
    if (!tabs) {
      return false;
    }
    const panelId = "douban-summary-panel";
    if (document.getElementById(panelId)) {
      return true;
    }
    const nav = tabs.querySelector("ul.ui-tabs-nav");
    if (!nav) {
      return false;
    }
    const li = document.createElement("li");
    li.className = "ui-state-default ui-corner-left";
    li.innerHTML = '<a href="#'.concat(panelId, '" target="_self" title="豆瓣简介"><img src="').concat(addSummaryTabIcon, '" width="17" height="17" alt="Douban"></a>');
    nav.insertBefore(li, nav.firstChild);
    const panel = document.createElement("div");
    panel.id = panelId;
    panel.className = "ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide";
    const text = document.createElement("div");
    text.className = "douban-summary-tab-text";
    text.textContent = summary;
    panel.appendChild(text);
    tabs.appendChild(panel);
    const nativeLis = Array.prototype.filter.call(nav.children, (item) => item !== li);
    const nativePanels = Array.prototype.filter.call(tabs.querySelectorAll(".ui-tabs-panel"), (item) => item !== panel);
    nativeLis.forEach((item) => item.classList.remove("ui-tabs-selected", "ui-state-active"));
    nativePanels.forEach((item) => item.classList.add("ui-tabs-hide"));
    li.classList.add("ui-tabs-selected", "ui-state-active");
    panel.classList.remove("ui-tabs-hide");
    const anchor = li.querySelector("a");
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      nativeLis.forEach((item) => item.classList.remove("ui-tabs-selected", "ui-state-active"));
      nativePanels.forEach((item) => item.classList.add("ui-tabs-hide"));
      li.classList.add("ui-tabs-selected", "ui-state-active");
      panel.classList.remove("ui-tabs-hide");
    });
    nativeLis.forEach((item) => {
      const nativeAnchor = item.querySelector("a");
      if (nativeAnchor) {
        nativeAnchor.addEventListener("click", () => {
          setTimeout(() => {
            li.classList.remove("ui-tabs-selected", "ui-state-active");
            panel.classList.add("ui-tabs-hide");
          }, 0);
        });
      }
    });
    return true;
  };
  const matchTrailingYear = (text = "") => String(text).match(/\(\s*((?:19|20)\d{2})\s*\)\s*$/);
  const parseTitleForCompare = (text = "") => {
    const raw = String(text).trim();
    const year = matchTrailingYear(raw);
    const withoutYear = year ? raw.slice(0, raw.length - year[0].length) : raw;
    return {
      key: withoutYear.toLowerCase().replace(/[^0-9a-z\u4e00-\u9fa5]+/g, ""),
      year: year ? year[1] : ""
    };
  };
  const isSameTitle = (left, right) => {
    const a = parseTitleForCompare(left);
    const b = parseTitleForCompare(right);
    if (!a.key || !b.key || a.key !== b.key) {
      return false;
    }
    return !a.year || !b.year || a.year === b.year;
  };
  const appendYearToTitleLink = (link, year) => {
    if (!link || !year || matchTrailingYear(link.textContent)) {
      return;
    }
    link.appendChild(document.createTextNode(" (".concat(year[1], ")")));
  };
  const dedupeTitleHtml = (titleHtml, siteTitleText) => {
    const holder = document.createElement("div");
    holder.innerHTML = titleHtml;
    const kept = holder.querySelector(".douban-title-link");
    const keptText = ((kept == null ? void 0 : kept.textContent) || "").trim();
    const siteText = (siteTitleText || "").trim();
    if (!kept || !keptText || !siteText || !isSameTitle(keptText, siteText)) {
      return { html: titleHtml, duplicated: false };
    }
    appendYearToTitleLink(kept, matchTrailingYear(siteText));
    return { html: holder.innerHTML, duplicated: true };
  };
  const dedupePrependedTitle = (hostSelector, chineseTitle) => {
    const host2 = $(hostSelector).first()[0];
    if (!host2 || !chineseTitle) {
      return;
    }
    const textNode = Array.prototype.find.call(
      host2.childNodes,
      (node) => node.nodeType === 3 && node.textContent.trim()
    );
    const siteText = ((textNode == null ? void 0 : textNode.textContent) || "").trim();
    if (!siteText || !isSameTitle(siteText, chineseTitle)) {
      return;
    }
    appendYearToTitleLink(host2.querySelector('a[target="_blank"]'), matchTrailingYear(siteText));
    textNode.remove();
  };
  const replaceNativeInfo = (doubanData, doubanLink, titleLink = doubanLink) => {
    var _a2;
    const {
      addTitleAfter,
      addTitleBefore,
      addTitleInside,
      addTitleHtml,
      addTitleYearFrom,
      replaceOverview,
      replaceOverviewLabel,
      replaceRating,
      replaceRatingHtml,
      replaceRatingPosition,
      renameRatingLabel,
      starFullHtml,
      starEmptyHtml,
      ratingSourceLabel,
      ratingRewriteHtml,
      removeRatingVotes,
      groupRating,
      addLinkButtonAfter,
      addLinkButtonHtml,
      addTitleLineAfter,
      addSummaryTab
    } = CURRENT_SITE_INFO;
    if (!doubanData || !(addTitleAfter || addTitleBefore || addTitleInside || addTitleLineAfter || addSummaryTab || replaceOverview || replaceOverviewLabel)) {
      return false;
    }
    if (document.documentElement.dataset.doubanInserted) {
      return true;
    }
    const score = doubanData.average;
    const votes = (_a2 = doubanData.votes) != null ? _a2 : 0;
    const votesComma = String(votes).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const chineseTitle = doubanData.chineseTitle;
    const summary = doubanData.summary && doubanData.summary !== "暂无相关剧情介绍" && isChinese(doubanData.summary) ? doubanData.summary : "";
    let replaced = false;
    if (addTitleLine(doubanData, doubanLink)) {
      replaced = true;
    }
    if (addTitleHtml && chineseTitle) {
      const yearSource = addTitleYearFrom ? $(addTitleYearFrom).first().text() : "";
      const yearMatched = yearSource.match(/\b(?:19|20)\d{2}\b/);
      const titleHtml = addTitleHtml.replace(/\{link\}/g, titleLink).replace(/\{title\}/g, chineseTitle).replace(/\{year\}/g, yearMatched ? " (".concat(yearMatched[0], ")") : "");
      const siteTitleText = $(addTitleInside || addTitleAfter || addTitleBefore).first().text();
      const { html: mergedTitleHtml, duplicated } = dedupeTitleHtml(titleHtml, siteTitleText);
      if (addTitleInside) {
        const host2 = $(addTitleInside).first()[0];
        if (host2) {
          const link = $(mergedTitleHtml)[0];
          const lastText = host2.lastChild && host2.lastChild.nodeType === 3 ? host2.lastChild : Array.prototype.find.call(
            host2.childNodes,
            (node) => node.nodeType === 3 && node.textContent.trim()
          );
          const yearMatched2 = lastText && lastText.nodeType === 3 && lastText.textContent.match(/^([\s\S]*?)(\s*\(\d{4}\)\s*)$/);
          const titleParent = lastText && lastText.nodeType === 3 ? lastText.parentNode : null;
          if (duplicated) {
            if (host2.tagName === "A") {
              host2.parentNode.insertBefore(link, host2.nextSibling);
              host2.remove();
            } else if (titleParent) {
              titleParent.insertBefore(link, lastText.nextSibling);
              lastText.remove();
            } else {
              host2.appendChild(link);
            }
          } else if (titleParent) {
            if (yearMatched2) {
              lastText.textContent = "".concat(yearMatched2[1].replace(/\s+$/, ""), " ");
              titleParent.insertBefore(link, lastText.nextSibling);
              titleParent.insertBefore(document.createTextNode(" ".concat(yearMatched2[2].trim())), link.nextSibling);
            } else {
              let after = lastText;
              if (!/\s$/.test(lastText.textContent)) {
                const space = document.createTextNode(" ");
                titleParent.insertBefore(space, lastText.nextSibling);
                after = space;
              }
              titleParent.insertBefore(link, after.nextSibling);
            }
          } else {
            host2.appendChild(link);
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
          if (duplicated) {
            $titleAnchor.remove();
          }
          replaced = true;
        }
      }
    }
    if (replaceOverview && summary) {
      const $overview = $(replaceOverview).first();
      if ($overview.length) {
        const original = $overview.text().trim();
        $overview.text(summary).attr("title", original);
        replaced = true;
      }
    }
    if (replaceOverviewLabel && summary) {
      const label = Array.prototype.find.call(
        document.querySelectorAll("font,strong,b,span,td"),
        (element) => element.children.length === 0 && element.textContent.trim() === replaceOverviewLabel
      );
      if (label) {
        let node = label.nextSibling;
        while (node && !(node.nodeType === 3 && node.textContent.trim())) {
          node = node.nextSibling;
        }
        if (!node && label.parentNode && label.parentNode !== document.body) {
          node = label.parentNode.nextSibling;
          while (node && !(node.nodeType === 3 && node.textContent.trim())) {
            node = node.nextSibling;
          }
        }
        if (node) {
          node.textContent = " ".concat(summary, " ");
          replaced = true;
        }
      }
    }
    if (replaceRating && score && replaceRatingHtml) {
      let $rating = $(replaceRating).first();
      if ($rating.length) {
        if (ratingRewriteHtml) {
          const ratingNode = $rating[0];
          let siteScore = ratingNode.getAttribute("alt") || "";
          const ratingTrailing = ratingNode.nextSibling;
          if (!siteScore && ratingTrailing && ratingTrailing.nodeType === 3) {
            siteScore = ratingTrailing.textContent.trim();
          }
          siteScore = siteScore.replace(/\/\s*10\s*$/, "").trim();
          let siteVotes = "";
          if (removeRatingVotes) {
            const $votesLabel = $(removeRatingVotes).first();
            const votesLabel = $votesLabel[0];
            const votesText = votesLabel && votesLabel.nextSibling;
            if (votesText && votesText.nodeType === 3 && /\d/.test(votesText.textContent)) {
              const votesParent = votesLabel.parentNode;
              const afterLabel = votesText.nextSibling;
              siteVotes = votesText.textContent.trim().replace(/,/g, "");
              votesParent.removeChild(votesText);
              votesParent.removeChild(votesLabel);
              if (afterLabel && afterLabel.nodeType === 1 && afterLabel.nodeName === "BR") {
                votesParent.removeChild(afterLabel);
              }
            }
          }
          const siteVotesComma = siteVotes ? Number(siteVotes).toLocaleString("en-US") : "";
          const $rewritten = $(ratingRewriteHtml.replace(/\{siteScore\}/g, siteScore).replace(/\{siteVotes\}/g, siteVotes).replace(/\{siteVotesComma\}/g, siteVotesComma));
          $rewritten.insertBefore($rating);
          $rating.remove();
          if (ratingTrailing && ratingTrailing.nodeType === 3 && ratingTrailing.parentNode) {
            ratingTrailing.parentNode.removeChild(ratingTrailing);
          }
          $rating = $rewritten;
        }
        if (renameRatingLabel) {
          const $label = $rating.find("th, td").filter((index, element) => /^\s*Rating\b/i.test(element.textContent)).first();
          if ($label.length) {
            const $bold = $label.find("b, strong").first();
            if ($bold.length) {
              $bold.text(renameRatingLabel);
            } else {
              $label.text(renameRatingLabel);
            }
          }
        }
        if (ratingSourceLabel) {
          const $icon = $rating.find("img").first();
          if ($icon.length) {
            $icon.after(" ".concat(ratingSourceLabel));
          }
        }
        const scorePercent = /^\d+(?:\.\d+)?$/.test(String(score)) ? "".concat(Math.round(parseFloat(score) * 10), "%") : "0%";
        const scoreWidth = /^\d+(?:\.\d+)?$/.test(String(score)) ? "".concat(Math.round(parseFloat(score) * 20), "px") : "0px";
        let ratingHtml = replaceRatingHtml.replace(/\{link\}/g, doubanLink).replace(/\{score\}/g, score).replace(/\{scorePercent\}/g, scorePercent).replace(/\{scoreWidth\}/g, scoreWidth).replace(/\{votesComma\}/g, votesComma);
        if (starFullHtml && starEmptyHtml) {
          const fullStars = Math.max(0, Math.min(10, Math.round(parseFloat(score))));
          let stars = "";
          for (let star = 0; star < 10; star++) {
            stars += star < fullStars ? starFullHtml : starEmptyHtml;
          }
          ratingHtml = ratingHtml.replace(/\{stars\}/g, stars);
        }
        ratingHtml = ratingHtml.replace(/\{votes\}/g, votes);
        const $ratingFirst = $rating.first();
        const $ratingLast = $rating.last();
        if (groupRating) {
          const $group = $('<div class="douban-rating-group"></div>');
          $group.insertBefore($ratingFirst);
          $group.append($rating).append(ratingHtml);
        } else if (replaceRatingPosition === "before") {
          $ratingFirst.before(ratingHtml);
        } else {
          $ratingLast.after(ratingHtml);
        }
        replaced = true;
      }
    }
    if (addDoubanSummaryTab(doubanData)) {
      replaced = true;
    }
    if (addLinkButtonAfter && addLinkButtonHtml) {
      const $button = $(addLinkButtonAfter).first();
      if ($button.length) {
        $button.after(addLinkButtonHtml.replace(/\{link\}/g, doubanLink));
        replaced = true;
      }
    }
    if (replaced) {
      document.documentElement.dataset.doubanInserted = "1";
    }
    return replaced;
  };
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
  const LIST_SEARCH_CACHE_KEY = "douban_list_v1";
  const LIST_CACHE_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1e3;
  const LIST_SEARCH_CONCURRENCY = 5;
  const LIST_REQUEST_INTERVAL = 400;
  const LIST_RETRY_DELAY = 1500;
  const createRequestGate = (interval) => {
    let nextSlot = 0;
    return async () => {
      const now = Date.now();
      const slot = Math.max(now, nextSlot);
      nextSlot = slot + interval;
      if (slot > now) {
        await new Promise((resolve) => setTimeout(resolve, slot - now));
      }
    };
  };
  const waitListRequestSlot = createRequestGate(LIST_REQUEST_INTERVAL);
  const LIST_DETAIL_INTERVAL = 400;
  const waitListDetailSlot = createRequestGate(LIST_DETAIL_INTERVAL);
  let listTmdbMerge = null;
  let listTmdbPoster = null;
  let listTmdbSeasonCount = null;
  const setListTmdb = (helper) => {
    listTmdbMerge = typeof (helper == null ? void 0 : helper.merge) === "function" ? helper.merge : null;
    listTmdbPoster = typeof (helper == null ? void 0 : helper.poster) === "function" ? helper.poster : null;
    listTmdbSeasonCount = typeof (helper == null ? void 0 : helper.seasonCount) === "function" ? helper.seasonCount : null;
  };
  const mergeListTmdb = async (data, imdbId, release = null) => {
    var _a2;
    if (!listTmdbMerge || !imdbId && !((_a2 = release == null ? void 0 : release.queries) == null ? void 0 : _a2.length) && !(release == null ? void 0 : release.name)) {
      return data;
    }
    try {
      return await listTmdbMerge(data, imdbId, release) || data;
    } catch (error) {
      console.log(error);
      return data;
    }
  };
  const toListDetail = (subject) => ({
    title: subject.title || "",
    originalTitle: subject.originalTitle || "",
    year: subject.year || "",
    subtype: subject.subtype || "",
    poster: subject.poster || "",
    posterFallback: subject.posterFallback || subject.posterRaw || "",
    summary: subject.summary || "",
    genres: Array.isArray(subject.genres) ? subject.genres : [],
    countries: Array.isArray(subject.countries) ? subject.countries : [],
    rating: parseFloat(subject.rating) || 0,
    votes: parseInt(subject.votes, 10) || 0,
    ratingSource: subject.ratingSource || "",
    episodesCount: parseInt(subject.episodesCount, 10) || 0
  });
  const mergeListSubject = async (subject, imdbId, release = null) => {
    const base = subject ? __spreadProps(__spreadValues(__spreadValues({}, toListDetail(subject)), subject.id ? { id: subject.id } : {}), {
      chineseTitle: subject.title
    }) : null;
    const merged = await mergeListTmdb(base, imdbId, release) || base;
    if (!merged) {
      return null;
    }
    const title = merged.chineseTitle || (subject == null ? void 0 : subject.title) || "";
    return __spreadProps(__spreadValues({}, toListDetail(__spreadProps(__spreadValues({}, merged), { title }))), {
      title,
      id: merged.id || "",
      chineseTitle: merged.chineseTitle || "",
      tmdbUrl: merged.tmdbUrl || "",
      titleSource: merged.titleSource || "",
      // 豆瓣没有条目时整份数据来自 TMDB，编号与媒体类型留着取该季总集数
      tmdbId: merged.tmdbId || "",
      mediaType: merged.mediaType || ""
    });
  };
  const fetchDoubanListApi = async (path, allowRetry = true, detailGate = false) => {
    await (detailGate ? waitListDetailSlot() : waitListRequestSlot());
    try {
      return await fetchDoubanApi(path);
    } catch (error) {
      if (!allowRetry || (error == null ? void 0 : error.status) === 404) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, LIST_RETRY_DELAY));
      return fetchDoubanListApi(path, false, detailGate);
    }
  };
  const RELEASE_TECH_PATTERN = new RegExp("\\b(?:".concat([
    "Blu-?Ray",
    "BRRip",
    "BDRip",
    "DVDRip",
    "DVD",
    "HDTV",
    "PDTV",
    "WEB-?DL",
    "WEB-?Rip",
    "REMUX",
    "UHD",
    "HDRip",
    "HDRIp",
    "PROPER",
    "REPACK",
    "COMPLETE",
    "AMZN",
    "NF",
    "HULU",
    "DSNP",
    "ATVP",
    "HMAX",
    "CRAV",
    "PCOK",
    "iTunes",
    "HEVC",
    "AVC",
    "x26[45]",
    "H26[45]",
    "VC-?1",
    "TrueHD",
    "DTS(?:-HD)?(?: ?MA)?",
    "DDP\\d?",
    "DD\\+?",
    "Atmos",
    "FLAC",
    "AAC",
    "EAC3",
    "LPCM",
    "OPUS",
    "HDR\\d*\\+?",
    "Do?Vi(?:sion)?\\d*",
    "DV\\d*",
    "SDR",
    "10bit",
    "8bit",
    // 分辨率只列真实出现过的档位（不按任意四位数匹配，避免吃掉片名里的 2049 这类数字），
    // 后缀 p/i 可选：HDS 写的是不带后缀的 2160
    "(?:480|576|720|1080|2160|4320)[pi]?",
    "\\d+x\\d+",
    // 混合版（HDT 的固定标签）；EXTENDED 这类版本词不列，片名本身可能带这些词
    "HYBRID",
    "[48]K",
    "S\\d{1,3}(?:E\\d{1,3})?(?:-E?\\d{1,3})?",
    "E\\d{1,3}"
  ].join("|"), ")"), "i");
  const RELEASE_SEASON_PATTERN = /S(\d{1,3})(?:[-\s]?E(\d{1,4})(?:[-\s]?E\d{1,3})*)?(?![a-z0-9])|Season\s+(\d{1,3})(?:\s+Episode\s+(\d{1,3}))?/i;
  const stripSeasonSuffix = (title) => (title || "").replace(/\s*第[一二三四五六七八九十百\d]+季.*$/, "").trim();
  const isSpecialSubject = (item) => /特典|OVA|特別篇|特别篇|短片|饭制|花絮/.test(item.title || "");
  let listSearchCache = null;
  const getListSearchCache = () => {
    if (!listSearchCache) {
      listSearchCache = GM_getValue(LIST_SEARCH_CACHE_KEY) || {};
    }
    return listSearchCache;
  };
  const parseReleaseTitle = (rawTitle) => {
    const text = String(rawTitle || "").replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "").replace(/\b([hx])[._]?(26[45])\b/gi, "$1$2").replace(/[._]+/g, " ").replace(/\s+/g, " ").trim();
    if (!text) {
      return null;
    }
    const tokens = text.split(" ");
    const toTokenIndex = (charIndex) => text.slice(0, charIndex).split(" ").length - 1;
    const seasonMatched = text.match(RELEASE_SEASON_PATTERN);
    const season = seasonMatched ? parseInt(seasonMatched[1] || seasonMatched[3], 10) : 0;
    const episode = seasonMatched ? parseInt(seasonMatched[2] || seasonMatched[4] || "0", 10) : 0;
    const seasonIndex = seasonMatched ? toTokenIndex(seasonMatched.index) : -1;
    const techMatched = text.match(RELEASE_TECH_PATTERN);
    const techIndex = techMatched ? toTokenIndex(techMatched.index) : tokens.length;
    let nameTokens = tokens.slice(0, seasonIndex >= 0 ? Math.min(seasonIndex, techIndex) : techIndex);
    let year = "";
    for (let index = nameTokens.length - 1; index > 0; index--) {
      const bareToken = nameTokens[index].replace(/^[[({<]+|[)\]}>:,;]+$/g, "");
      if (/^(?:19|20)\d{2}$/.test(bareToken)) {
        year = bareToken;
        nameTokens = nameTokens.slice(0, index);
        break;
      }
    }
    const name = nameTokens.join(" ").replace(/[\s\-–—:;,]+$/, "").trim();
    if (!name) {
      return null;
    }
    const akaParts = name.split(/\s+AKA\s+/i).map((part) => part.trim()).filter(Boolean);
    const queries = akaParts.flatMap((part) => {
      const slashParts = part.split(/\s*\/\s*/).map((item) => item.trim()).filter(Boolean);
      return slashParts.length > 1 && slashParts.some((item) => /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(item)) ? slashParts : [part];
    });
    return { name, queries, year, season, episode };
  };
  const normalizeTitle = (title) => String(title || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
  const searchDoubanSubjects = async (query) => {
    var _a2;
    const cache = getListSearchCache();
    const cached = cache[query];
    if (cached && Date.now() - cached.updateTime < LIST_CACHE_EXPIRE_TIME) {
      return cached.subjects;
    }
    try {
      const data = await fetchDoubanListApi("/search?q=".concat(encodeURIComponent(query)));
      const subjects = ((_a2 = data == null ? void 0 : data.subjects) != null ? _a2 : []).map((item) => {
        var _a3, _b2, _c2;
        const posterUrl = ((_a3 = item.images) == null ? void 0 : _a3.large) || ((_b2 = item.images) == null ? void 0 : _b2.medium) || ((_c2 = item.images) == null ? void 0 : _c2.small) || "";
        return {
          id: item.id,
          title: item.title || "",
          originalTitle: item.original_title || "",
          year: item.year || "",
          subtype: item.subtype || "",
          // 接口给的海报实际是小图，换成大图才清晰；原地址留作加载失败时的回退
          poster: getLargePoster(posterUrl),
          posterRaw: posterUrl
        };
      }).filter((item) => item.id);
      subjects.forEach((item) => {
        if (item.poster) {
          cache["poster:".concat(item.id)] = { poster: item.poster, raw: item.posterRaw, updateTime: Date.now() };
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
  const getSubjectDetail = async (doubanId, imdbId = "", detailGate = false, release = null) => {
    var _a2, _b2, _c2;
    if (!doubanId) {
      return null;
    }
    const cache = getListSearchCache();
    const cacheKey = "detail:".concat(doubanId);
    const cached = cache[cacheKey];
    const applyTmdb = async (detail) => detail ? mergeListSubject(detail, imdbId, release) : detail;
    if (cached && Date.now() - cached.updateTime < LIST_CACHE_EXPIRE_TIME) {
      return applyTmdb(cached.detail);
    }
    try {
      const data = await fetchDoubanListApi("/subject/".concat(doubanId), true, detailGate);
      if (!data || !data.id && !data.title) {
        return null;
      }
      const images = data.images || {};
      const cachedPoster = cache["poster:".concat(doubanId)] || {};
      const posterUrl = images.large || images.medium || images.small || cachedPoster.raw || cachedPoster.poster || "";
      const detail = {
        title: data.title || "",
        originalTitle: data.original_title || "",
        year: data.year || "",
        subtype: data.subtype || "",
        // 接口返回的海报实际是小图，换成大图才清晰；原地址留作加载失败时的回退
        poster: getLargePoster(posterUrl),
        posterFallback: posterUrl,
        summary: (data.summary || "").trim(),
        genres: Array.isArray(data.genres) ? data.genres.filter(Boolean) : [],
        countries: Array.isArray(data.countries) ? data.countries.filter(Boolean) : [],
        rating: parseFloat((_a2 = data.rating) == null ? void 0 : _a2.average) || 0,
        votes: parseInt((_c2 = data.ratings_count) != null ? _c2 : (_b2 = data.rating) == null ? void 0 : _b2.numRaters, 10) || 0,
        episodesCount: parseInt(data.episodes_count, 10) || 0
      };
      cache[cacheKey] = { detail, updateTime: Date.now() };
      GM_setValue(LIST_SEARCH_CACHE_KEY, cache);
      return applyTmdb(detail);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const getSubjectByImdb = async (imdbId) => {
    var _a2;
    const cache = getListSearchCache();
    const cacheKey = "imdb:".concat(imdbId);
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.updateTime < LIST_CACHE_EXPIRE_TIME) {
      return cached.subject;
    }
    try {
      const { id: idUrl } = await fetchDoubanListApi("/imdb/".concat(imdbId));
      const doubanId = (_a2 = String(idUrl || "").match(/(?:movie|subject)\/(\d+)/)) == null ? void 0 : _a2[1];
      if (!doubanId) {
        return null;
      }
      const detail = await getSubjectDetail(doubanId);
      if (!detail) {
        return { missing: true };
      }
      const subject = __spreadProps(__spreadValues({}, detail), { id: doubanId });
      cache[cacheKey] = { subject, updateTime: Date.now() };
      GM_setValue(LIST_SEARCH_CACHE_KEY, cache);
      return subject;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const pickListSubject = (subjects, release, fuzzy = false) => {
    if (!subjects.length) {
      return null;
    }
    if (fuzzy) {
      return subjects.find((item) => release.year && String(item.year) === String(release.year)) || subjects[0];
    }
    const name = normalizeTitle(release.name);
    const aliasNames = (release.queries || []).map((query) => normalizeTitle(query)).filter((normalized) => normalized.length > 2 && normalized !== name);
    const yearHit = (item) => release.year && String(item.year) === String(release.year);
    const nonLatinHit = (item) => /[^\x20-\x7e]/.test(item.originalTitle || "");
    const nameHit = (item) => {
      const original = item.originalTitle || "";
      if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(original)) {
        return false;
      }
      const normalized = normalizeTitle(original);
      return normalized.length >= 2 && normalized === name || aliasNames.includes(normalized);
    };
    const seasonMarkers = release.season ? ["第".concat(release.season, "季"), "第".concat(numberToChinese(release.season), "季")] : [];
    const seasonHit = (item) => seasonMarkers.some((marker) => (item.title || "").includes(marker));
    const kindHit = (item) => release.season ? item.subtype !== "movie" : item.subtype !== "tv";
    const nameRelated = (item) => {
      const original = item.originalTitle || "";
      if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(original)) {
        return true;
      }
      const normalized = normalizeTitle(original);
      return normalized.length > 2 && (name.includes(normalized) || normalized.includes(name) || aliasNames.some((alias) => alias.includes(normalized) || normalized.includes(alias)));
    };
    const nameMatched = subjects.some(nameHit);
    if (release.season) {
      const seasonCandidates = subjects.filter((item) => kindHit(item) && !isSpecialSubject(item));
      const seasonOnly = seasonCandidates.filter(seasonHit);
      return subjects.find((item) => seasonHit(item) && nameHit(item)) || subjects.find((item) => seasonHit(item) && yearHit(item)) || (seasonOnly.length === 1 && nameRelated(seasonOnly[0]) ? seasonOnly[0] : null) || subjects.find((item) => nameHit(item) && kindHit(item)) || subjects.find((item) => yearHit(item) && kindHit(item)) || // 豆瓣把原始片名写成中文/日文时（如 妄想代理人），英文片名相等的条目只是同名电影，
      // 这时若剧集条目只有一条，它就是目标作品；有多条时区分不出是哪一季，保持原样。
      // 原始片名是拉丁文字却与资源片名无关的同样是别家剧集
      // （如 Road Wars 会搜回 1989 年的《战争之路》），不能要
      (nameMatched && seasonCandidates.length === 1 && nameRelated(seasonCandidates[0]) ? seasonCandidates[0] : null);
    }
    const titleHit = (item) => {
      if (nonLatinHit(item)) {
        return true;
      }
      const original = normalizeTitle(item.originalTitle);
      return original.length > 2 && name.includes(original);
    };
    return subjects.find((item) => nameHit(item) && kindHit(item) && yearHit(item)) || subjects.find((item) => nameHit(item) && kindHit(item)) || subjects.find((item) => nameHit(item)) || // 年份兜底：同年份、同类型，且原始片名对得上资源片名
    // （如 Parasite 2019 → 寄生虫、Dark Water 2002 → 鬼水怪谈）；
    // 原始片名是英文却与资源片名互不包含，说明是另一部片子，不能凭年份兜底
    // （如 What If Christmas 2026 不能错配成同年份的 What We Did at Christmas）
    subjects.find((item) => yearHit(item) && kindHit(item) && titleHit(item));
  };
  const isSameListSubject = (a, b) => {
    const titleA = stripSeasonSuffix((a == null ? void 0 : a.title) || "");
    const titleB = stripSeasonSuffix((b == null ? void 0 : b.title) || "");
    const sameTitle = !!titleA && titleA === titleB;
    const sameOriginal = !!(a == null ? void 0 : a.originalTitle) && !!(b == null ? void 0 : b.originalTitle) && normalizeTitle(a.originalTitle) === normalizeTitle(b.originalTitle);
    return sameTitle || sameOriginal;
  };
  const resolveListSubject = async (release, imdbId = "") => {
    var _a2, _b2, _c2;
    const queries = ((_a2 = release.queries) == null ? void 0 : _a2.length) ? release.queries : [release.name];
    let subject = null;
    for (const query of queries) {
      subject = pickListSubject(await searchDoubanSubjects(query), release);
      if (subject) {
        break;
      }
    }
    const yearMismatch = !release.season && !!release.year && !!(subject == null ? void 0 : subject.year) && String(subject.year) !== String(release.year);
    if (imdbId && (!subject || !isChinese(stripSeasonSuffix(subject.title)) || yearMismatch)) {
      const imdbSubject = await getSubjectByImdb(imdbId);
      if (imdbSubject == null ? void 0 : imdbSubject.missing) {
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
    const hitSeason = (_c2 = (_b2 = (subject.title || "").match(/第(.+?)季/)) == null ? void 0 : _b2[1]) != null ? _c2 : "";
    if (release.season > 1 && hitSeason && hitSeason !== String(release.season) && hitSeason !== numberToChinese(release.season)) {
      const seasonSubject = pickListSubject(
        await searchDoubanSubjects("".concat(stripSeasonSuffix(subject.title), " 第").concat(release.season, "季")),
        release
      );
      if (seasonSubject && isSameListSubject(seasonSubject, subject)) {
        subject = seasonSubject;
      }
    }
    return subject;
  };
  const getTmdbSeasonCount = async (merged, season) => {
    if (!listTmdbSeasonCount || !(merged == null ? void 0 : merged.tmdbId) || merged.mediaType !== "tv" || !season) {
      return 0;
    }
    try {
      return await listTmdbSeasonCount(merged.tmdbId, season) || 0;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
  const getSubjectEpisodeCount = async (doubanId) => {
    if (!doubanId) {
      return 0;
    }
    const detail = await getSubjectDetail(doubanId);
    return (detail == null ? void 0 : detail.episodesCount) || 0;
  };
  const formatListTitle = (subject, release, episodeCount = 0) => {
    const baseTitle = stripSeasonSuffix(subject.title);
    const year = release.year || subject.year || "";
    const yearText = year ? " (".concat(year, ")") : "";
    if (!release.season) {
      return "".concat(baseTitle).concat(yearText);
    }
    const seasonText = "第".concat(numberToChinese(release.season), "季");
    if (release.episode) {
      return "".concat(baseTitle, " ").concat(seasonText, " 第").concat(release.episode, "集").concat(yearText);
    }
    if (episodeCount > 0) {
      return "".concat(baseTitle, " ").concat(seasonText, " 全").concat(episodeCount, "集").concat(yearText);
    }
    return "".concat(baseTitle, " ").concat(seasonText).concat(yearText);
  };
  const LIST_POPUP_SHOW_DELAY = 700;
  const LIST_POPUP_HIDE_DELAY = 400;
  const LIST_POPUP_OFFSET_TOP = 299;
  const LIST_POPUP_OFFSET_LEFT = 2;
  const listPopup = { node: null, inner: null, showTimer: 0, hideTimer: 0, hoverLink: null };
  const isCardListPopup = () => {
    var _a2;
    return ((_a2 = CURRENT_SITE_INFO.listPage) == null ? void 0 : _a2.popupTheme) === "card";
  };
  const escapeListHtml = (text) => String(text != null ? text : "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
  const hideListPopup = () => {
    clearTimeout(listPopup.showTimer);
    if (listPopup.node) {
      listPopup.node.style.display = "none";
    }
  };
  const positionListPopup = (node, link) => {
    var _a2;
    const rect = link.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    let popupTop = top - LIST_POPUP_OFFSET_TOP;
    if (popupTop - window.scrollY < 0) {
      popupTop = top + (((_a2 = link.closest("tr")) == null ? void 0 : _a2.offsetHeight) || rect.height) - 12;
    }
    node.style.top = "".concat(popupTop, "px");
    node.style.left = "".concat(Math.max(rect.left + window.scrollX - LIST_POPUP_OFFSET_LEFT, 0), "px");
  };
  const getListPopup = () => {
    if (!listPopup.node || !document.body.contains(listPopup.node)) {
      const node = document.createElement("div");
      node.className = "librarydiv douban-list-popup";
      node.setAttribute("style", "z-index: 99999; position: absolute; width: 680px; height: 300px; background: transparent; display: none;");
      const inner = document.createElement("div");
      if (isCardListPopup()) {
        inner.className = "douban-list-popup-inner douban-card-inner";
        inner.setAttribute("style", 'width: 680px; position: absolute; height: 290px; box-sizing: border-box; padding: 0; overflow: hidden; background: var(--torrent-card-bg, #272727); border: 1px solid #3c3c3c; border-radius: 6px; color: var(--torrent-row-fg, #ccc); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.46667;');
      } else {
        inner.className = "libraryinner";
        inner.setAttribute("style", "width: 680px; position: absolute; height: 290px; border: 1px solid #343434; background-color: #242424; padding: 10px; border-radius: 2px;");
      }
      node.appendChild(inner);
      document.body.appendChild(node);
      node.addEventListener("mouseenter", () => clearTimeout(listPopup.hideTimer));
      node.addEventListener("mouseleave", () => {
        listPopup.hideTimer = setTimeout(hideListPopup, LIST_POPUP_HIDE_DELAY);
      });
      listPopup.node = node;
      listPopup.inner = inner;
    }
    return listPopup;
  };
  const buildCardPopupHtml = (detail, doubanUrl) => {
    const url = escapeListHtml(doubanUrl);
    const ratingBar = detail.rating ? '<div class="douban-card-head"><span class="douban-card-rating" title="豆瓣评分"><span class="douban-card-star">&#9733;</span> '.concat(detail.rating.toFixed(1), "</span></div>") : '<div class="douban-card-head"></div>';
    const posterCell = detail.poster ? '<div class="douban-list-poster-cell douban-card-poster-cell"><a href="'.concat(url, '" target="_blank" rel="noreferrer"><img class="douban-list-poster" src="').concat(escapeListHtml(detail.poster), '" referrerpolicy="unsafe-url" style="width: 110px !important; height: 164px !important; object-fit: cover; border-radius: 5px;"></a></div>') : "";
    const year = detail.year ? '<span class="douban-card-year">('.concat(escapeListHtml(detail.year), ")</span>") : "";
    const summary = detail.summary ? '<div class="douban-card-summary">'.concat(escapeListHtml(detail.summary), "</div>") : "";
    const countries = detail.countries.length ? '<div class="douban-card-countries">'.concat(detail.countries.map((country) => escapeListHtml(country)).join('<span class="douban-card-sep">|</span>'), "</div>") : "";
    const genres = detail.genres.map((genre) => '<span class="douban-card-genre">'.concat(escapeListHtml(genre), "</span>")).join("");
    return "".concat(ratingBar, '<div class="douban-card-body">').concat(posterCell, '<div class="douban-card-info">\n<div class="douban-card-title-line"><a class="douban-card-title" href="').concat(url, '" target="_blank" rel="noreferrer">').concat(escapeListHtml(detail.title), "</a>").concat(year, '</div>\n<div class="douban-card-rule"></div>\n').concat(summary).concat(countries, '<div class="douban-card-genres">').concat(genres, "</div></div></div>");
  };
  const buildListPopupHtml = (detail, doubanUrl) => {
    if (isCardListPopup()) {
      return buildCardPopupHtml(detail, doubanUrl);
    }
    const url = escapeListHtml(doubanUrl);
    const ratingRow = detail.rating ? '<div class="hd-table"><div class="bhd-td bhd-w100"><div class="rule-line" style="padding-bottom: 6px; margin-bottom: 12px;"><div class="button-holder"><div class="beta-td beta-w40 text-left"></div><div class="beta-td beta-w60 text-right"><h3 class="description_title class-standard" style="padding: 0; margin: 0; text-transform: uppercase; font-size: 12px;"><span class="badge-meta" title="豆瓣评分"><span class="movie-rating-stars"><i class="fal fa-star"></i></span> '.concat(detail.rating.toFixed(1), "</span></h3></div></div></div></div></div>") : "";
    const posterCell = detail.poster ? '<div class="beta-td text-left douban-list-poster-cell" style="width: 120px;"><a href="'.concat(url, '" target="_blank" rel="noreferrer"><img class="douban-list-poster" src="').concat(escapeListHtml(detail.poster), '" referrerpolicy="unsafe-url" style="width: 110px !important; height: 164px !important; object-fit: cover;"></a></div>') : "";
    const yearCell = detail.year ? '<div class="beta-td text-right"><h3 class="beta-fix-desc-h3" style="margin: 0; padding: 0;"><a class="beta-link-blend" href="'.concat(url, '" target="_blank" rel="noreferrer" style="text-decoration: none !important; border-bottom: none; font-size: 16px;"><span class="text-bold">').concat(escapeListHtml(detail.year), "</span></a></h3></div>") : "";
    const summary = detail.summary ? '<a href="'.concat(url, '" target="_blank" rel="noreferrer" class="beta-link-blend" style="display: block; max-height: 120px; overflow-y: auto;">').concat(escapeListHtml(detail.summary), '</a><div style="margin-top: 12px;"></div>') : "";
    const countries = detail.countries.length ? '<div class="font-stat">'.concat(detail.countries.map((country) => escapeListHtml(country)).join('<span style="margin: auto 6px;">|</span>'), "</div>") : "";
    const genres = detail.genres.map((genre) => '<span class="badge-meta beta-link-blend">'.concat(escapeListHtml(genre), "</span>")).join("");
    return "".concat(ratingRow, '<div class="hd-table">').concat(posterCell, '<div class="beta-td text-right" style="vertical-align: top; text-align: right;">\n<div class="rule-line" style="text-align: right; width: 95%; margin: auto; padding-bottom: 6px;"><div class="bhd-table" style="width: 100%;">\n<div class="beta-td text-left" style="width: 80%;"><h3 class="beta-fix-desc-h3" style="margin: 0; padding: 0; font-size: 16px;"><a href="').concat(url, '" target="_blank" rel="noreferrer" style="color: #ffffff; font-weight: bold !important;"><span class="beta-link-big">').concat(escapeListHtml(detail.title), "</span></a></h3></div>").concat(yearCell, '\n</div></div>\n<div style="margin-right: 0; margin-top: 6px; padding-top: 6px;"></div>\n<div style="font-size: 13px; color: #999999; text-align: left; width: 95%; margin: auto;">').concat(summary).concat(countries, '</div></div></div>\n<div class="beta-divider" style="padding-top: 12px; margin-top: 12px; font-size: 13px; margin-left: auto; margin-right: auto;"></div>\n<div style="width: 100%; text-align: right; margin-left: auto; margin-right: auto;">').concat(genres, "</div>");
  };
  const POSTER_FETCH_TIMEOUT = 15e3;
  const readPosterAsDataUrl = async (body) => {
    let blob = body;
    try {
      if (typeof body === "string" || body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
        blob = new Blob([body], { type: "image/jpeg" });
      } else if (typeof Blob !== "undefined" && !(blob instanceof Blob) && typeof (blob == null ? void 0 : blob.arrayBuffer) === "function") {
        blob = new Blob([await blob.arrayBuffer()], { type: "image/jpeg" });
      }
      if (typeof Blob === "undefined" || !(blob instanceof Blob)) {
        return "";
      }
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return "";
    }
  };
  const fetchDoubanPoster = (url) => new Promise((resolve) => {
    if (!url) {
      resolve("");
      return;
    }
    let settled = false;
    const finish = (value) => {
      if (!settled) {
        settled = true;
        resolve(value);
      }
    };
    const timer = setTimeout(() => finish(""), POSTER_FETCH_TIMEOUT);
    const done = (value) => {
      clearTimeout(timer);
      finish(value);
    };
    const attempt = (responseType, allowRetry = true) => {
      try {
        GM_xmlhttpRequest({
          method: "GET",
          url,
          responseType,
          timeout: POSTER_FETCH_TIMEOUT,
          headers: { Referer: "https://movie.douban.com/" },
          onload: (res) => {
            if (res.status !== 200 || !res.response) {
              if (allowRetry) {
                attempt("arraybuffer", false);
                return;
              }
              done("");
              return;
            }
            readPosterAsDataUrl(res.response).then(done);
          },
          onerror: () => {
            if (allowRetry) {
              attempt("arraybuffer", false);
              return;
            }
            done("");
          },
          ontimeout: () => done("")
        });
      } catch (error) {
        if (allowRetry) {
          attempt("arraybuffer", false);
          return;
        }
        done("");
      }
    };
    attempt("blob");
  });
  const parseHoverPoster = (link) => {
    var _a2;
    const hoverAttr = "".concat(link.getAttribute("onmouseover") || "", " ").concat(link.getAttribute("title") || "");
    const hoverPoster = (_a2 = hoverAttr.match(/\bsrc=\\?["']?([^"'\s>]+\.(?:jpe?g|png|webp))/i)) == null ? void 0 : _a2[1];
    if (!hoverPoster) {
      return "";
    }
    try {
      return new URL(hoverPoster, location.href).href;
    } catch (error) {
      return hoverPoster;
    }
  };
  const getNativeListPoster = (link, row) => {
    var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i;
    const libraryId = ((_a2 = link.closest("tr")) == null ? void 0 : _a2.getAttribute("library")) || link.getAttribute("library") || "";
    const panelPoster = libraryId ? (_b2 = document.querySelector("#librarydiv".concat(libraryId, " img"))) == null ? void 0 : _b2.getAttribute("src") : "";
    if (panelPoster) {
      return panelPoster;
    }
    const rowPoster = (_d = (_c2 = row || link.closest("tr")) == null ? void 0 : _c2.querySelector(".torrent-search--list__poster-img")) == null ? void 0 : _d.getAttribute("src");
    if (rowPoster) {
      return rowPoster;
    }
    const cellPoster = (_f = (_e = row || link.closest("tr")) == null ? void 0 : _e.querySelector(".browse_imdb_poster img, .group_image img")) == null ? void 0 : _f.getAttribute("src");
    if (cellPoster) {
      return cellPoster;
    }
    const stashed = link.dataset.doubanListPoster || ((_g = link.closest("[data-douban-list-poster]")) == null ? void 0 : _g.dataset.doubanListPoster) || ((_i = (_h = row || link.closest("tr")) == null ? void 0 : _h.querySelector("[data-douban-list-poster]")) == null ? void 0 : _i.dataset.doubanListPoster) || "";
    return stashed || parseHoverPoster(link);
  };
  const listPosterCache = /* @__PURE__ */ new Map();
  const listPosterFetching = /* @__PURE__ */ new Map();
  const loadListPoster = (img, urls, getTmdbPoster2) => {
    const hide = () => {
      var _a2;
      (_a2 = img.closest(".douban-list-poster-cell")) == null ? void 0 : _a2.style.setProperty("display", "none");
    };
    const [doubanLarge, doubanRaw, nativePoster] = urls;
    let shown = "";
    let kind = "";
    let loaded = false;
    let pending = false;
    let scriptPending = false;
    let scriptData = "";
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
    img.addEventListener("load", () => {
      loaded = true;
      pending = false;
    });
    img.addEventListener("error", () => {
      loaded = false;
      pending = false;
      advance();
    });
    const direct = [doubanLarge, doubanRaw].filter(Boolean);
    let index = 0;
    const advance = () => {
      if (!fallbackStarted) {
        while (index < direct.length) {
          const url = direct[index];
          index += 1;
          if (show(url, "douban")) {
            return;
          }
        }
        fallbackStarted = true;
        runFallback();
        return;
      }
      if (!scriptPending && !scriptData) {
        hide();
      }
    };
    const runFallback = () => {
      const settle = () => {
        if (scriptPending || tmdbPending || pending || loaded || scriptData) {
          return;
        }
        hide();
      };
      if (nativePoster) {
        show(nativePoster, "native");
      }
      if (doubanLarge) {
        const cached2 = listPosterCache.get(doubanLarge);
        if (cached2) {
          scriptData = cached2;
          show(cached2, "script");
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
            scriptData = dataUrl || "";
            if (scriptData && (kind !== "douban" || !loaded)) {
              show(scriptData, "script");
            }
            settle();
          });
        }
      }
      if (typeof getTmdbPoster2 === "function") {
        tmdbPending = true;
        Promise.resolve().then(() => getTmdbPoster2()).then((url) => {
          tmdbPending = false;
          if (url && !scriptData && show(url, "tmdb")) {
            return;
          }
          settle();
        }).catch(() => {
          tmdbPending = false;
          settle();
        });
      }
      settle();
    };
    const cached = doubanLarge ? listPosterCache.get(doubanLarge) : "";
    if (cached) {
      scriptData = cached;
      show(cached, "script");
    } else {
      advance();
    }
  };
  const showListPopup = async (link, doubanId, doubanUrl, imdbId = "", release = null) => {
    var _a2;
    const detail = doubanId ? await getSubjectDetail(doubanId, imdbId, true, release) : await mergeListSubject(null, imdbId, release);
    if (!detail || listPopup.hoverLink !== link) {
      return;
    }
    const { listPage = {} } = CURRENT_SITE_INFO;
    const row = link.closest(listPage.row || "tr");
    const nativePoster = getNativeListPoster(link, row);
    const popupDetail = detail.poster || !nativePoster ? detail : __spreadProps(__spreadValues({}, detail), { poster: nativePoster });
    const { node, inner } = getListPopup();
    inner.innerHTML = buildListPopupHtml(popupDetail, doubanUrl);
    const poster = inner.querySelector("img.douban-list-poster");
    if (poster) {
      const getTmdbPoster2 = async () => {
        if (!listTmdbPoster) {
          return "";
        }
        try {
          return await listTmdbPoster(imdbId, popupDetail.originalTitle, popupDetail.year, popupDetail.subtype) || "";
        } catch (error) {
          console.log(error);
          return "";
        }
      };
      loadListPoster(poster, [popupDetail.poster, popupDetail.posterFallback, nativePoster], getTmdbPoster2);
    }
    positionListPopup(node, link);
    node.style.display = "block";
    (_a2 = node.animate) == null ? void 0 : _a2.call(node, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
  };
  const scheduleListPopup = (link, doubanId, doubanUrl, imdbId = "", release = null) => {
    clearTimeout(listPopup.showTimer);
    listPopup.hoverLink = link;
    listPopup.showTimer = setTimeout(() => showListPopup(link, doubanId, doubanUrl, imdbId, release), LIST_POPUP_SHOW_DELAY);
  };
  const bindListPopup = (links, doubanId, doubanUrl, imdbId = "", release = null) => {
    links.forEach((link) => {
      const hoverPoster = parseHoverPoster(link);
      if (hoverPoster) {
        link.dataset.doubanListPoster = hoverPoster;
      }
      link.removeAttribute("onmouseover");
      link.removeAttribute("onmouseout");
      link.addEventListener("mouseenter", () => {
        clearTimeout(listPopup.hideTimer);
        scheduleListPopup(link, doubanId, doubanUrl, imdbId, release);
      });
      link.addEventListener("mouseleave", (event) => {
        clearTimeout(listPopup.showTimer);
        if (links.includes(event.relatedTarget)) {
          if (listPopup.node && listPopup.node.style.display === "block") {
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
      link.addEventListener("click", hideListPopup);
    });
  };
  const insertListTitle = (titleLink, titleText, doubanLink, doubanId, imdbId = "", release = null) => {
    var _a2, _b2, _c2;
    const staleSibling = titleLink.nextElementSibling;
    if (staleSibling == null ? void 0 : staleSibling.classList.contains("douban-list-title")) {
      staleSibling.remove();
    }
    const wrapper = document.createElement("div");
    wrapper.className = "douban-list-title";
    wrapper.style.setProperty("display", "block", "important");
    wrapper.style.setProperty("text-align", "left", "important");
    const anchor = document.createElement("a");
    anchor.href = doubanLink;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.title = titleText;
    anchor.textContent = titleText;
    const titleStyle = getComputedStyle(titleLink);
    ["fontSize", "color", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "letterSpacing", "textTransform", "textDecoration"].forEach((property) => {
      anchor.style[property] = titleStyle[property];
    });
    wrapper.appendChild(anchor);
    const parent = titleLink.parentNode;
    if (/flex|grid/.test(getComputedStyle(parent).display)) {
      const oldBox = ((_a2 = titleLink.parentElement) == null ? void 0 : _a2.classList.contains("douban-list-title-box")) ? titleLink.parentElement : null;
      if (oldBox) {
        (_b2 = oldBox.querySelector(".douban-list-title")) == null ? void 0 : _b2.remove();
        oldBox.appendChild(wrapper);
        bindListPopup([titleLink, anchor], doubanId, doubanLink, imdbId, release);
        return;
      }
      const box = document.createElement("div");
      box.className = "douban-list-title-box";
      ["gridArea", "gridRow", "gridColumn"].forEach((property) => {
        if (titleStyle[property] && titleStyle[property] !== "auto") {
          box.style[property] = titleStyle[property];
        }
      });
      parent.insertBefore(box, titleLink);
      box.appendChild(titleLink);
      box.appendChild(wrapper);
      titleLink.style.gridArea = "auto";
    } else {
      let ref = titleLink;
      while (ref.nextSibling) {
        const next = ref.nextSibling;
        if (next.nodeType === 3) {
          ref = next;
          continue;
        }
        if (next.nodeType !== 1 || !/^inline(-block|-flex|-grid)?$/.test(getComputedStyle(next).display)) {
          break;
        }
        ref = next;
        if (next.tagName === "BR") {
          break;
        }
      }
      if ((_c2 = ref.nextElementSibling) == null ? void 0 : _c2.classList.contains("douban-list-title")) {
        ref.nextElementSibling.remove();
      }
      parent.insertBefore(wrapper, ref.nextSibling);
    }
    bindListPopup([titleLink, anchor], doubanId, doubanLink, imdbId, release);
  };
  const getListTitleImdbId = (link, row) => {
    var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    const dataImdbId = (row == null ? void 0 : row.getAttribute("data-imdb-id")) || ((_a2 = link.closest("[data-imdb-id]")) == null ? void 0 : _a2.getAttribute("data-imdb-id")) || "";
    const imdbDigits = (dataImdbId.match(/^(?:tt)?(\d+)$/i) || [])[1];
    if (imdbDigits) {
      return "tt".concat(imdbDigits.padStart(7, "0"));
    }
    const rowImdb = (_d = (_c2 = (_b2 = row || link.closest("tr")) == null ? void 0 : _b2.querySelector('a[href*="imdb.com/title/"]')) == null ? void 0 : _c2.getAttribute("href")) == null ? void 0 : _d.match(/imdb\.com\/title\/(tt\d+)/);
    if (rowImdb) {
      return rowImdb[1];
    }
    const tagPattern = (_e = CURRENT_SITE_INFO.listPage) == null ? void 0 : _e.imdbTagPattern;
    if (tagPattern) {
      const tagLinks = ((_f = row || link.closest("tr")) == null ? void 0 : _f.querySelectorAll("a[href]")) || [];
      for (const tagLink of tagLinks) {
        const tagMatched = (_g = tagLink.getAttribute("href")) == null ? void 0 : _g.match(new RegExp(tagPattern));
        if (tagMatched == null ? void 0 : tagMatched[1]) {
          return tagMatched[1];
        }
      }
    }
    const dataImdbLink = (_j = (_i = (_h = row || link.closest("tr")) == null ? void 0 : _h.querySelector('[data-imdb-link*="imdb.com/title/"]')) == null ? void 0 : _i.getAttribute("data-imdb-link")) == null ? void 0 : _j.match(/imdb\.com\/title\/(tt\d+)/);
    if (dataImdbLink) {
      return dataImdbLink[1];
    }
    const libraryId = link.getAttribute("library");
    if (!libraryId || !/^\d+$/.test(libraryId)) {
      return "";
    }
    const panel = document.querySelector("#librarydiv".concat(libraryId));
    const matched = (_l = (_k = panel == null ? void 0 : panel.querySelector('a[href*="imdb.com/title/"]')) == null ? void 0 : _k.getAttribute("href")) == null ? void 0 : _l.match(/imdb\.com\/title\/(tt\d+)/);
    return (_m = matched == null ? void 0 : matched[1]) != null ? _m : "";
  };
  const DEFAULT_LIST_ID_PATTERN = /\/torrents\/(?:.+\.)?(\d+)(?:[/?#]|$)/;
  const getListTorrentId = (link, idPattern) => {
    const href = link.getAttribute("href") || "";
    const patterns = Array.isArray(idPattern) ? idPattern : [idPattern || DEFAULT_LIST_ID_PATTERN];
    for (const pattern of patterns) {
      const matched = href.match(new RegExp(pattern));
      if (matched == null ? void 0 : matched[1]) {
        return matched[1];
      }
    }
    return "";
  };
  const getListTitleText = (link, listPage, row) => {
    const fromAttr = listPage.titleAttr ? link.getAttribute(listPage.titleAttr) : "";
    if (fromAttr && fromAttr.trim()) {
      return fromAttr.trim();
    }
    if (listPage.releaseName && row) {
      const releaseNode = row.querySelector(listPage.releaseName);
      const release = (releaseNode == null ? void 0 : releaseNode.getAttribute("title")) || (releaseNode == null ? void 0 : releaseNode.textContent) || "";
      if (release.trim()) {
        return release.trim();
      }
    }
    if (listPage.titleTextStrip) {
      const clone = link.cloneNode(true);
      clone.querySelectorAll(listPage.titleTextStrip).forEach((node) => node.remove());
      const stripped = (clone.textContent || "").trim();
      if (stripped) {
        return stripped;
      }
    }
    return (link.textContent || "").trim();
  };
  const collectListTitleLinks = () => {
    const { listPage = {} } = CURRENT_SITE_INFO;
    const selector = listPage.titleLink || 'a[href*="/torrents/"]';
    const rowSelector = listPage.row || "tr";
    const groups = /* @__PURE__ */ new Map();
    Array.from(document.querySelectorAll(selector)).forEach((link) => {
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
      if (items.some((item) => item.link.dataset.doubanListTitle)) {
        return;
      }
      const title = items.reduce((longest, item) => item.text.length > longest.text.length ? item : longest);
      const row = title.link.closest(rowSelector);
      titles.push(__spreadProps(__spreadValues({}, title), { id, imdbId: getListTitleImdbId(title.link, row), row, links: items }));
    });
    return titles;
  };
  const listResolveCaches = /* @__PURE__ */ new WeakMap();
  const listResolveKeyTitle = (name) => String(name || "").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, "");
  const getListResolveCache = () => {
    let cache = listResolveCaches.get(document);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      listResolveCaches.set(document, cache);
    }
    return cache;
  };
  const resolveListEntry = async (release, imdbId) => {
    const key = [
      imdbId ? "imdb:".concat(imdbId) : "",
      "name:".concat(listResolveKeyTitle(release.name)),
      release.year || "",
      release.season || 0,
      release.episode || 0
    ].join("|");
    const cache = getListResolveCache();
    if (cache.has(key)) {
      return cache.get(key);
    }
    const pending = (async () => {
      const subject = await resolveListSubject(release, imdbId);
      const merged = await mergeListSubject(subject, imdbId, release);
      if (!merged || !isChinese(stripSeasonSuffix(merged.title))) {
        return null;
      }
      const episodeCount = release.season ? merged.id ? await getSubjectEpisodeCount(merged.id) : await getTmdbSeasonCount(merged, release.season) : 0;
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
      link.dataset.doubanListTitle = "1";
    });
    if (!release) {
      return;
    }
    const entry = await resolveListEntry(release, item.imdbId);
    if (!entry) {
      return;
    }
    const { merged, episodeCount } = entry;
    const doubanId = merged.id || "";
    const titleLink = merged.titleSource === "tmdb" && merged.tmdbUrl ? merged.tmdbUrl : DOUBAN_SUBJECT_URL.replace("{doubanId}", doubanId);
    insertListTitle(item.link, formatListTitle(merged, release, episodeCount), titleLink, doubanId, item.imdbId, release);
  };
  const observeListTitles = () => {
    if (document.documentElement.dataset.doubanListObserver) {
      return;
    }
    document.documentElement.dataset.doubanListObserver = "1";
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
    document.documentElement.dataset.doubanListPage = "1";
    document.documentElement.dataset.doubanListSite = CURRENT_SITE_INFO.siteName || "";
    observeListTitles();
    const titles = collectListTitleLinks();
    if (!titles.length) {
      return;
    }
    const workers = Array.from({ length: Math.min(LIST_SEARCH_CONCURRENCY, titles.length) }, async () => {
      while (titles.length) {
        await addDoubanTitleToList(titles.shift());
      }
    });
    await Promise.all(workers);
  };
  const PTP_TOP10_DOUBAN_ICON = "data:image/svg+xml,".concat(encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><g transform="translate(2.5 -2.5) rotate(13 16 16)"><rect x="5" y="8.5" width="22" height="15" rx="2" fill="#009845"/></g><path fill="#007722" d="M6 10h20a2 2 0 0 1 2 2v3a1.8 1.8 0 0 0 0 3.6v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a1.8 1.8 0 0 0 0-3.6v-3a2 2 0 0 1 2-2z"/><text x="16" y="20.4" text-anchor="middle" font-family="PingFang SC,Hiragino Sans GB,Microsoft YaHei,Noto Sans CJK SC,sans-serif" font-size="9" font-weight="700" fill="#ffffff">豆瓣</text></svg>'
  ));
  const PTP_TOP10_TMDB_ICON = "data:image/svg+xml,".concat(encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><rect x="3" y="6" width="26" height="20" rx="4" fill="#01b4e4"/><text x="16" y="18.2" text-anchor="middle" font-family="PingFang SC,Hiragino Sans GB,Microsoft YaHei,Noto Sans CJK SC,sans-serif" font-size="7.6" font-weight="700" fill="#ffffff">TMDB</text></svg>'
  ));
  const ptpTop10Infos = /* @__PURE__ */ new Map();
  const getTop10GroupId = (link) => {
    var _a2;
    return (((_a2 = link == null ? void 0 : link.getAttribute("href")) == null ? void 0 : _a2.match(/torrents\.php\?id=(\d+)/)) || [])[1] || "";
  };
  const getTop10ImdbId = (scope) => {
    var _a2;
    const href = ((_a2 = scope.querySelector('a[href*="imdb.com/title/"]')) == null ? void 0 : _a2.getAttribute("href")) || "";
    return (href.match(/imdb\.com\/title\/(tt\d+)/) || [])[1] || "";
  };
  const getTop10Year = (text) => (String(text || "").match(/((?:19|20)\d{2})/) || [])[1] || "";
  const hasChineseText = (text) => !!text && text !== "暂无相关剧情介绍" && isChinese(text);
  const getTop10Rating = (info, doubanId) => {
    const score = parseFloat(info.rating) || 0;
    if (!score) {
      return null;
    }
    const value = score.toFixed(1);
    if (info.ratingSource === "tmdb") {
      return info.tmdbUrl ? { label: "TMDB", value, link: info.tmdbUrl } : null;
    }
    return doubanId ? { label: "豆瓣", value, link: DOUBAN_SUBJECT_URL.replace("{doubanId}", doubanId) } : null;
  };
  const insertTop10Title = (titleLink, text, parent, ref) => {
    parent.querySelectorAll(":scope > .douban-top10-title").forEach((node) => node.remove());
    const anchor = document.createElement("a");
    anchor.href = titleLink.getAttribute("href") || "#";
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.title = text;
    anchor.textContent = text;
    const titleStyle = getComputedStyle(titleLink);
    ["fontSize", "color", "fontWeight", "fontFamily", "fontStyle", "lineHeight", "letterSpacing", "textTransform", "textDecoration"].forEach((property) => {
      anchor.style[property] = titleStyle[property];
    });
    const wrapper = document.createElement("div");
    wrapper.className = "douban-top10-title";
    wrapper.style.setProperty("display", "block", "important");
    wrapper.style.setProperty("white-space", "normal", "important");
    wrapper.appendChild(anchor);
    parent.insertBefore(wrapper, ref || null);
  };
  const addTop10CoverRating = (movie, rating) => {
    const host2 = movie.node.querySelector(".cover-movie-list__movie__rating-and-tags");
    if (!host2) {
      return;
    }
    const imdbLink = host2.querySelector("a.cover-movie-list__movie__rating");
    if (imdbLink && !imdbLink.dataset.doubanTop10ImdbLabel) {
      imdbLink.dataset.doubanTop10ImdbLabel = "1";
      imdbLink.textContent = "IMDB".concat(imdbLink.textContent);
    }
    if (!rating) {
      return;
    }
    host2.querySelectorAll("a.douban-top10-rating").forEach((node) => node.remove());
    const anchor = document.createElement("a");
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.className = "cover-movie-list__movie__rating douban-top10-rating";
    anchor.href = rating.link;
    anchor.textContent = "".concat(rating.label).concat(rating.value);
    if (imdbLink) {
      imdbLink.after(anchor);
    } else {
      host2.prepend(anchor);
    }
  };
  const addTop10ListRating = (movie, rating) => {
    const host2 = movie.node.querySelector(".basic-movie-list__movie__ratings-and-tags");
    if (!host2 || !rating) {
      return;
    }
    host2.querySelectorAll(".douban-top10-rating").forEach((node) => node.remove());
    const box = document.createElement("div");
    box.className = "basic-movie-list__movie__rating-container douban-top10-rating";
    const title = document.createElement("span");
    title.className = "basic-movie-list__movie__rating__title";
    const link = document.createElement("a");
    link.target = "_blank";
    link.rel = "noreferrer";
    link.href = rating.link;
    link.textContent = rating.label;
    title.appendChild(link);
    title.appendChild(document.createTextNode(": "));
    const value = document.createElement("span");
    value.className = "basic-movie-list__movie__rating__rating";
    value.textContent = String(rating.value);
    box.appendChild(title);
    box.appendChild(value);
    const boxes = Array.from(host2.querySelectorAll(".basic-movie-list__movie__rating-container"));
    const imdbBox = boxes.find((item) => item.querySelector('a[href*="imdb.com/title/"]'));
    if (imdbBox) {
      imdbBox.after(box);
    } else {
      host2.prepend(box);
    }
  };
  const addTop10HugeRating = (movie, rating, votes) => {
    const table = movie.node.querySelector(".huge-movie-list__movie__ratings");
    if (!table || !rating) {
      return;
    }
    table.querySelectorAll("tr.douban-top10-rating").forEach((node) => node.remove());
    const imdbRow = Array.from(table.querySelectorAll("tr")).find((row2) => row2.querySelector('a[href*="imdb.com/title/"]'));
    let row;
    if (imdbRow) {
      row = imdbRow.cloneNode(true);
      row.classList.add("douban-top10-rating");
    } else {
      row = document.createElement("tr");
      row.classList.add("douban-top10-rating");
      row.innerHTML = '<td colspan="1" class="nobr huge-movie-list__movie__ratings__icon-column" width="1%"><center><a class="rating"><img style="height: 32px; width: 32px;"></a></center></td><td class="nobr huge-movie-list__movie__ratings__votes-column" width="99%"><span class="rating"></span> <span class="mid">/</span> <span class="outof"> 10</span></td>';
    }
    const link = row.querySelector("a");
    if (!link) {
      return;
    }
    link.href = rating.link;
    link.target = "_blank";
    link.rel = "noreferrer";
    const img = row.querySelector("img");
    if (img) {
      img.src = rating.label === "TMDB" ? PTP_TOP10_TMDB_ICON : PTP_TOP10_DOUBAN_ICON;
      img.title = rating.label === "TMDB" ? "TMDB" : "Douban";
      img.style.height = "32px";
      img.style.width = "32px";
    }
    const votesCell = row.querySelector("td.huge-movie-list__movie__ratings__votes-column");
    const valueNode = votesCell == null ? void 0 : votesCell.querySelector("span.rating");
    if (valueNode) {
      valueNode.textContent = String(rating.value);
    }
    const br = votesCell == null ? void 0 : votesCell.querySelector("br");
    if (br) {
      if (votes) {
        br.nextSibling.textContent = "(".concat(votes.toLocaleString("en-US"), " votes)");
      } else {
        br.nextSibling.textContent = "";
        br.remove();
      }
    }
    if (imdbRow) {
      imdbRow.after(row);
    } else {
      table.prepend(row);
    }
  };
  const applyTop10Tooltip = (titleLink) => {
    if (titleLink.classList.contains("douban-top10-tooltip-title")) {
      return;
    }
    const info = ptpTop10Infos.get(getTop10GroupId(titleLink));
    if (!info) {
      return;
    }
    titleLink.classList.add("douban-top10-tooltip-title");
    if (isChinese(info.title)) {
      titleLink.textContent = info.title;
    }
    const tooltip = titleLink.closest(".qtip");
    const synopsis = tooltip == null ? void 0 : tooltip.querySelector(".movie-tooltip__synopsis");
    if (synopsis && info.summary) {
      synopsis.textContent = info.summary;
    }
    if (!info.rating) {
      return;
    }
    const ratings = tooltip == null ? void 0 : tooltip.querySelector(".movie-tooltip__ratings");
    if (!ratings) {
      return;
    }
    const box = document.createElement("div");
    box.className = "movie-tooltip__rating-container douban-top10-rating";
    const title = document.createElement("span");
    title.className = "movie-tooltip__rating__title";
    const link = document.createElement("a");
    link.target = "_blank";
    link.rel = "noreferrer";
    link.href = info.rating.link;
    link.textContent = info.rating.label;
    title.appendChild(link);
    title.appendChild(document.createTextNode(": "));
    const value = document.createElement("span");
    value.className = "movie-tooltip__rating__rating";
    value.textContent = String(info.rating.value);
    box.appendChild(title);
    box.appendChild(value);
    const imdbBox = ratings.querySelector(".movie-tooltip__rating-container");
    if (imdbBox) {
      imdbBox.after(box);
    } else {
      ratings.prepend(box);
    }
  };
  const refreshTop10Tooltips = () => {
    document.querySelectorAll(".qtip .movie-tooltip__title").forEach(applyTop10Tooltip);
  };
  const observeTop10Tooltips = () => {
    new MutationObserver(refreshTop10Tooltips).observe(document.body, { childList: true, subtree: true });
  };
  const collectTop10Movies = () => {
    const movies = [];
    document.querySelectorAll(".cover-movie-list__movie").forEach((node) => {
      var _a2;
      const titleLink = node.querySelector(".cover-movie-list__movie__title");
      const groupId = getTop10GroupId(titleLink);
      if (node.dataset.doubanTop10 || !titleLink || !groupId) {
        return;
      }
      movies.push({
        node,
        view: "cover",
        titleLink,
        groupId,
        title: (titleLink.textContent || "").trim(),
        year: getTop10Year((_a2 = node.querySelector(".cover-movie-list__movie__year")) == null ? void 0 : _a2.textContent),
        imdbId: getTop10ImdbId(node),
        titleParent: titleLink.parentNode,
        titleRef: null
      });
    });
    document.querySelectorAll(".huge-movie-list__movie").forEach((node) => {
      var _a2;
      const titleLink = node.querySelector(".huge-movie-list__movie__title");
      const groupId = getTop10GroupId(titleLink);
      if (node.dataset.doubanTop10 || !titleLink || !groupId) {
        return;
      }
      movies.push({
        node,
        view: "huge",
        titleLink,
        groupId,
        title: (titleLink.textContent || "").trim(),
        year: getTop10Year((_a2 = node.querySelector(".huge-movie-list__movie__year")) == null ? void 0 : _a2.textContent),
        imdbId: getTop10ImdbId(node),
        titleParent: node.querySelector(".huge-movie-list__movie__details"),
        titleRef: node.querySelector(".huge-movie-list__movie__tag-list")
      });
    });
    document.querySelectorAll(".basic-movie-list__details-row").forEach((node) => {
      var _a2;
      const titleLink = node.querySelector(".basic-movie-list__movie__title");
      const groupId = getTop10GroupId(titleLink);
      if (node.dataset.doubanTop10 || !titleLink || !groupId) {
        return;
      }
      movies.push({
        node,
        view: "list",
        titleLink,
        groupId,
        title: (titleLink.textContent || "").trim(),
        year: getTop10Year((_a2 = node.querySelector(".basic-movie-list__movie__year")) == null ? void 0 : _a2.textContent),
        imdbId: getTop10ImdbId(node),
        titleParent: titleLink.closest("td"),
        titleRef: node.querySelector(".basic-movie-list__movie__ratings-and-tags")
      });
    });
    return movies;
  };
  const renderTop10Movie = (movie, data) => {
    insertTop10Title(movie.titleLink, data.titleText, movie.titleParent, movie.titleRef);
    if (movie.view === "cover") {
      addTop10CoverRating(movie, data.rating);
    } else if (movie.view === "huge") {
      addTop10HugeRating(movie, data.rating, data.votes);
      const synopsis = movie.node.querySelector(".huge-movie-list__movie__synopsis");
      if (synopsis && data.summary) {
        synopsis.textContent = data.summary;
      }
    } else {
      addTop10ListRating(movie, data.rating);
    }
    refreshTop10Tooltips();
  };
  const ptpTop10Pending = /* @__PURE__ */ new Map();
  const addToPtpTop10Movie = async (movie) => {
    movie.node.dataset.doubanTop10 = "1";
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
          const release = __spreadProps(__spreadValues({}, parsed), { year: movie.year || parsed.year || "" });
          const entry = await resolveListEntry(release, movie.imdbId);
          if (!entry) {
            return null;
          }
          const { merged } = entry;
          const detail = merged.id ? await getSubjectDetail(merged.id, movie.imdbId, true, release) : null;
          const info = detail || merged;
          const data2 = {
            title: merged.title,
            summary: hasChineseText(info.summary) ? info.summary : "",
            rating: getTop10Rating(info, merged.id),
            votes: parseInt(info.votes, 10) || 0,
            titleText: formatListTitle(merged, release, 0)
          };
          ptpTop10Infos.set(movie.groupId, data2);
          return data2;
        } catch (error) {
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
  const renderDoubanInfo = async (doubanInfo, doubanId, imdbId, link, titleLink) => {
    const nativeReplaceFields = [
      "addTitleAfter",
      "addTitleBefore",
      "addTitleInside",
      "addTitleLineAfter",
      "addSummaryTab",
      "replaceOverview",
      "replaceOverviewLabel"
    ];
    if (nativeReplaceFields.some((field) => CURRENT_SITE_INFO[field])) {
      const doubanData = doubanInfo || await getDoubanInfo(doubanId, imdbId);
      if (doubanData) {
        replaceNativeInfo(
          doubanData,
          link || "https://movie.douban.com/subject/".concat(doubanId),
          titleLink
        );
      }
    } else {
      await createDoubanDom(doubanId, imdbId, doubanInfo, link);
    }
  };
  function fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest(__spreadProps(__spreadValues({
        method: "GET",
        url,
        responseType: "json"
      }, options), {
        onload: (res) => {
          const { statusText, status, response } = res;
          if (status !== 200) {
            reject(Object.assign(new Error(statusText || status), { status }));
          } else {
            resolve(response);
          }
        },
        ontimeout: () => {
          reject(new Error("timeout"));
        },
        onerror: (error) => {
          reject(error);
        }
      }));
    });
  }
  const gmFetch = fetch;
  const TMDB_API_URL = "https://api.themoviedb.org/3";
  const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";
  const TMDB_POSTER_SIZE = "w500";
  const TMDB_API_KEY_STORAGE = "tmdb_api_key";
  const TMDB_CACHE_KEY = "tmdb_v1";
  const TMDB_CACHE_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1e3;
  const TMDB_REQUEST_INTERVAL = 100;
  const TMDB_RETRY_DELAY = 1500;
  const TMDB_ZH_REGIONS = ["CN", "HK", "TW"];
  const getTmdbApiKey = () => String(GM_getValue(TMDB_API_KEY_STORAGE) || "").trim();
  const isV4Token = (key) => /^eyJ/i.test(String(key || "").trim());
  const setTmdbApiKey = (key) => GM_setValue(TMDB_API_KEY_STORAGE, String(key || "").trim());
  const hasTmdbApiKey = () => !!getTmdbApiKey();
  const waitTmdbRequestSlot = createRequestGate(TMDB_REQUEST_INTERVAL);
  const getTmdbCache = () => {
    const cache = GM_getValue(TMDB_CACHE_KEY) || {};
    return cache;
  };
  const tmdbMissKeys = /* @__PURE__ */ new Set();
  const setTmdbCache = (cache) => GM_setValue(TMDB_CACHE_KEY, cache);
  const hasChineseSummary = (data) => !!(data == null ? void 0 : data.summary) && data.summary !== "暂无相关剧情介绍" && isChinese(data.summary);
  const isTmdbError = (data) => !data || typeof data !== "object" || "status_code" in data;
  const fetchTmdbApi = async (path, allowRetry = true) => {
    if (!hasTmdbApiKey()) {
      return null;
    }
    await waitTmdbRequestSlot();
    try {
      const key = getTmdbApiKey();
      const options = { responseType: "json" };
      let url = "".concat(TMDB_API_URL).concat(path);
      if (isV4Token(key)) {
        options.headers = { Authorization: "Bearer ".concat(key) };
      } else {
        const sep = path.includes("?") ? "&" : "?";
        url += "".concat(sep, "api_key=").concat(encodeURIComponent(key));
      }
      const data = await gmFetch(url, options);
      if (isTmdbError(data)) {
        throw new Error((data == null ? void 0 : data.status_message) || "TMDB 请求失败");
      }
      return data;
    } catch (error) {
      console.log("TMDB", error);
      if (!allowRetry) {
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, TMDB_RETRY_DELAY));
      return fetchTmdbApi(path, false);
    }
  };
  const pickChineseTranslation = (translations) => {
    const zh = (translations || []).filter((item) => item.iso_639_1 === "zh" && item.data);
    for (const region of TMDB_ZH_REGIONS) {
      const hit = zh.find((item) => item.iso_3166_1 === region);
      if (hit) {
        return hit.data;
      }
    }
    return null;
  };
  const chineseFrom = (translated, original) => {
    const fromTranslation = (translated || "").trim();
    if (fromTranslation) {
      return fromTranslation;
    }
    return isChinese(original) ? String(original).trim() : "";
  };
  const normalizeTmdbMovie = (data) => {
    var _a2;
    const zh = pickChineseTranslation((_a2 = data.translations) == null ? void 0 : _a2.translations);
    return {
      mediaType: "movie",
      tmdbId: String(data.id),
      title: chineseFrom(zh == null ? void 0 : zh.title, data.title),
      year: (data.release_date || "").slice(0, 4),
      summary: chineseFrom(zh == null ? void 0 : zh.overview, data.overview),
      poster: data.poster_path ? "".concat(TMDB_IMAGE_URL, "/").concat(TMDB_POSTER_SIZE).concat(data.poster_path) : "",
      rating: parseFloat(data.vote_average) || 0,
      votes: parseInt(data.vote_count, 10) || 0,
      webUrl: "https://www.themoviedb.org/movie/".concat(data.id)
    };
  };
  const normalizeTmdbTv = (data) => {
    var _a2;
    const zh = pickChineseTranslation((_a2 = data.translations) == null ? void 0 : _a2.translations);
    return {
      mediaType: "tv",
      tmdbId: String(data.id),
      title: chineseFrom(zh == null ? void 0 : zh.name, data.name),
      year: (data.first_air_date || "").slice(0, 4),
      summary: chineseFrom(zh == null ? void 0 : zh.overview, data.overview),
      poster: data.poster_path ? "".concat(TMDB_IMAGE_URL, "/").concat(TMDB_POSTER_SIZE).concat(data.poster_path) : "",
      rating: parseFloat(data.vote_average) || 0,
      votes: parseInt(data.vote_count, 10) || 0,
      webUrl: "https://www.themoviedb.org/tv/".concat(data.id)
    };
  };
  const findTmdbId = async (imdbId) => {
    var _a2, _b2, _c2, _d;
    if (!imdbId) {
      return null;
    }
    const data = await fetchTmdbApi("/find/".concat(encodeURIComponent(imdbId), "?external_source=imdb_id&language=zh-CN"));
    if (!data) {
      return null;
    }
    if ((_a2 = data.movie_results) == null ? void 0 : _a2.length) {
      return { mediaType: "movie", tmdbId: String(data.movie_results[0].id) };
    }
    if ((_b2 = data.tv_results) == null ? void 0 : _b2.length) {
      return { mediaType: "tv", tmdbId: String(data.tv_results[0].id) };
    }
    const season = (_c2 = data.tv_season_results) == null ? void 0 : _c2[0];
    const episode = (_d = data.tv_episode_results) == null ? void 0 : _d[0];
    if (season == null ? void 0 : season.show_id) {
      return { mediaType: "tv", tmdbId: String(season.show_id) };
    }
    if (episode == null ? void 0 : episode.show_id) {
      return { mediaType: "tv", tmdbId: String(episode.show_id) };
    }
    return null;
  };
  const getTmdbDetail = async (mediaType, tmdbId) => {
    const path = mediaType === "movie" ? "/movie/".concat(tmdbId) : "/tv/".concat(tmdbId);
    const data = await fetchTmdbApi("".concat(path, "?language=zh-CN&append_to_response=translations,external_ids"));
    if (!data) {
      return null;
    }
    return mediaType === "movie" ? normalizeTmdbMovie(data) : normalizeTmdbTv(data);
  };
  const getTmdbInfo = async (imdbId) => {
    if (!hasTmdbApiKey() || !imdbId) {
      return null;
    }
    const cache = getTmdbCache();
    const cacheKey = "imdb:".concat(imdbId);
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.updateTime < TMDB_CACHE_EXPIRE_TIME) {
      return cached.info;
    }
    if (tmdbMissKeys.has(cacheKey)) {
      return null;
    }
    const found = await findTmdbId(imdbId);
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
  const pickTmdbSearchHit = (results, query, year, latin, kind) => {
    const list = Array.isArray(results) ? results : [];
    return list.find((item) => {
      const itemYear = (item.release_date || item.first_air_date || "").slice(0, 4);
      if (year && itemYear !== String(year)) {
        return false;
      }
      if (!latin) {
        return true;
      }
      const names = kind === "tv" ? [item.name, item.original_name] : [item.title, item.original_title];
      return names.some((name) => name && name.length > 2 && normalizeTitle(name) === normalizeTitle(query));
    }) || null;
  };
  const searchTmdbByTitle = async (title, year, mediaType) => {
    const kind = mediaType === "tv" ? "tv" : "movie";
    const query = String(title || "").trim();
    if (!query) {
      return null;
    }
    const latin = /^[\x20-\x7e]+$/.test(query);
    const years = kind === "tv" && year && latin ? [year, ""] : [year || ""];
    for (const itemYear of years) {
      const params = ["query=".concat(encodeURIComponent(query)), "language=zh-CN"];
      if (itemYear) {
        params.push(kind === "tv" ? "first_air_date_year=".concat(encodeURIComponent(itemYear)) : "year=".concat(encodeURIComponent(itemYear)));
      }
      const data = await fetchTmdbApi("/search/".concat(kind, "?").concat(params.join("&")));
      const hit = pickTmdbSearchHit(data == null ? void 0 : data.results, query, itemYear, latin, kind);
      if (hit) {
        return { mediaType: kind, tmdbId: String(hit.id) };
      }
    }
    return null;
  };
  const getTmdbInfoByTitle = async (title, year, mediaType) => {
    if (!hasTmdbApiKey() || !title) {
      return null;
    }
    const cache = getTmdbCache();
    const cacheKey = "title:".concat(normalizeTitle(title), "|").concat(year || "", "|").concat(mediaType || "");
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
  const getTmdbSeasonEpisodeCount = async (tmdbId, season) => {
    if (!hasTmdbApiKey() || !tmdbId || !season) {
      return 0;
    }
    const cache = getTmdbCache();
    const cacheKey = "season:".concat(tmdbId, ":").concat(season);
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.updateTime < TMDB_CACHE_EXPIRE_TIME) {
      return cached.count || 0;
    }
    const data = await fetchTmdbApi("/tv/".concat(encodeURIComponent(tmdbId), "/season/").concat(encodeURIComponent(season), "?language=zh-CN"));
    const count = Array.isArray(data == null ? void 0 : data.episodes) ? data.episodes.length : 0;
    cache[cacheKey] = { count, updateTime: Date.now() };
    setTmdbCache(cache);
    return count;
  };
  const getTmdbPoster = async (imdbId, title = "", year = "", mediaType = "") => {
    const info = imdbId && await getTmdbInfo(imdbId) || (title ? await getTmdbInfoByTitle(title, year, mediaType) : null);
    return (info == null ? void 0 : info.poster) || "";
  };
  const mergeTmdbInfo = async (doubanData, imdbId, release = null) => {
    var _a2;
    const needTitle = !isChinese(doubanData == null ? void 0 : doubanData.chineseTitle);
    const needSummary = !hasChineseSummary(doubanData);
    const needPoster = !(doubanData == null ? void 0 : doubanData.poster);
    const needRating = !(parseFloat(doubanData == null ? void 0 : doubanData.rating) > 0 || parseFloat(doubanData == null ? void 0 : doubanData.average) > 0);
    if (!needTitle && !needSummary && !needPoster && !needRating) {
      return doubanData || null;
    }
    const searchTitle = (doubanData == null ? void 0 : doubanData.originalTitle) || ((_a2 = release == null ? void 0 : release.queries) == null ? void 0 : _a2[0]) || (release == null ? void 0 : release.name) || "";
    const mediaType = (release == null ? void 0 : release.season) ? "tv" : (doubanData == null ? void 0 : doubanData.subtype) || (release == null ? void 0 : release.subtype) || "";
    const tmdb = imdbId && await getTmdbInfo(imdbId) || (searchTitle ? await getTmdbInfoByTitle(searchTitle, (doubanData == null ? void 0 : doubanData.year) || (release == null ? void 0 : release.year) || "", mediaType) : null);
    if (!tmdb) {
      return doubanData || null;
    }
    const merged = __spreadValues({}, doubanData || {});
    let titleSource = doubanData ? "douban" : "";
    if (needTitle && tmdb.title) {
      merged.chineseTitle = tmdb.title;
      titleSource = "tmdb";
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
      merged.ratingSource = "tmdb";
    }
    merged.tmdbUrl = tmdb.webUrl;
    merged.titleSource = titleSource;
    merged.tmdbId = tmdb.tmdbId;
    merged.mediaType = tmdb.mediaType;
    return merged;
  };
  const registerTmdbMenu = () => {
    GM_registerMenuCommand("设置 TMDB API Key（豆瓣兜底）", () => {
      const input = window.prompt(
        "请输入 TMDB 的 API Read Access Token（v4，在 themoviedb.org/settings/api 申请）\n也兼容 v3 的 api_key，粘哪种都能用。\n留空并确定可清除已保存的 Key。保存后刷新页面生效。",
        getTmdbApiKey()
      );
      if (input === null) {
        return;
      }
      setTmdbApiKey(input);
      if (input.trim()) {
        window.alert("TMDB API Key 已保存，刷新页面后生效。");
      } else {
        window.alert("TMDB API Key 已清除，豆瓣兜底已关闭。");
      }
    });
  };
  const getTrailerVideoId = (src) => {
    const url = String(src || "").trim();
    const matched = url.match(/youtube(?:-nocookie)?\.com\/(?:embed|v|shorts)\/([\w-]{6,})|youtu\.be\/([\w-]{6,})/i);
    if (matched) {
      return matched[1] || matched[2];
    }
    const tail = url.split("/").pop().replace(/\.html?$/i, "");
    return /^[\w-]{6,}$/.test(tail) ? tail : "";
  };
  const addPtpTrailerLink = (videoId) => {
    var _a2;
    if (!videoId || document.querySelector("#ptp-trailer-link")) {
      return;
    }
    const link = document.createElement("a");
    link.id = "ptp-trailer-link";
    link.className = "linkbox__link";
    link.href = "https://www.youtube.com/watch?v=".concat(videoId);
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "[Trailer]";
    const subscribe = Array.from(document.querySelectorAll(".linkbox__link")).find((item) => /\[Subscribe\]/.test(item.textContent));
    if (subscribe) {
      subscribe.after(document.createTextNode(" "), link);
    } else {
      (_a2 = document.querySelector(".linkbox")) == null ? void 0 : _a2.appendChild(link);
    }
  };
  const removePtpSynopsisTrailer = () => {
    var _a2;
    (_a2 = document.querySelector("#trailer")) == null ? void 0 : _a2.remove();
    const toggle = document.querySelector("#toggletrailer");
    if (toggle) {
      const box = toggle.parentElement;
      toggle.remove();
      if (box && box !== document.body && !box.textContent.trim()) {
        box.remove();
      }
    }
  };
  const replacePtpTrailer = () => {
    var _a2;
    const videoId = getTrailerVideoId((_a2 = document.querySelector("#trailer iframe")) == null ? void 0 : _a2.getAttribute("src"));
    removePtpSynopsisTrailer();
    addPtpTrailerLink(videoId);
  };
  const CACHE_EXPIRE_TIME = 30 * 24 * 60 * 60 * 1e3;
  const getCachedInfo = (imdbId) => {
    const cached = (GM_getValue("ids_v2") || {})[imdbId];
    if (cached && isChinese(cached.chineseTitle) && !(cached.updateTime && Date.now() - cached.updateTime >= CACHE_EXPIRE_TIME)) {
      return cached;
    }
  };
  const loadDoubanData = async (imdbId) => {
    const doubanData = getCachedInfo(imdbId) || await getDoubanInfoByIMDB(imdbId) || await getDoubanInfoFallback(imdbId);
    const doubanId = doubanData ? doubanData.doubanId || doubanData.id || "" : "";
    return { doubanId, doubanData };
  };
  const resolveSeason = async (doubanData, imdbId) => {
    var _a2;
    const doubanId = doubanData.doubanId || doubanData.id;
    if (doubanData.episodes) {
      const seasonId = (_a2 = await getTvSeasonData(doubanData)) == null ? void 0 : _a2.id;
      if (seasonId && seasonId !== doubanId) {
        const seasonData = await getDoubanInfoBySubject(seasonId) || await getDoubanInfo(seasonId, imdbId);
        if (seasonData) {
          return { doubanId: seasonId, doubanData: seasonData };
        }
      }
    }
    return { doubanId, doubanData };
  };
  const waitForImdbId = async (timeout = 15e3) => {
    const deadline = Date.now() + timeout;
    let imdbId = getImdbId();
    while (!imdbId && Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      imdbId = getImdbId();
    }
    return imdbId;
  };
  const isPtpTop10Page = () => {
    const { top10 } = CURRENT_SITE_INFO;
    if (!top10) {
      return false;
    }
    if (top10.path && new RegExp(top10.path).test(location.pathname)) {
      return true;
    }
    return !!top10.browsePath && new RegExp(top10.browsePath).test(location.pathname) && !/(?:[?&])id=/.test(location.search);
  };
  const isListPage = () => {
    const { listPage } = CURRENT_SITE_INFO;
    if (!(listPage == null ? void 0 : listPage.path) || !new RegExp(listPage.path).test(location.pathname)) {
      return false;
    }
    if (listPage.query && !new RegExp(listPage.query).test(location.search)) {
      return false;
    }
    return !listPage.excludeQuery || !new RegExp(listPage.excludeQuery).test(location.search);
  };
  (async () => {
    if (!CURRENT_SITE_INFO) {
      return;
    }
    registerTmdbMenu();
    if (isPtpTop10Page()) {
      setListTmdb({ merge: mergeTmdbInfo, poster: getTmdbPoster, seasonCount: getTmdbSeasonEpisodeCount });
      addDoubanTitlesToPtpTop10();
      return;
    }
    if (isListPage()) {
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
      const info = await mergeTmdbInfo(doubanData, imdbId);
      if (!info) {
        throw new Error("没有找到影片条目");
      }
      const link = doubanId ? "https://movie.douban.com/subject/".concat(doubanId) : info.tmdbUrl || "";
      const titleLink = info.titleSource === "tmdb" && info.tmdbUrl ? info.tmdbUrl : link;
      if (CURRENT_SITE_NAME.match(/PTP/)) {
        addToPtpPage(info);
        replacePtpTrailer();
      } else if (CURRENT_SITE_NAME.match(/ANT/)) {
        addToANTPage(info);
      } else {
        const season = await resolveSeason(info, imdbId);
        renderDoubanInfo(season.doubanData, season.doubanId, imdbId, link, titleLink);
      }
    } catch (error) {
      console.log(error);
      if (CURRENT_SITE_NAME.match(/PTP/)) {
        addPtpGroupNames();
        replacePtpTrailer();
      }
      addDarkLinkButton();
    }
  })();

})(jQuery);