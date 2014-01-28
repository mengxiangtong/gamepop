/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var LOCAL_NAME = 'feeds';

  ns.FeedsCollection = Backbone.Collection.extend({
    initialize: function () {
      this.url = config.feeds;
      if (navigator.onLine) {
        this.fetch();
      } else {
        var cache = localStorage.getItem(LOCAL_NAME);
        cache = cache ? JSON.parse(cache) : [];
        this.reset(cache);
      }
    },
    parse: function (response) {
      this.reset(response.rss.channel.item);
      localStorage.setItem(LOCAL_NAME, JSON.stringify(this.toJSON()));
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));