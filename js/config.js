/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  remote: 'http://a.yxpopo.com/vguide/',
  topgame: 'http://a.yxpopo.com/topgame.php',
  search: 'http://s.yxpopo.com/search.do'
};
if (DEBUG) {
  config.apps = 'mocks/apps.json';
  //config.remote ='http://meathill.pc/gamepop-api/vguide/';
  //config.topgame = 'http://meathill.pc/gamepop-api/topgame.php';
}
