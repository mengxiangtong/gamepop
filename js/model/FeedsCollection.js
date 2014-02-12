/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var LOCAL_NAME = 'feeds';

  ns.FeedsCollection = Backbone.Collection.extend({
    initialize: function () {
      this.url = config.feeds;
      if (navigator.onLine) {
        this.fetch({
          reset: true,
          data: {
            ps: 20
          }
        });
      } else {
        var cache = localStorage.getItem(LOCAL_NAME);
        cache = cache ? JSON.parse(cache) : [];
        this.reset(cache);
      }
    },
    parse: function (response) {
      localStorage.setItem(LOCAL_NAME, JSON.stringify(response.list));
      return response.list;
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));