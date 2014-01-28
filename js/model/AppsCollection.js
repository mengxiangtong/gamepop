/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var LOCAL_NAME = 'apps';
  ns.AppsCollection = Backbone.Collection.extend({
    initialize: function () {
      this.url = config.apps;
      if (navigator.onLine) {
        this.fetch();
      } else {
        var cache = localStorage.getItem(LOCAL_NAME);
        cache = cache ? JSON.parse(cache) : [];
        this.reset(cache);
      }
    },
    parse: function (response) {
      if (_.isArray(response)) {
        this.reset(response);
      } else if ('apps' in response) {
        this.reset(response.apps);
      }
      localStorage.setItem(LOCAL_NAME, JSON.stringify(this.toJSON()));
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));