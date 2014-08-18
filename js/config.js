/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  remote: 'http://a.yxpopo.com/vguide/',
  topgame: 'http://a.yxpopo.com/topgame.php',
  search: 'http://s.yxpopo.com/search.do',
  rss: 'http://a.yxpopo.com/rss.php',
  ios_url: 'http://fast-cdn.dianjoy.com/gamemaster/popo_v1.2.0_003.ipa',
  android_url: 'http://fast-cdn.dianjoy.com/gamemaster/popo_v1.2.0_003_signed.apk'

};
if (DEBUG) {
  config.apps = 'mocks/apps.json';
  //config.remote ='http://meathill.pc/gamepop-api/vguide/';
  //config.rss = 'http://meathill.pc/gamepop-api/rss.php';
  //config.topgame = 'http://meathill.pc/gamepop-api/topgame.php';
}
