/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  'use strict';

  var KEY = 'rss'
    , REMOVED_KEY = 'removed_rss'
    , MAX = 9
    , Model = Backbone.Model.extend({
      idAttribute: 'guide_name',
      fetched: false,
      parse: function (response) {
        this.fetched = true;
        return response;
      },
      toJSON: function (options) {
        var data = Backbone.Model.prototype.toJSON.call(this);
        if (!options) {
          data.cid = this.cid;
        } else {
          delete data.NUM;
        }
        return data;
      }
    })
    // 用户本地安装了的要有特殊待遇，主要是为了保证关注/取消的正确表现
    , removed = new Backbone.Collection({
      model: Model
    });

  ns.RSSCollection = Backbone.Collection.extend({
    model: Model,
    initialize: function (models, options) {
      this.url = config.rss;
      this.on('change', this.changeHandler, this);
      options.apps.once('reset', this.apps_resetHandler, this);
      removed.on('add remove', this.removed_changeHandler, this);

      this.load();
    },
    add: function (models, options) {
      if ((!options || !options.remove) && this.length >= MAX) {
        this.remove(this.find(function (model) { return model.installed; }));
      }
      Backbone.Collection.prototype.add.call(this, models, options);
      this.save();
    },
    parse: function (response) {
      return _.filter(response, function (item) {
        return item.guide_name;
      });
    },
    remove: function (models, options) {
      Backbone.Collection.prototype.remove.call(this, models, options);
      this.save();
    },
    toJSON: function (options) {
      if (options) {
        return Backbone.Collection.prototype.toJSON.call(this, options);
      }
      return this.chain().filter(function (model) {
        return !model.get('installed');
      }).map(function (model) {
        return model.toJSON(options);
      }).value();
    },
    hasOtherUpdate: function () {
      return this.find(function (model) {
        return !model.get('installed') && model.get('NUM');
      });
    },
    load: function () {
      var store = localStorage.getItem(KEY);
      if (store) {
        store = JSON.parse(store);
        this.set(store);
      }
      store = localStorage.getItem(REMOVED_KEY);
      if (store) {
        store = JSON.parse(store);
        removed.set(store);
      }
    },
    save: function () {
      var json = JSON.stringify(this.toJSON(true));
      localStorage.setItem(KEY, json);
    },
    toggle: function (isActive, id, name, icon_path) {
      if (isActive) {
        var model = this.remove(id);
        if (model && model.get('installed')) {
          removed.add(model);
        }
      } else {
        var model = removed.remove(id) || {
          guide_name: id,
          game_name: name,
          icon_path: icon_path,
          time: Date.now() / 1000 >> 0
        };
        this.add(model);
      }
    },
    apps_resetHandler: function (collection) {
      // 合并apps的4个游戏
      var apps = collection.toJSON()
        , len = Math.min(apps.length, 4)
        , tops = [];
      for (var i = 0; i < len; i ++) {
        // 之前有，被取消关注了，不自动关注；仍在关注中，也不自动关注
        if (removed.get(apps[i].id) || this.get(apps[i].id)) {
          continue;
        }
        tops.push({
          guide_name: apps[i].id,
          time: Date.now() / 1000 >> 0,
          installed: true
        });
      }
      this.add(tops, {silent: true, remove: false});

      // 加载更新文章数
      if (this.length > 0) {
        this.fetch({
          data: {
            list: this.toJSON(true)
          },
          remove: false,
          type: 'post'
        });
      }
    },
    removed_changeHandler: function (collection) {
      var json = JSON.stringify(collection.toJSON());
      localStorage.setItem(REMOVED_KEY, json);
    },
    changeHandler: function () {
      this.save();
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));
