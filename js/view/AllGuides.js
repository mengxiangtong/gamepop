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
      'tap .filter .dropdown': 'filter_tapHandler',
      'change form input': 'input_changeHandler',
      'tap .item': 'item_tapHandler',
      'tap .next': 'button_nextHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html().replace(/\s{2,}|\n/g, ''));
      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('sync', this.collection_readyHandler, this);

      this.$('[name="group"][value="' + this.collection.options.group + '"]').prop('checked', true);
      this.$('[name="sort"][value="' + this.collection.options.sort + '"]').prop('checked', true);
      this.render();
      var scroll = this.scroll = new IScroll(this.el, {
        probeType: 2,
        scrollX: false,
        scrollY: true,
        scrollbars: false,
        shrinkScrollbars: 'clip'
      });
      scroll.on('scroll', _.bind(this.onScroll, this, scroll));
      scroll.on('scrollStart', _.bind(this.onScrollStart, this, scroll));
      scroll.on('scrollEnd', _.bind(this.onScrollEnd, this, scroll));
    },
    render: function () {
      if (!this.template) {
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
      next = (curr + 1)%4 === 0 ? true : false;
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
    filter_tapHandler: function (event) {
      if (this.form.hasClass('loading')) {
        return;
      }
      var target = $(event.currentTarget);
      if (!target.hasClass('active')) {
        target.addClass('active');
      } else if ('control' in event.target && event.target.control.checked) {
        target.removeClass('active');
      }
    },
    input_changeHandler: function (event) {
      var target = event.currentTarget
        , label = $(target).next()
        , dropdown = label.parent();
      this.collection.setOptions(target.name, target.value);
      dropdown.removeClass('active');
      label.append('<i class="fa fa-spin fa-spinner"></i>');
      this.form.addClass('loading');
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
