/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.AppsList = Backbone.View.extend({
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());

      this.collection.on('reset', this.render, this);
    },
    render: function (collection) {
      this.$el.html(this.template({apps: collection.toJSON()}));
    }
  });
}(Nervenet.createNameSpace('Gamepop.view')));