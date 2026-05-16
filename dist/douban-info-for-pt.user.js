// ==UserScript==
// @name            douban-info-for-pt
// @name:en         douban-info-for-pt
// @namespace       https://github.com/techmovie/DouBan-Info-for-PT
// @version         1.7.11
// @author          birdplane
// @description     在PT站电影详情页展示部分中文信息
// @description:en  Display some Chinese information on the PT site movie details page
// @license         MIT
// @source          git@github.com:techmovie/DouBan-Info-for-PT.git
// @downloadURL     https://github.com/techmovie/DouBan-Info-for-PT/raw/main/dist/douban-info-for-pt.user.js
// @updateURL       https://github.com/techmovie/DouBan-Info-for-PT/raw/main/dist/douban-info-for-pt.user.js
// @match           *://passthepopcorn.me/torrents.php?id=*
// @match           *://passthepopcorn.me/requests.php?action=view&id=*
// @match           *://anthelion.me/torrents.php?id=*
// @match           *://anthelion.me/requests.php?action=view&id=*
// @match           *://beyond-hd.me/torrents/*
// @match           *://beyond-hd.me/library/title/*
// @match           *://blutopia.cc/torrents/*
// @match           *://eiga.moi/torrents/*
// @match           *://hdbits.org/details.php?id=*
// @match           *://hdbits.org/requests/show_request?id=*
// @match           *://uhdbits.org/torrents.php?id=*
// @match           *://filelist.io/details.php?id=*
// @match           *://hd-torrents.org/details.php?id=*
// @match           *://karagarga.in/details.php?id=*
// @match           *://privatehd.to/torrent/*
// @match           *://broadcasthe.net/series.php?id=*
// @match           *://iptorrents.com/torrent.php?id=*
// @match           *://www.iptorrents.com/torrent.php?id=*
// @match           *://www.torrentleech.org/torrent/*
// @match           *://avistaz.to/torrent/*
// @match           *://secret-cinema.pw/torrents.php?id=*
// @match           *://aither.cc/torrents/*
// @match           *://shadowthein.net/details.php?id=*
// @match           *://shadowthein.net/details.php?id=*
// @match           *://baconbits.org/torrents.php?id=*
// @match           *://broadcity.in/details.php?id=*
// @match           *://www.morethantv.me/torrents.php?id=*
// @match           *://www.morethantv.me/show/*
// @match           *://tgx.rs/torrent/*
// @require         https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_openInTab
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// ==/UserScript==

