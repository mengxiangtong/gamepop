/**
 * Created by meathill on 14-8-28.
 */
;(function (ns) {
  ns.HotGame = Backbone.View.extend({
    events: {
      'refresh': 'refreshHandler'
    },
    initialize: function () {
      this.render();
    },
    render: function () {
      this.collection.each(function (model) {
        this.$('[data-id=' + model.id + ']').find('.bookmark-button').addClass('active');
      }, this);
    },
    refreshHandler: function () {
      this.render();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));