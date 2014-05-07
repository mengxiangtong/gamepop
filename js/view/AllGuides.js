/**
 * Created by meathill on 14-1-28.
 */
;(function (ns) {
  'use strict';
  var more = false;
  var loading = false;
  var fragment = '';
  var lazyLoad = gamepop.component.lazyLoad;
  var next;

  ns.AllGuides = Backbone.View.extend({
    $context: null,
    events: {
      'tap .item': 'item_tapHandler',
      'tap .next': 'button_nextHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html().replace(/\s{2,}|\n/g, ''));
      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('sync', this.collection_readyHandler, this);

      this.render();
      var scroll = this.scroll = new IScroll(this.el, {
        probeType: 2,
        scrollX: false,
        scrollY: true,
        scrollbars: false
      });
      scroll.on('scroll', _.bind(this.onScroll, this, scroll));
      scroll.on('scrollStart', _.bind(this.onScrollStart, this, scroll));
      scroll.on('scrollEnd', _.bind(this.onScrollEnd, this, scroll));
    },
    render: function () {
      if (!this.template || !this.collection.length) {
        return;
      }
      this.$('.all-guides-list').html(this.template({games: this.collection.toJSON()}));

      this.$('.filter i').remove();
      setTimeout(_.bind(function () {
        this.scroll.refresh();
      }, this), 2000);
    },
    button_nextHandler: function () {
      next = false;
      this.$('.all-guides-list').empty();
      this.$('.next').hide();
      this.$('.more').show();
      this.collection.next();
      this.scroll.scrollTo(0, 0);
    },
    collection_addHandler: function (model) {
      var html = this.template({games: [model.toJSON()]});
      fragment = fragment + html;
    },
    collection_readyHandler: function () {
      var curr = this.collection.curr;
      next = (curr + 1) % 4 === 0;
      var end = (loading && !fragment);
      if (fragment) {
        this.$('ul').append(fragment);
        fragment = '';
      }
      if (next) {
        this.$('.more').hide();
        this.$('.next').show();
      } else {
        this.$('.more').show();
        this.$('.next').hide();
      }
      setTimeout(_.bind(function () {
        this.scroll.refresh();
        lazyLoad(this.$el[0]);
        //load completed
        loading = false;
        if (end) {
          this.$('.more').remove();
        }
      },this), 200);
    },
    item_tapHandler: function (e) {
      var href = $(e.currentTarget).attr('data-href');
      window.location.href = href;
    },
    onScroll: function (scroll) {
      var y = scroll.y;
      var max = scroll.maxScrollY;
      if (y - max <= 5) {
        more = true;
      }
    },
    onScrollStart: function (scroll) {
      window.clearInterval(this.interval);
      this.interval = window.setInterval(_.bind(function(){
        lazyLoad(this.$el[0]);
      }, this), 300);
    },
    onScrollEnd: function (scroll) {
      this.onScroll(scroll);
      window.clearInterval(this.interval);
      lazyLoad(this.$el[0]);
      //没有下一页，没有加载中且滚动到底部
      if (!next && more && !loading) {
        loading = true;
        more = false;
        this.collection.next();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
