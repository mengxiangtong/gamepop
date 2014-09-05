/**
 * Created by meathill on 14-8-28.
 */
;(function (ns) {
  'use strict';

  var lazyLoad = gamepop.component.lazyLoad;

  ns.Boobs = Backbone.View.extend({
    count: 0,
    page: 0,
    events: {
      'need-more': 'needMoreHandler',
      'tap .tabs li': 'tab_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.boobs;
      this.left = this.$('.column').first();
      this.right = this.$('.column').last();
      this.collection = new (Backbone.Collection.extend({
        url: config.girl
      }))();
      this.collection.on('reset', this.collection_resetHandler, this);
      this.collection.on('sync', this.collection_syncHandler, this);
      this.collection.fetch({reset: true});

      var self = this;
      this.$('.waterfall').on('scroll', function () {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
          lazyLoad(self.el);
        }, 200);
      });
    },
    render: function (model) {
      // 因为现在导读图尺寸是一样的，所以暂时一边一个就好
      var column = this.count & 1 ? this.right : this.left;
      column.append(this.template(model.toJSON()));
      this.count++;
    },
    remove: function () {
      this.collection.off();
      this.$('.waterfall').off('scroll');
      Backbone.View.prototype.remove.call(this);
    },
    collection_addHandler: function (model) {
      this.render(model);
    },
    collection_resetHandler: function () {
      this.collection.each(this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
    },
    collection_syncHandler: function () {
      lazyLoad(this.el);
      if (this.$('.waterfall').height() >= Math.max(this.left.height(), this.right.height())) {
        this.$('.waterfall').addClass('no-scroll');
      }
    },
    tab_tapHandler: function (event) {
      var button = $(event.currentTarget)
        , category = button.data('category');
      if (button.hasClass('active')) {
        return;
      }
      button.addClass('active')
        .siblings().removeClass('active');
      this.left.empty();
      this.right.empty();
      this.$('.waterfall').removeClass('no-scroll');
      this.collection.off('add');
      this.collection.url = category ? config.girl + category : config.girl;
      this.collection.fetch({reset: true});
      this.count = this.page = 0;
    },
    needMoreHandler: function () {
      this.collection.fetch({data: {page: this.page + 1}});
      this.page++;
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));