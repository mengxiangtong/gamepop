/**
 * Created by meathill on 14-1-28.
 */
;(function (ns) {
  'use strict';
  var more = false;
  var loading = false;
  var fragment = '';
  var lazyLoad = gamepop.component.lazyLoad;

  ns.AllGuides = Backbone.View.extend({
    $context: null,
    events: {
      'tap .filter .dropdown': 'filter_tapHandler',
      'change form input': 'input_changeHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html().replace(/\s{2,}|\n/g, ''));
      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('sync', this.collection_readyHandler, this);

      this.$('[name="group"][value="' + this.collection.options.group + '"]').prop('checked', true);
      this.$('[name="sort"][value="' + this.collection.options.sort + '"]').prop('checked', true);
      this.render();
      var scroll = this.scroll = new IScroll(this.$('.wrapper')[0], {
        probeType: 2,
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
        scrollbars: true,
        shrinkScrollbars: 'clip',
        fadeScrollbars: true
      });
      scroll.on('scroll', _.bind(this.onScroll, this, scroll));
      scroll.on('scrollEnd', _.bind(this.onScrollEnd, this, scroll));
    },
    render: function () {
      if (!this.template) {
        return;
      }
      this.$('.all-guides-list').html(this.template({games: this.collection.toJSON()}));

      this.$('.filter i').remove();
      setTimeout(function () {
        lazyLoad(this.$el[0]);
        this.scroll.refresh();
      }.bind(this), 1000);
    },
    collection_addHandler: function (model) {
      var html = this.template({games: [model.toJSON()]});
      fragment = fragment + html;
    },
    collection_readyHandler: function () {
      loading = false;
      if (fragment) {
        this.$('ul').append(fragment);
        fragment = '';
      }
      setTimeout(function () {
        lazyLoad(this.$el[0]);
        this.scroll.refresh();
      }.bind(this), 200);
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
      if (max -y === 0) {
        more = true;
      }
      lazyLoad(this.$el[0]);
    },
    onScrollEnd :function (scroll) {
      if (more && !loading) {
        loading = true;
        this.collection.next();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
