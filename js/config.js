/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  remote: 'http://a.yxpopo.com/vguide/',
  require: 'http://a.yxpopo.com/no_guide_log.php',
  search: 'http://s.yxpopo.com/search.do?m=game',
  info: 'http://a.yxpopo.com/gameinfo.php'
};
if (DEBUG) {
  config.apps = 'mocks/apps.json';
  config.remote ='http://meathill.pc/gamepop-api/vguide/';
  config.info = 'http://meathill.pc/gamepop-api/gameinfo.php';
}
