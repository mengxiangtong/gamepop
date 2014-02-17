/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.FeedsCollection = Backbone.Collection.extend({
    initialize: function () {
      this.url = config.feeds;
      this.fetch({
        reset: true,
        data: {
          ps: 20,
          ts: Date.now()
        }
      });
    },
    parse: function (response) {
      return response.list;
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));