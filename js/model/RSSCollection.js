/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  'use strict';

  var KEY = 'rss'
    , Model = Backbone.Model.extend({
      idAttribute: 'guide_name'
    });

  ns.RSSCollection = Backbone.Collection.extend({
    model: Model,
    initialize: function (models, options) {
      this.url = config.rss;
      options.apps.once('reset', this.apps_resetHandler, this);
    },
    add: function (models, options) {
      Backbone.Collection.prototype.add.call(this, models, options);
      this.save();
    },
    remove: function (models, options) {
      Backbone.Collection.prototype.remove.call(this, models, options);
      this.save();
    },
    save: function () {
      var json = JSON.stringify(this.toJSON());
      localStorage.setItem(KEY, json);
    },
    apps_resetHandler: function (collection) {
      var top4 = collection.toJSON()
        , store = localStorage.getItem(KEY);
      // top4的游戏都是订阅的，自动补充时间
      for (var i = 0, len = top4.length; i < len; i ++) {
        top4[i].guide_name = top4[i].id;
        top4[i].time = Date.now();
      }
      this.set(top4, {silent: true, remove: false});
      if (store) {
        store = JSON.parse(store);
        this.set(store);
      }
      this.fetch({
        data: {
          list: this.toJSON()
        },
        type: 'post',
        reset: true
      });
    },
  });
}(Nervenet.createNameSpace('gamepop.model')));
