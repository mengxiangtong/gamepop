/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  remote: 'http://a.yxpopo.com/vguide/',
  topgame: 'http://a.yxpopo.com/topgame.php',
  search: 'http://s.yxpopo.com/search.do',
  rss: 'http://a.yxpopo.com/rss.php',
  api: 'http://a.yxpopo.com',
};
if (DEBUG) {
  config.apps = 'mocks/apps.json';
  config.api = 'http://meathill.pc/gamepop-api/';
  config.remote ='http://meathill.pc/gamepop-api/vguide/';
  //config.rss = 'http://meathill.pc/gamepop-api/rss.php';
  //config.topgame = 'http://meathill.pc/gamepop-api/topgame.php';
}
