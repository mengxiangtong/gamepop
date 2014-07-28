/**
 * Created by meathill on 14-5-15.
 */
;(function (ns) {
  'use strict';

  var GameModel = Backbone.Model.extend({idAttribute: 'guide_name'});

  ns.SearchCollection = Backbone.Collection.extend({
    $apps: null,
    $rss: null,
    $router: null,
    keyword: '',
    size: 12,
    url: config.search,
    parse: function (response) {
      this.total = response.hit;
      return response.rs_list;
    },
    fetch: function (options) {
      options = options || {};
      var data = {
        w: this.keyword,
        re: this.refer,
        p: this.page,
        did: this.$apps.device_id,
        m: 'game'
      };
      if (this.guide_name) {
        data.sf = 'guide_name:' + this.guide_name;
        data.m = 'game_article';
        this.model = Backbone.Model;
      } else {
        this.model = GameModel;
      }
      options.data = _.extend(data, options.data);
      Backbone.Collection.prototype.fetch.call(this, options);
    },
    toJSON: function () {
      var json = Backbone.Collection.prototype.toJSON.call(this);
      for (var i = 0, len = json.length; i < len; i++) {
        json[i].update_time = json[i].update_time.substr(0, 10);
        json[i].bookmark = !!this.$rss.get(json[i].guide_name);
      }
      return json;
    },
    next: function () {
      this.page += 1;
      this.fetch({remove: false});
    },
    search: function () {
      var data = this.$router.data;
      if (data.keyword === this.keyword && data.guide_name === this.guide_name) {
        this.page = this.length / this.size;
        this.trigger('reset', this);
        return;
      }
      this.keyword = data.keyword;
      this.page = 1;
      this.refer = '';
      this.guide_name = data.guide_name;
      this.fetch({reset: true});
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));