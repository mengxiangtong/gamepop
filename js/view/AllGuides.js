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
      'tap .next-button': 'nextButton_tapHandler',
      'tap .prev-button': 'prevButton_tapHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html().replace(/\s{2,}|\n/g, ''));
      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('sync', this.collection_readyHandler, this);

      this.render();
      var scroll = this.scroll = new IScroll(this.el, {
        probeType: 2,
        click: true,
        momentum: false,
        mouseWheel: false,
        disableMouse: true,
        disablePointer: true
      });
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
    page: function (dir) {
      next = false;
      this.$('.all-guides-list').empty();
      this.$('.pagination').hide();
      this.$('.more').show();
      this.scroll.scrollTo(0, 0);
      this.collection[dir]();
    },
    collection_addHandler: function (model) {
      var html = this.template({games: [model.toJSON()]});
      fragment = fragment + html;
    },
    collection_readyHandler: function () {
      var curr = this.collection.curr;
      next = (curr + 1) % 3 === 0;
      var end = (loading && !fragment);
      if (fragment) {
        this.$('ul').append(fragment);
        fragment = '';
      }
      this.$('.more').toggle(!next);
      this.$('.pagination').toggle(next);
      this.$('.prev-button').toggleClass('hide', this.collection.curr < 3);
      this.$('.next-button').toggleClass('hide', this.collection.total <= this.collection.curr + 1);
      setTimeout(_.bind(function () {
        this.scroll.refresh();
        lazyLoad(this.el);
        //load completed
        loading = false;
        if (end) {
          this.$('.more').text('没有攻略了');
        }
      },this), 200);
    },
    nextButton_tapHandler: function () {
      this.page('next');
    },
    prevButton_tapHandler: function () {
      this.page('prev');
    },
    onScrollEnd: function (scroll) {
      more = scroll.y - scroll.maxScrollY <= 5;
      lazyLoad(this.el);
      //没有下一页，没有加载中且滚动到底部
      if (!next && more && !loading) {
        loading = true;
        more = false;
        this.collection.next();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
