/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.AppsCollection = Backbone.Collection.extend({
    initialize: function () {
      this.url = config.apps;
      this.fetch({reset: true});
    },
    parse: function (response) {
      if (_.isArray(response)) {
        return response;
      } else if ('apps' in response) {
        return response.apps;
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));