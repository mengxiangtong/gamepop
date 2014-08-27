/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  remote: 'http://a.yxpopo.com/vguide/',
  topgame: 'http://a.yxpopo.com/topgame.php',
  search: 'http://s.yxpopo.com/search.do',
  rss: 'http://a.yxpopo.com/rss.php',
  api: 'http://a.yxpopo.com/cards.php',
  hot: 'http://a.yxpopo.com/hot/1.html'
};
if (DEBUG) {
  config.apps = 'mocks/apps.json';
  config.hot = 'http://meathill.pc/gamepop-api/hot/1.html';
  //config.api = 'http://meathill.pc/gamepop-api/cards.php';
  //config.remote ='http://meathill.pc/gamepop-api/vguide/';
  //config.rss = 'http://meathill.pc/gamepop-api/rss.php';
  config.topgame = 'http://meathill.pc/gamepop-api/topgame.php';
}