(g=>{if(typeof GM_addStyle=="function"){GM_addStyle(g);return}const t=document.createElement("style");t.textContent=g,document.head.append(t)})(' .col-container .fix-col,.ll{float:left}#douban-wrapper #content{background-image:url(data:image/png;base64,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);background-repeat:no-repeat;height:325px;min-height:auto;padding:10px;width:750px}#douban-wrapper #content h1{font-size:20px}#douban-wrapper #content .grid{border-radius:9px;height:325px;width:750px}#douban-wrapper #content .grid .grid-col1{width:225px}#douban-wrapper #content .grid .grid-col2{height:277px;overflow:hidden;padding:24px 18px;width:254px}#douban-wrapper #content .grid .grid-col3{height:100%;width:18px}#douban-wrapper #content .grid .grid-col4{font-size:14px;padding:27px 14px 0 12px;width:190px}#douban-wrapper #content .picture-douban-wrapper{background-position:50%;background-size:cover;border-bottom-left-radius:9px;border-top-left-radius:9px;height:325px;width:225px}#douban-wrapper #content .main-title h1,#douban-wrapper #content .sub-title h2{display:-webkit-box;-webkit-line-clamp:2;line-height:1.2;max-height:2.5em;overflow:hidden;word-break:break-all;-webkit-box-orient:vertical}#douban-wrapper #content .main-title h1{color:#000;font-size:30px;font-weight:500}#douban-wrapper #content .sub-title{margin-top:9px}#douban-wrapper #content .sub-title h2{color:#adadad;font-size:18px;font-weight:400}#douban-wrapper #content .baseinfo{color:#000;display:-webkit-box;font-size:16px;font-weight:400;letter-spacing:1px;-webkit-line-clamp:5;line-height:25px;margin-top:18px;overflow:hidden;word-break:break-all;-webkit-box-orient:vertical}#douban-wrapper #content .line-wrap{background-image:url(data:image/png;base64,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);background-size:contain;height:100%;position:relative;width:18px}#douban-wrapper #content .douban-icon{font-size:0}#douban-wrapper #content .douban-icon>span{border:1px solid #41be57;display:inline-block;font-size:14px;text-align:center}#douban-wrapper #content .douban-icon .icon-pt1{background-color:#41be57;border-bottom-left-radius:4px;border-top-left-radius:4px;color:#fff;height:24px;line-height:24px;width:24px}#douban-wrapper #content .douban-icon .icon-pt2{background:#fff;border-bottom-right-radius:4px;border-top-right-radius:4px;color:#3ba94d;height:24px;line-height:24px;width:69px}#douban-wrapper #content .score-container .rating_self{clear:none;margin-top:15px;overflow:hidden}#douban-wrapper #content .score-container .rating_self .rating_num{color:#000;font-size:48px;font-weight:400;line-height:1;padding:0}#douban-wrapper #content .score-container .rating_self .rating_right{float:left;padding-left:10px;padding-top:5px}#douban-wrapper #content .score-container .rating_self .rating_right .ll{float:none}#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum{color:#3b3b3b}#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people,#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people:hover,#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people:link,#douban-wrapper #content .score-container .rating_self .rating_right .rating_sum .rating_people:visited{background:none;color:#3b3b3b}#douban-wrapper #content .score-container .ratings-on-weight{margin-top:10px;min-weight:1px}#douban-wrapper #content .score-container .ratings-on-weight .item{line-height:1.5}#douban-wrapper #content .score-container .ratings-on-weight .item .starstop{color:#3b3b3b;float:none;margin-right:0}#douban-wrapper #content .score-container .ratings-on-weight .item>div,#douban-wrapper #content .score-container .ratings-on-weight .item>span{display:inline-block}#douban-wrapper #content .score-container .ratings-on-weight .item .power{background:#faa032;border-radius:3px;height:6px;vertical-align:middle}#douban-wrapper #content .bottom-row{align-items:center;display:flex;justify-content:space-between}#douban-wrapper #content .bottom-row .rating-betterthan{color:#1c1c1c;font-size:14px;line-height:21px;width:117px}#douban-wrapper #content .bottom-row .rating-betterthan .number{color:#41be57;font-size:14px}#douban-wrapper #content .bottom-row .qr-code{height:64px;overflow:hidden;width:64px}#douban-wrapper #content .bottom-row .qr-code img{height:100%;width:100%}.contentlayout.douban-info{display:flex;justify-content:space-around}.contentlayout.douban-info .detail{flex:1}.detail .title{font-size:26px;font-weight:600;margin-bottom:20px}.detail .title a{text-decoration:none}.movie-detail{display:flex;justify-content:space-between}.movie-detail .synopsis{width:60%}.movie-detail .movieinfo{margin-right:20px;max-width:30%}.icon-pt1{font-size:14px;display:inline-block;text-align:center;border:1px solid #41be57;background-color:#41be57;color:#fff;border-top-left-radius:4px;border-bottom-left-radius:4px;width:24px;height:24px;line-height:24px}.ant .icon-pt1{border-radius:4px}.icon-pt2{display:inline-block;text-align:center;border:1px solid #41be57;color:#3ba94d;background:#fff;border-top-right-radius:4px;border-bottom-right-radius:4px;width:69px;height:24px;line-height:24px;font-size:14px}.douban-dom{display:flex;cursor:pointer}.douban-dom{text-align:left}#douban-wrapper *{box-sizing:content-box}#douban-wrapper .clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden}#douban-wrapper .clearfix{zoom:1;display:inline-block;_height:1px}#douban-wrapper .clearfix{height:1%}#douban-wrapper .clearfix{display:block}#douban-wrapper .rating_per{color:#111}#douban-wrapper .grid{overflow:initial}.content-rounded #douban-wrapper div{margin-left:0}#douban-wrapper #content .douban-icon .icon-pt1{background-image:none}#douban-wrapper h2,#douban-wrapper h1{border:none;background-image:none;background-color:transparent;text-shadow:none;padding:0;margin:0;line-height:normal}#douban-wrapper .grid-col5{font-size:14px;padding:27px 14px 0 12px;width:190px;overflow-y:auto;height:277px;width:calc(100% - 795px)}.bigstar50:after{width:100%}.bigstar45:after{width:90%}.bigstar40:after{width:80%}.bigstar35:after{width:70%}.bigstar30:after{width:60%}.bigstar25:after{width:50%}.bigstar20:after{width:40%}.bigstar15:after{width:30%}.bigstar10:after{width:20%}.bigstar05:after{width:10%}.bigstar00:after{width:0}.bigstar00,.bigstar05,.bigstar10,.bigstar15,.bigstar20,.bigstar25,.bigstar30,.bigstar35,.bigstar40,.bigstar45,.bigstar50{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdGggZmlsbC1vcGFjaXR5PSIuMTIiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0ibTUuNDg2LjU0IDEuMDAzIDIuNTY0YS4zMS4zMSAwIDAgMCAuMjcyLjE5OGwyLjc0OC4xNjJhLjUyMS41MjEgMCAwIDEgLjMuOTI0TDcuNjgxIDYuMTMzYS4zMS4zMSAwIDAgMC0uMTA0LjMyMWwuNjk1IDIuNjY0YS41MjEuNTIxIDAgMCAxLS43ODUuNTdMNS4xNjkgOC4yMDVhLjMxLjMxIDAgMCAwLS4zMzggMEwyLjUxMyA5LjY5YS41MjEuNTIxIDAgMCAxLS43ODUtLjU3bC42OTUtMi42NjVhLjMxLjMxIDAgMCAwLS4xMDQtLjMyTC4xOSA0LjM4N2EuNTIxLjUyMSAwIDAgMSAuMy0uOTI0bDIuNzQ4LS4xNjJhLjMxLjMxIDAgMCAwIC4yNzItLjE5OEw0LjUxNC41NGEuNTIxLjUyMSAwIDAgMSAuOTcyIDAiLz48L3N2Zz4=);background-repeat:repeat-x;background-size:auto 100%;height:15px;margin:1px 0 5px;overflow:hidden;position:relative;width:75px}.bigstar00:after,.bigstar05:after,.bigstar10:after,.bigstar15:after,.bigstar20:after,.bigstar25:after,.bigstar30:after,.bigstar35:after,.bigstar40:after,.bigstar45:after,.bigstar50:after{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdGggZmlsbD0iI2Y5MCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJtNS40ODYuNTQgMS4wMDMgMi41NjRhLjMxLjMxIDAgMCAwIC4yNzIuMTk4bDIuNzQ4LjE2MmEuNTIxLjUyMSAwIDAgMSAuMy45MjRMNy42ODEgNi4xMzNhLjMxLjMxIDAgMCAwLS4xMDQuMzIxbC42OTUgMi42NjRhLjUyMS41MjEgMCAwIDEtLjc4NS41N0w1LjE2OSA4LjIwNWEuMzEuMzEgMCAwIDAtLjMzOCAwTDIuNTEzIDkuNjlhLjUyMS41MjEgMCAwIDEtLjc4NS0uNTdsLjY5NS0yLjY2NWEuMzEuMzEgMCAwIDAtLjEwNC0uMzJMLjE5IDQuMzg3YS41MjEuNTIxIDAgMCAxIC4zLS45MjRsMi43NDgtLjE2MmEuMzEuMzEgMCAwIDAgLjI3Mi0uMTk4TDQuNTE0LjU0YS41MjEuNTIxIDAgMCAxIC45NzIgMCIvPjwvc3ZnPg==);background-repeat:repeat-x;background-size:auto 100%;content:"";height:100%;left:0;position:absolute;top:0}.bigstar00+span.rating_num,.bigstar05+span.rating_num,.bigstar10+span.rating_num,.bigstar15+span.rating_num,.bigstar20+span.rating_num,.bigstar25+span.rating_num,.bigstar30+span.rating_num,.bigstar35+span.rating_num,.bigstar40+span.rating_num,.bigstar45+span.rating_num,.bigstar50+span.rating_num{font-size:16px;line-height:1}#douban-wrapper .summary{padding-top:10px;color:#000;line-height:25px;letter-spacing:1px;word-break:break-all;font-weight:400}#douban-wrapper{width:100%!important}.douban-dom>div{width:100%}#douban-wrapper #content{background-image:none!important;background:#fff;padding:0!important;width:calc(100% - 20px)!important}#douban-wrapper #content .grid{width:100%!important}.bhd #douban-wrapper ::-webkit-scrollbar-track{background-color:#fff}.bhd #douban-wrapper ::-webkit-scrollbar-thumb{background-color:#ddd}.btn #douban-wrapper .grid-col1,.hdb #douban-wrapper .grid-col1,.hdt #douban-wrapper .grid-col1,.sc #douban-wrapper .grid-col1,.its #douban-wrapper .grid-col1,.bb #douban-wrapper .grid-col1{display:none}.btn #douban-wrapper .grid-col5,.hdt #douban-wrapper .grid-col5,.hdb #douban-wrapper .grid-col5,.sc #douban-wrapper .grid-col5,.its #douban-wrapper .grid-col5,.bb #douban-wrapper .grid-col5{width:calc(100% - 570px)}.its #douban-wrapper{background-color:#131313;color:#fff} ');

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
  const PT_SITE = { "aither.cc": { "url": "https://aither.cc", "host": "aither.cc", "siteName": "Aither", "poster": "#meta-poster", "imdb": '.badge-user a[href*="imdb.com/title"]:nth-child(1)', "insertDomSelector": ".torrent-buttons", "doubanContainerDom": '<div class="movie-wrapper"><div class="movie-overlay" style="background-color: rgba(81, 51, 40, 0.75);"></div><div class="douban-dom" style="position: relative;z-index: 2;"></div></div>' }, "anthelion.me": { "url": "https://anthelion.me", "host": "anthelion.me", "siteName": "ANT", "siteType": "gazelle", "imdb": { "request": '.layout a[href*="imdb.com/title"]:first', "torrent": '.torrent_ratings a[href*="imdb.com/title"]:first' } }, "avistaz.to": { "url": "https://avistaz.to", "host": "avistaz.to", "siteName": "AvistaZ", "imdb": '.movie-details .badge-extra a[href*="imdb.com/title"]:first', "titleDom": ".title .torrent-filename", "poster": ".movie-poster img", "insertDomSelector": ".movie-poster", "doubanContainerDom": '<div class="douban-dom" style="justify-content: flex-start;"></div>' }, "baconbits.org": { "url": "https://baconbits.org", "host": "baconbits.org", "siteName": "bB", "imdb": '.box .body a[href*="imdb.com/title"]:first', "insertDomSelector": ".linkbox:first", "titleDom": "h1:first", "doubanContainerDom": '<div class="douban-dom bb"></div>' }, "beyond-hd.me": { "url": "https://beyond-hd.me", "host": "beyond-hd.me", "siteName": "BHD", "imdb": '.movie-details a[href*="imdb.com/title"]:nth-child(1)', "insertDomSelector": ".movie-wrapper", "doubanContainerDom": '<div class="douban-dom bhd"></div>', "poster": ".new-hacker" }, "blutopia.cc": { "url": "https://blutopia.cc", "host": "blutopia.cc", "siteName": "BLU", "poster": ".meta__poster", "imdb": '.meta__imdb a[href*="imdb.com/title"]:nth-child(1)', "insertDomSelector": ".torrent__buttons", "doubanContainerDom": '<div class="douban-dom" style="position: relative;z-index: 2;"></div>' }, "broadcasthe.net": { "url": "https://broadcasthe.net", "host": "broadcasthe.net", "siteName": "BTN", "imdb": '.stats td a[href*="imdb.com/title"]', "insertDomSelector": "#content .linkbox", "poster": ".sidebar .box img:first", "doubanContainerDom": '<div class="douban-dom btn" style="display:flex;justify-content: center;width: 850px;margin-left: -20px;"></div>' }, "broadcity.in": { "url": "https://broadcity.in", "host": "broadcity.in", "siteName": "Bdc", "imdb": '#imdbdetails a[href*="imdb.com/title"]', "titleDom": "#details>table>tbody>tr:first", "insertDomSelector": "#imdbdetails", "poster": "#ts_show_preview img", "doubanContainerDom": '<div class="douban-dom bdc" style="display:flex;justify-content: center;"></div>' }, "eiga.moi": { "url": "https://eiga.moi", "host": "eiga.moi", "siteName": "ACM", "poster": "img.movie-poster", "imdb": '.badge-user a[href*="imdb.com/title"]:nth-child(1)', "insertDomSelector": "#vue", "doubanContainerDom": '<div class="douban-dom" style="width: 1100px;"></div>' }, "filelist.io": { "url": "https://filelist.io", "host": "filelist.io", "siteName": "FL", "imdb": '.cblock-innercontent div a[href*="imdb.com/title"]:first', "poster": 'img[width="300px"][src*="image.tmdb.org"]', "titleDom": ".cblock-header h4", "insertDomSelector": ".cblock-innercontent hr.separator:first", "doubanContainerDom": '<div class="douban-dom" style="width: 100%;padding-top:20px;"></div>' }, "hd-torrents.org": { "url": "https://hd-torrents.org", "host": "hd-torrents.org", "siteName": "HDT", "poster": "#IMDBDetailsInfoHideShowTR .imdbnew a img", "imdb": '.imdbnew2 a[href*="imdb.com/title"]:first', "insertDomSelector": "td.detailsleft:contains(IMDb)", "doubanContainerDom": '<tr><td align="left" class="detailsleft">豆瓣</td><td valign="top" align="left" class="detailshash douban-dom hdt"></td></tr>' }, "hdbits.org": { "url": "https://hdbits.org", "host": "hdbits.org", "siteName": "HDB", "imdb": { "movie": ".contentlayout h1 a", "tv": "#details .showlinks li:nth-child(2) a", "tvRequest": ".lottery_table2 .showlinks li:nth-child(2) a" }, "titleDom": "h1:first", "insertDomSelector": "#details>tbody>tr:nth-child(2),.lottery_table2>tbody>tr:nth-child(1)", "doubanContainerDom": '<tr><td><div id="l7829483" class="label collapsable" onclick="showHideEl(7829483);(7829483)"><span class="plusminus">- </span>豆瓣信息</div><div id="c7829483" class="hideablecontent" ><div class="contentlayout douban-dom hdb"></div></td></tr>' }, "iptorrents.com": { "url": "https://iptorrents.com", "host": "iptorrents.com", "siteName": "IPT", "imdb": '.main td a[href*="imdb.com/title"]', "titleDom": ".dBox h1", "insertDomSelector": ".dBox .info", "doubanContainerDom": '<div class="douban-dom" style="display:flex;justify-content: center;"></div>' }, "karagarga.in": { "url": "https://karagarga.in", "host": "karagarga.in", "siteName": "KG", "imdb": 'td a[href*="imdb.com/title"]:first', "insertDomSelector": ".outer h1~table:first", "doubanContainerDom": '<div class="douban-dom kg" style="width:1100px;padding-top:20px;"></div>' }, "passthepopcorn.me": { "url": "https://passthepopcorn.me", "host": "passthepopcorn.me", "siteName": "PTP", "siteType": "gazelle", "imdb": { "request": '#request-table a[href*="imdb.com/title"]:first', "torrent": "#imdb-title-link" } }, "privatehd.to": { "url": "https://privatehd.to", "host": "privatehd.to", "siteName": "PHD", "imdb": '.movie-details .badge-extra a[href*="imdb.com/title"]:first', "titleDom": ".title .torrent-filename", "poster": ".movie-poster img", "insertDomSelector": ".movie-poster", "doubanContainerDom": '<div class="douban-dom" style="justify-content: flex-start;"></div>' }, "secret-cinema.pw": { "url": "https://secret-cinema.pw", "host": "secret-cinema.pw", "siteName": "SC", "imdb": '.torrent_row a[href*="imdb.com/title"]:first', "insertDomSelector": ".linkbox:first", "doubanContainerDom": '<div class="douban-dom sc"></div>' }, "shadowthein.net": { "url": "http://shadowthein.net", "host": "shadowthein.net", "siteName": "iTS", "imdb": '.IMDBtable a[href*="imdb.com/title"]:first', "insertDomSelector": "h1+table.line", "titleDom": "h1:first", "doubanContainerDom": '<div class="douban-dom its"></div>' }, "tgx.rs": { "url": "https://tgx.rs", "host": "tgx.rs", "siteName": "TorrentGalaxy", "poster": "#covercell img", "imdb": '#imdbpage[href*="imdb.com/title"]', "titleDom": ".torrentpagetable.limitwidth:first a.textshadow", "insertDomSelector": ".buttonbox", "doubanContainerDom": '<div class="douban-dom" style="display:flex;justify-content: center;"></div>' }, "uhdbits.org": { "url": "https://uhdbits.org", "host": "uhdbits.org", "siteName": "UHD", "imdb": ".tooltip.imdb_icon", "poster": ".poster_box .imgbox img", "insertDomSelector": "div.head:contains(IMDB)", "doubanContainerDom": '<div class="box"><div class="head"><a href="#">↑</a>&nbsp;<strong>豆瓣</strong></div><div class="body douban-dom"></div></div>' }, "www.morethantv.me": { "url": "www.morethantv.me", "host": "morethantv.me", "siteName": "MTV", "imdb": '.metalinks a[href*="imdb.com/title"]', "insertDomSelector": "#content>.thin>div:first", "poster": ".sidebar img:first", "titleDom": ".details h2:first", "doubanContainerDom": '<div class="douban-dom mtv"></div>' }, "www.torrentleech.org": { "url": "https://www.torrentleech.org", "host": "torrentleech.org", "siteName": "IPT", "imdb": '.imdb-info a[href*="imdb.com/title"]', "titleDom": "#torrentnameid", "poster": ".imdb_cover img", "insertDomSelector": ".torrent-info .torrent-info-details", "doubanContainerDom": '<div class="douban-dom"></div>' } };
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
  const DOUBAN_API_URL = "https://api.douban.com/v2/movie";
  const addToPtpPage = (data) => {
    console.log(data);
    $(".page__title").prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
    if (data.summary) {
      const synopsisDom = `
    <div class="panel" id="douban-synopsis">
    <div class="panel__heading"><span class="panel__heading__title">中文简介</span></div>
    <div class="panel__body">
          <div id="synopsis">${data.summary}</div>
    </div>
    </div>`;
      $("#synopsis-and-trailer,#request-table").after(synopsisDom);
    }
    $("#movieinfo").before(`
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
      $("#movie-ratings-table tr").prepend(
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
    <br>(${data.votes} votes)</td>`
      );
    }
    $(".main-column").prepend($("#movie-ratings-table").parent());
  };
  const addToANTPage = (data) => {
    console.log(data);
    $(".header h2").prepend(`<a target='_blank' href="${data.link}">[${data.chineseTitle}] </a>`);
    if (data.summary) {
      const synopsisDom = `
    <div class="box torrent_description">
      <div class="head"><a href="#">↑</a>&nbsp;<strong>中文简介</strong></div>
      <div class="body" style="text-align:justify">${data.summary}</div>
    </div>`;
      $(".torrent_description,.box_request_desc").after(synopsisDom);
    }
    $(".box_details:first").before(`
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
      $(".box.torrent_ratings .body tr").prepend(
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
      <br>(${data.votes} votes)</td>`
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
          if ($(`${imdbConfig[key]}`)[0]) {
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
  const getTvSeasonData = async (data) => {
    var _a2, _b2;
    const torrentTitle = getTorrentTitle();
    const { episodes = "", chineseTitle } = data;
    if (episodes) {
      const seasonNumber = (_b2 = (_a2 = torrentTitle.match(/S(?!eason)\s*?0?(\d+)\.?(EP?\d+)?/i)) == null ? void 0 : _a2[1]) != null ? _b2 : 1;
      if (parseInt(seasonNumber) === 1) {
        return data;
      } else {
        const query = `${chineseTitle} 第${seasonNumber}季`;
        const params = encodeURI("apikey=0ab215a8b1977939201640fa14c66bab");
        const searchData = await fetch(`${DOUBAN_API_URL}/search?q=${query}`, {
          data: params,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
        if (searchData.count > 0) {
          return { id: searchData.subjects[0].id };
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
        const savedIds = GM_getValue("ids") || {};
        savedIds[imdbId] = __spreadValues({
          doubanId,
          updateTime: Date.now()
        }, doubanInfo);
        GM_setValue("ids", savedIds);
        return doubanInfo;
      } else {
        console.log("豆瓣数据获取失败");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getDoubanInfoByIMDB = async (imdbId) => {
    var _a2, _b2, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    try {
      const params = encodeURI("apikey=0ab215a8b1977939201640fa14c66bab");
      const doubanData = await fetch(`${DOUBAN_API_URL}/imdb/${imdbId}`, {
        data: params,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      const { title, attrs = {}, image, summary, rating, alt_title: altTitle, mobile_link: mobileLink } = doubanData;
      let chineseTitle = title;
      const isChineseReg = /[\u4e00-\u9fa5]+/;
      if (!isChineseReg.test(title) && !title.match(/^\d+$/)) {
        if (altTitle) {
          chineseTitle = altTitle.split("/")[0].trim();
        } else {
          chineseTitle = title;
        }
      }
      const subjectLink = mobileLink.replace("m.douban.com/movie", "movie.douban.com").replace(/\/$/, "");
      const doubanId = (_b2 = (_a2 = subjectLink.match(/subject\/(\d+)/)) == null ? void 0 : _a2[1]) != null ? _b2 : "";
      const doubanInfo = {
        director: (_c2 = attrs.director) == null ? void 0 : _c2.join(" / "),
        runtime: (_d = attrs.movie_duration) == null ? void 0 : _d.join(" / "),
        language: (_e = attrs.language) == null ? void 0 : _e.join(" / "),
        genre: (_g = (_f = attrs.movie_type) == null ? void 0 : _f.join(" / ")) != null ? _g : "",
        aka: altTitle || "",
        region: (_h = attrs.country) == null ? void 0 : _h.join(" / "),
        link: subjectLink,
        poster: image,
        summary,
        chineseTitle,
        votes: rating.numRaters,
        average: rating.average,
        id: (_j = (_i = subjectLink.match(/subject\/(\d+)/)) == null ? void 0 : _i[1]) != null ? _j : "",
        episodes: (_l = (_k = attrs.episodes) == null ? void 0 : _k.join(" / ")) != null ? _l : ""
      };
      if (!attrs.episodes) {
        const savedIds = GM_getValue("ids") || {};
        savedIds[imdbId] = __spreadValues({
          doubanId,
          updateTime: Date.now()
        }, doubanInfo);
        GM_setValue("ids", savedIds);
      }
      return doubanInfo;
    } catch (error) {
      console.log(error);
    }
  };
  const formatDoubanInfo = async (domString) => {
    var _a2, _b2;
    const dom = new DOMParser().parseFromString(domString, "text/html");
    const chineseTitle = $("title", dom).text().replace("(豆瓣)", "").trim();
    const jsonData = JSON.parse($('head > script[type="application/ld+json"]', dom).html().replace(/(\r\n|\n|\r|\t)/gm, ""));
    const fetchAnchor = function(anchor) {
      var _a3, _b3, _c2, _d;
      return (_d = (_c2 = (_b3 = (_a3 = anchor == null ? void 0 : anchor[0]) == null ? void 0 : _a3.nextSibling) == null ? void 0 : _b3.nodeValue) == null ? void 0 : _c2.trim()) != null ? _d : "";
    };
    const rating = jsonData.aggregateRating ? jsonData.aggregateRating.ratingValue : 0;
    const votes = jsonData.aggregateRating ? jsonData.aggregateRating.ratingCount : 0;
    const director = jsonData.director ? jsonData.director : [];
    const poster = jsonData.image.replace(/s(_ratio_poster|pic)/g, "l$1").replace(/img\d/, "img9");
    const link = `https://movie.douban.com${jsonData.url}`;
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
      } else if (CURRENT_SITE_NAME === "UHD") {
        const torrentId = getUrlParam("torrentid");
        const torrentFilePathDom = $(`#files_${torrentId} .filelist_path`);
        const torrentFileDom = $(`#files_${torrentId} .filelist_table>tbody>tr:nth-child(2) td`).eq(0);
        titleDom = torrentFilePathDom || torrentFileDom;
      } else if (CURRENT_SITE_NAME === "HDT") {
        return document.title.replace(/HD-Torrents.org\s*-/ig, "").trim();
      }
    }
    return $(titleDom).text();
  };
  const getUrlParam = (key) => {
    const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    const regArray = location.search.substr(1).match(reg);
    if (regArray) {
      return unescape(regArray[2]);
    }
    return "";
  };
  const createDoubanDom = async (doubanId, imdbId, doubanInfo) => {
    const div = document.createElement("div");
    let { doubanContainerDom, insertDomSelector, siteName, poster } = CURRENT_SITE_INFO;
    if (siteName.match(/(HDT)$/)) {
      insertDomSelector = $(insertDomSelector).parent();
    }
    $(insertDomSelector).before(doubanContainerDom);
    const doubanLink = `https://movie.douban.com/subject/${doubanId}`;
    let htmlData = await fetch(`${doubanLink}/output_card`, {
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
    $(".douban-dom .grid-col4").after(`
  <div class="fix-col grid-col3">
  <div class="line-wrap">
  </div>
  </div>
  <div class="fix-col grid-col5"></div>`);
    const doubanData = doubanInfo || await getDoubanInfo(doubanId, imdbId);
    $(".douban-dom .grid-col5").html(`<div class="summary">${doubanData.summary || "暂无简介"}</div>`);
    let posterStyle = $(".picture-douban-wrapper").attr("style");
    const posterImg = $(poster).attr("src") ? $(poster).attr("src") : doubanData.poster;
    posterStyle = posterStyle == null ? void 0 : posterStyle.replace(/\(.+\)/, `(${posterImg})`);
    $(".picture-douban-wrapper").attr("style", posterStyle);
    $(".douban-dom").click(() => {
      GM_openInTab(doubanLink);
    });
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
            reject(new Error(statusText || status));
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
  (async () => {
    if (CURRENT_SITE_INFO) {
      const imdbId = getImdbId();
      if (!imdbId) {
        return;
      }
      try {
        const savedIds = GM_getValue("ids") || {};
        if (!savedIds[imdbId] || savedIds[imdbId] && savedIds[imdbId].updateTime && Date.now() - savedIds[imdbId].updateTime >= 30 * 24 * 60 * 60 * 1e3) {
          let doubanId = "";
          const movieData = await getDoubanInfoByIMDB(imdbId);
          if (!movieData) {
            throw new Error("没有找到豆瓣条目");
          }
          const { id = "", episodes = "" } = movieData;
          doubanId = id;
          if (episodes) {
            const tvData = await getTvSeasonData(movieData);
            doubanId = tvData.id;
          }
          if (CURRENT_SITE_NAME.match(/PTP/)) {
            addToPtpPage(movieData);
          } else if (CURRENT_SITE_NAME.match(/ANT/)) {
            addToANTPage(movieData);
          } else {
            createDoubanDom(doubanId, imdbId);
          }
        } else {
          const savedData = savedIds[imdbId];
          if (CURRENT_SITE_NAME.match(/PTP/)) {
            addToPtpPage(savedData);
          } else if (CURRENT_SITE_NAME.match(/ANT/)) {
            addToANTPage(savedData);
          } else {
            createDoubanDom(savedData.doubanId, imdbId, savedData);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  })();

})(jQuery);