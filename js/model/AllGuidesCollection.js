/**
 * Created by meathill on 14-2-10.
 */
;(function (ns) {
  ns.AllGuidesCollection = Backbone.Collection.extend({
    curr: 0,
    total: 0,
    model: Backbone.Model.extend({
      idAttribute: 'guide_name'
    }),
    initialize: function () {
      this.url = config.all + this.curr + '/';
      this.fetch({
        reset: true,
        data: {ts: Date.now()}
      })
    },
    parse: function (response) {
      this.total = Math.ceil(response.count / 20);
      return response.list;
    },
    next: function () {
      if (this.curr < this.total - 2) {
        this.curr += 1;
        this.url = config.all + this.curr + '/';
        this.fetch({
          reset: false,
          data: {ts: Date.now()}
        });
      }
      return true;
    },
    prev: function () {
      if (this.curr > 0) {
        this.curr -= 1;
        this.fetch();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));
