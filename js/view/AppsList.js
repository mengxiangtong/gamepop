/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.AppsList = Backbone.View.extend({
    events: {
      'tap .no-game': 'noGame_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.installed;

      this.collection.on('reset', this.render, this);
    },
    render: function (collection) {
      this.$el.html(this.template({apps: collection.toJSON()}));
    },
    noGame_tapHandler: function (event) {
      ga.event(['view', 'recommended', $(event.currentTarget).data('href')].join(','));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));