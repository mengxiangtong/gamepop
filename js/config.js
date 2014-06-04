/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  remote: 'http://a.yxpopo.com/vguide/',
  search: 'http://s.yxpopo.com/search.do?m=game'
};
if (DEBUG) {
  config.apps = 'mocks/apps.json';
  config.remote ='http://meathill.pc/gamepop-api/vguide/';
}
