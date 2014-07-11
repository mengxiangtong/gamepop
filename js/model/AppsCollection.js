/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  'use strict';

  ns.AppsCollection = Backbone.Collection.extend({
    device_id: '',
    channel_show: '',
    initialize: function () {
      this.url = config.apps;
      this.fetch({reset: true});
    },
    parse: function (response) {
      this.device_id = response.device_id;
      this.channel_show = response.channel_show;
      return response.apps;
    },
    toJSON: function (options) {
      return this.chain().first(4).map(function (model, i) {
        return model.toJSON(options);
      }).value();
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));