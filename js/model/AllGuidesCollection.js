/**
 * Created by meathill on 14-2-10.
 */
;(function (ns) {
  ns.AllGuidesCollection = Backbone.Collection.extend({
    baseUrl: 'http://a.yxpopo.com/vapi/game_list/',
    curr: 1,
    model: Backbone.Model.extend({
      idAttribute: 'guide_name'
    }),
    options: {
      group: '0',
      sort: 'order_by_pub'
    },
    fetch: function () {
      this.url = this.baseUrl + this.curr + '/';
      Backbone.Collection.prototype.fetch.call(this, {
        reset: true,
        data: this.options
      });
    },
    next: function () {
      this.curr += 1;
      this.fetch();
    },
    prev: function () {
      if (this.curr > 1) {
        this.curr -= 1;
        this.fetch();
      }
    },
    setOptions: function (group, sort) {
      this.options = {
        group: group,
        sort: sort
      };
      this.fetch();
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));