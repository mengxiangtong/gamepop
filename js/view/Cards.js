/**
 * Created by meathill on 14-8-11.
 */
;(function (ns) {
  'use strict';

  var lazyLoad = gamepop.component.lazyLoad;

  ns.Cards = Backbone.View.extend({
    $apps: null,
    events: {
      'tap .refresh': 'refresh_tapHandler',
      'transitionend': 'transitionEndHandler',
      'webkitTransitionEnd': 'transitionEndHandler'
    },
    initialize: function () {
      this.model = new (Backbone.Model.extend({
        urlRoot: config.api
      }))();
      this.model.on('change', this.model_changeHandler, this);
      this.collection.on('reset', this.collection_resetHandler, this);
    },
    collection_resetHandler: function (collection) {
      var guide_names = [];
      collection.forEach(function (model) {
        guide_names.push(model.id);
      });
      this.model.fetch({
        type: 'post',
        data: {
          guide_name: guide_names.join(',')
        }
      });
    },
    model_changeHandler: function (model) {
      for (var prop in model.changed) {
        if (!model.changed[prop]) {
          this.$('.' + prop).addClass('hide');
          continue;
        }
        var data = model.get(prop)
          , html = TEMPLATES[prop](_.isArray(data) ? {list: data} : data);
        this.$('.list.' + prop + ', .item.' + prop).html(html);

        if (prop === 'girl') {
          this.$('.girl.item').data('href', '#/remote/girl/0/' + data.id + '/detail.html');
        }
        this.$('[data-target=' + prop + ']').find('i').removeClass('fa-spin');
        if (this.model.id) { // 说明用户点了“换一换”
          lazyLoad(this.el);
        }
      }
      $('#cards-toggle').removeClass('hide'); // 显示按钮
    },
    refresh_tapHandler: function (event) {
      var target = $(event.currentTarget)
        , type = target.data('target');
      target.find('i').addClass('fa-spin');
      this.model.set('id', type, {silent: true});
      this.model.fetch();
    },
    transitionEndHandler: function () {
      if (this.$el.hasClass('active')) {
        lazyLoad(this.el);
        this.$el.next().show();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));