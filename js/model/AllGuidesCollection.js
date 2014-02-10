/**
 * Created by meathill on 14-2-10.
 */
;(function (ns) {
  ns.AllGuidesCollection = Backbone.Collection.extend({
    curr: 1,
    baseUrl: 'http://a.yxpopo.com/vapi/game_list/',
    fetch: function () {
      this.url = this.baseUrl + this.curr + '/';
      Backbone.Collection.prototype.fetch.call(this, {
        reset: true,
        data: this.options
      });
    },
    parse: function (response) {

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