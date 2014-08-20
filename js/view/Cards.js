/**
 * Created by meathill on 14-8-11.
 */
;(function (ns) {
  'use strict';

  var lazyLoad = gamepop.component.lazyLoad;

  ns.Cards = Backbone.View.extend({
    events: {
      'tap .handle': 'handle_tapHandler',
      'transitionend': 'transitionEndHandler',
      'webkitTransitionEnd': 'transitionEndHandler'
    },
    initialize: function () {
      this.model = new (Backbone.Model.extend({
        urlRoot: config.api
      }))();
      this.model.on('change', this.model_changeHandler, this);
      this.model.fetch();
    },
    handle_tapHandler: function () {
      this.$el.toggleClass('active');

    },
    model_changeHandler: function (model) {
      for (var prop in model.changed) {
        var data = model.get(prop)
          , html = TEMPLATES[prop](_.isArray(data) ? {list: data} : data);
        this.$('.' + prop).html(html);

        if (prop === 'girl') {
          this.$('.girl.item').data('href', '#/remote/girl/0/' + data.id + '/detail.html');
        }
      }
    },
    transitionEndHandler: function () {
      if (this.$el.hasClass('active')) {
        lazyLoad(this.el);
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));