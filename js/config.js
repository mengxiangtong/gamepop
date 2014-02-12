/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  feeds: 'http://a.yxpopo.com/newslist.php',
  local: 'local/',
  remote: 'http://a.yxpopo.com/vguide/',
  news: 'http://a.yxpopo.com/news-detail.php?id=',
  require: 'http://www.yxpopo.com/require/'
};

if (DEBUG) {
  config.apps = 'mocks/apps.json';
}