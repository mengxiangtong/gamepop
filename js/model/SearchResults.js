/**
 * Created by meathill on 14-4-18.
 */
;(function (ns) {
  ns.SearchResults = Backbone.Collection.extend({
    url: config.search,
    parse: function (response) {
      return response.list;
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));