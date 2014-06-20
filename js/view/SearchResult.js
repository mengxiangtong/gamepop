/**
 * Created by meathill on 14-5-15.
 */
;(function (ns) {
  'use strict';

  var lazyload = gamepop.component.lazyLoad;

  ns.SearchResult = Backbone.View.extend({
    fragment: '',
    events: {
      'tap .item': 'item_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES['search-result'];
      this.list = this.$('ul');
      var options = {refer: 'search'}
        , path = location.hash.substr(9).split('/')
        , keyword = decodeURIComponent(path.length > 1 ? path[1] : path[0]);
      options.guide_name = path.length > 1 ? path[0] : '';
      if (keyword === this.collection.keyword && options.guide_name === this.collection.guide_name) {
        return this.render();
      }
      this.collection.on('reset', this.collection_resetHandler, this);
      this.collection.search(keyword, options);
    },
    remove: function () {
      this.$el.off('scroll');
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
    collection_addHandler: function (model) {
      this.fragment += this.template({list: [model.toJSON()]});
    },
    collection_resetHandler: function () {
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
    },
    item_tapHandler: function (event) {
      ga.event(['view', 'search', $(event.currentTarget).data('href')].join(','));
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