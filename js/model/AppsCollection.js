/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.AppsCollection = Backbone.Collection.extend({
    deviceid: '',
    initialize: function () {
      this.url = config.apps;
      this.fetch({reset: true});
    },
    parse: function (response) {
      this.deviceid = response.deviceid;
      return response.apps;
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));