/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  'use strict';

  ns.AppsList = Backbone.View.extend({
    events: {
      'tap .item': 'item_tapHandler',
      'tap .no-game': 'noGame_tapHandler'
    },
    initialize: function (options) {
      this.template = TEMPLATES.installed;

      this.collection.on('reset', this.render, this);
      options.rss.once('sync', this.rss_syncHandler, this);
    },
    render: function (collection) {
      this.$el.html(this.template({apps: collection.toJSON()}));
    },
    noGame_tapHandler: function (event) {
      ga.event(['view', 'recommended', $(event.currentTarget).data('href')].join(','));
    },
    rss_syncHandler: function (collection) {
      this.$('.item').each(function () {
        var id = this.id.substr(4)
          , model = collection.get(id);
        if (model && model.get('NUM')) {
          $(this).append('<span>' + model.get('NUM') + '</span>');
        }
      });
    },
    item_tapHandler: function (event) {
      $(event.currentTarget).find('span').remove();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));