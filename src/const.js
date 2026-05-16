import { PT_SITE } from './config.json';

const host = location.host;
let siteInfo = PT_SITE?.[host] ?? '';
if (host && host.match(/iptorrents/i)) {
  siteInfo = PT_SITE['iptorrents.com'];
} else {
  siteInfo = PT_SITE?.[host] ?? '';
}
const CURRENT_SITE_INFO = siteInfo;
const CURRENT_SITE_NAME = CURRENT_SITE_INFO?.siteName ?? '';
const DOUBAN_SUBJECT_URL = 'https://movie.douban.com/subject/{doubanId}';
const DOUBAN_SEARCH_API = 'https://movie.douban.com/j/subject_suggest?q={query}';
const DOUBAN_SUGGEST_API = 'https://www.douban.com/search?cat=1002&q={query}';
const DOUBAN_API_URL = 'https://api.douban.com/v2/movie';
export {
  CURRENT_SITE_INFO,
  CURRENT_SITE_NAME,
  DOUBAN_API_URL,
  DOUBAN_SEARCH_API,
  DOUBAN_SUGGEST_API,
  DOUBAN_SUBJECT_URL,
};
