/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var LOCAL = 'news',
      curr = 0;
  ns.FeedsCollection = Backbone.Collection.extend({
    initialize: function () {
      var store = localStorage.getItem(LOCAL);
      if (store) {
        store = JSON.parse(store);
        this.reset(store);
      }
      this.url = config.feeds;
      this.fetch({
        reset: true,
        data: {
          ps: 20
        }
      });
    },
    parse: function (response) {
      var store = JSON.stringify(response.list);
      localStorage.setItem(LOCAL, store);
      return response.list;
    },
    next: function () {
      curr++;
      if (curr > 10) {
        return;
      }
      this.fetch({
        data: {
          ps: 20,
          p: curr
        }
      });
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));