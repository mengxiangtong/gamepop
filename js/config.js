/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  feeds: 'http://a.yxpopo.com/newslist.php',
  local: 'local/',
  remote: 'http://a.yxpopo.com/vguide/',
  news: 'http://a.yxpopo.com/news-detail.php?id=',
  require: 'http://a.yxpopo.com/no_guide_log.php',
  all: 'http://a.yxpopo.com/vapi/game_list/'
};

if (DEBUG) {
  config.apps = 'mocks/apps.json';
}