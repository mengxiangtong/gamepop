/**
 * Created by meathill on 14-5-15.
 */
;(function (ns) {
  'use strict';

  var lazyload = gamepop.component.lazyLoad;

  ns.SearchResult = Backbone.View.extend({
    $router: null,
    $rss: null,
    fragment: '',
    events: {
      'tap .bookmark-button': 'bookmarkButton_tapHandler',
      'tap .item': 'item_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES['search-result'];
      this.list = this.$('ul');
      this.loading = this.$('.loading');
      this.guide_name = this.$router.data.guide_name;
      this.collection.on('request', this.collection_requestHandler, this);
      this.collection.on('reset', this.collection_resetHandler, this);
      this.collection.search();
      this.$rss.on('add remove', this.rss_changeHandler, this);
    },
    remove: function () {
      this.$el.off('scroll');
      this.$rss.off(null, null, this);
      this.collection.off(null, null, this);
      Backbone.View.prototype.remove.call(this);
    },
    render: function () {
      if (this.collection.length === 0) {
        this.list.empty().addClass('no-result');
        return;
      }
      this.list.html(this.template({list: this.collection.toJSON()}));
      if (this.collection.total > this.collection.size) {
        this.list.addClass('auto-load');
        this.$el.on('scroll', _.bind(this.scrollHandler, this));
        this.collection.on('add', this.collection_addHandler, this);
        this.collection.on('sync', this.collection_syncHandler, this);
      }
      lazyload(this.el);
    },
    bookmarkButton_tapHandler: function (event) {
      var target = $(event.currentTarget)
        , li = target.closest('li')
        , id = li.attr('id').substr(7);
      this.$rss.toggle(target.hasClass('active'), id, li.find('h2').text(), li.find('img').attr('src'));
      target.toggleClass('active');
      event.stopPropagation();
    },
    collection_addHandler: function (model) {
      if (this.collection.guide_name !== this.guide_name) {
        return;
      }
      this.fragment += this.template({list: [model.toJSON()]});
    },
    collection_requestHandler: function () {
      if (this.collection.guide_name !== this.guide_name) { // 搜索范围不一致
        return;
      }
      this.list
        .removeClass('auto-load no-result')
        .prepend(this.loading);
    },
    collection_resetHandler: function () {
      if (this.collection.guide_name !== this.guide_name) { // 搜索范围不一致
        return;
      }
      this.render();
    },
    collection_syncHandler: function () {
      if (this.fragment) {
        this.list.append(this.fragment).removeClass('loading');
        this.fragment = '';
      } else {
        if (this.collection.page === 1) {
          return;
        }
        this.list.removeClass('loading auto-load')
          .addClass('no-more');
        this.$el.off('scroll');
        var list = this.list;
        setTimeout(function () {
          list.removeClass('no-more');
        }, 3000);
      }
      this.loading.remove();
    },
    item_tapHandler: function (event) {
      ga.event(['view', 'search', $(event.currentTarget).data('href')].join(','));
    },
    rss_changeHandler: function (model) {
      this.$('#search-' + model.id).find('.bookmark-button').toggleClass('active', model.collection);
    },
    scrollHandler: function () {
      clearTimeout(this.timeout);
      var collection = this.collection
        , list = this.$('.auto-load');
      if (this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight < 10) {
        this.timeout = setTimeout(function () {
          if (list.length === 0 || list.hasClass('loading')) {
            return;
          }
          list.addClass('loading');
          collection.next();
        }, 100);
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));