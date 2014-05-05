/**
 * Created by meathill on 14-1-28.
 */
;(function (ns) {
  'use strict';
  ns.Offline = Backbone.View.extend({
    $context: null,
    events: {
      'tap .delete-button': 'deleteButton_tapHandler',
      'tap .download-button': 'downloadButton_tapHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());
      this.collection.on('change', this.collection_changeHandler, this);
      this.collection.on('reset', this.collection_resetHandler, this);
      this.render();
    },
    render: function () {
      if (!this.template) {
        return;
      }
      this.$el.html(this.template({apps: this.collection.toJSON()}));
    },
    setElement: function (el, delegate) {
      Backbone.View.prototype.setElement.call(this, el, delegate);
      this.render();
    },
    collection_changeHandler: function (model) {
      if ('has-offline' in model.changed || 'downloading' in model.changed) {
        var item = this.$('.' + model.id)
          , newItem = this.template({apps: [model.toJSON()]});
        item.replaceWith(newItem);
        return;
      }
      if ('progress'in model.changed) {
        $('.' + model.id).find('span').text(model.get('progress'))
          .end().find('.bar').width(model.get('progress') + '%');
      }
    },
    collection_resetHandler: function () {
      this.render();
    },
    deleteButton_tapHandler: function (event) {
      var target = $(event.currentTarget);
      if (target.hasClass('disabled')) {
        return;
      }
      var id = event.currentTarget.href.substr(9),
          model = this.collection.get(id);
      setTimeout(function () {
        model.set({
          "has-offline": false,
          "url": "#/remote/" + id + '/'
        });
      }, 600);
      target.addClass('disabled')
        .find('i').toggleClass('fa-trash fa-spin fa-spinner');
      location.href = event.currentTarget.href;
    },
    downloadButton_tapHandler: function (event) {
      var target = $(event.currentTarget);
      if (target.hasClass('disabled')) {
        return;
      }
      var names = event.currentTarget.href.substr(11).split('/');
      names[1] = decodeURIComponent(names[1]);
      this.$context.trigger('download', names[0], names[1], this.collection);
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));