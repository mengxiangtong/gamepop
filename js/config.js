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
  hot: 'http://a.yxpopo.com/hot/',
  girl: 'http://a.yxpopo.com/girl/',
  ios_url: 'http://itunes.apple.com/cn/app/you-xi-bao-dian/id892347556?mt=8',
  android_url: 'http://fast-cdn.dianjoy.com/gamemaster/popo_v1.2.0_003_signed.apk'
};
if (DEBUG) {
  config.apps = 'mocks/apps.json';
  config.hot = 'http://meathill.pc/gamepop-api/hot/';
  config.girl = 'http://meathill.pc/gamepop-api/girl/';
  //config.api = 'http://meathill.pc/gamepop-api/cards.php';
  //config.remote ='http://meathill.pc/gamepop-api/vguide/';
  //config.rss = 'http://meathill.pc/gamepop-api/rss.php';
  config.topgame = 'http://meathill.pc/gamepop-api/topgame.php';
}
