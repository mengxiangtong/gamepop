/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  feeds: 'http://a.yxpopo.com/newslist.php',
  local: 'local/',
  remote: 'http://a.yxpopo.com/vguide/',
  news: 'http://a.yxpopo.com/news-detail.php',
  require: 'http://a.yxpopo.com/no_guide_log.php',
  all: 'http://a.yxpopo.com/vapi/game_list/',
  search: 'http://s.yxpopo.com/search.do?m=game'
};
if (DEBUG) {
  config.apps = 'mocks/apps.json';
  config.news = 'http://meathill.pc/gamepop-api/news-detail.php';
  config.remote ='http://meathill.pc/gamepop-api/vguide/';
  config.feeds = 'http://meathill.pc/gamepop-api/newslist.php';
  config.localhost = 'meathill.pc';
  config.all = 'http://meathill.pc/gamepop-api/game_list/';
}
