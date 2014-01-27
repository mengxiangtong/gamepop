/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  feeds: 'feeds.json',
  local: 'local/',
  remote: 'http://r.yxpopo.com/guide',
  require: 'http://www.yxpopo.com/require/'
};

if (DEBUG) {
  for (var prop in config) {
    config[prop] = 'mocks/' + config[prop];
  }
}