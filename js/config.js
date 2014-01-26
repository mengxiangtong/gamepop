/**
 * Created by meathill on 14-1-22.
 */
var config = {
  apps: 'apps.json',
  feeds: 'feeds.json',
  local: 'local/',
  remote: 'http://yxpopo.com/'
};

if (DEBUG) {
  for (var prop in config) {
    config[prop] = 'mocks/' + config[prop];
  }
}