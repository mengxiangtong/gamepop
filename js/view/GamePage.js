/**
 * Created by meathill on 14-2-13.
 */
;(function (ns) {
  'use strict';

  var width = document.body.clientWidth
    , gap = width > 320 ? 15 : 9
    , allGaps = width > 320 ? 60 : 38;

  ns.GamePage = Backbone.View.extend({
    $rss: null,
    page: 1,
    events: {
      'remove': 'remove',
      'tap .collapse': 'gameInfo_tapHandler'
    },
    initialize: function () {
      // 初始化carousel
      var carousel = this.carousel = this.$('.carousel');
      if (carousel.length > 0) {
        var length = carousel.find('.item').length
          , width = (document.body.clientWidth - allGaps) / 3 + gap
          , space = 3 - length % 3;
        space = space > 2 ? 0 : space;
        carousel.find('ul').width(width * (length + space))
          .css('padding-right', width * space);
        if (length > 3) {
          this.carousel = new gamepop.component.Carousel({
            el: carousel[0],
            indicator: this.$('.indicators')
          });
        } else {
          this.$('.indicators').remove();
          carousel.removeClass('carousel');
        }

        // 看看是不是要增加更新数量
        var guide_name = this.guide_name = this.el.className.split(' ').pop();
        if (this.$rss.get(guide_name)) {
          this.model = this.$rss.get(guide_name);
          if (this.model.fetched) {
            this.render(this.model);
          } else {
            this.model.once('sync', this.render, this);
          }
        }
      }

      if (this.$('.auto-load').length > 0) {
        this.$el.on('scroll', _.bind(this.scrollHandler, this));
      }

    },
    remove: function () {
      this.carousel.remove();
      this.carousel = null;
      this.$el.off('scroll');
      this.model.off(null, null, this);
      Backbone.View.prototype.remove.call(this);
    },
    render: function (model) {
      var guide_name = this.guide_name;
      $('.carousel .item').each(function () {
        var attr = this.id.substr(guide_name.length + 1) + '_num';
        if (model.has(attr) && model.get(attr) > 0) {
          $(this).append('<span>' + model.get(attr) + '</span>');
        }
      });
      this.model.on('change', this.model_changeHandler, this);
    },
    fetch: function () {
      this.page += 1;
      var list = this.$('.auto-load')
        , $el = this.$el;
      if (list.length === 0) {
        return;
      }
      $.get(config.remote + list.data('src').replace('{page}', this.page), function (response) {
        if (response) {
          list.append(response).removeClass('loading');
        } else {
          list.removeClass('loading auto-load').addClass('no-more');
          setTimeout(function () {
            list.removeClass('no-more');
          }, 3000);
          $el.off('scroll');
        }
      });
    },
    gameInfo_tapHandler: function (event) {
      var target = $(event.currentTarget)
        , collapse = target.hasClass('active');
      target.toggleClass('active')
        .height(collapse ? '3em' : target[0].scrollHeight);
    },
    model_changeHandler: function (model) {
      for (var prop in model.changed) {
        this.$('#' + this.guide_name + '-' + prop + ' span').remove();
      }
    },
    scrollHandler: function () {
      clearTimeout(this.timeout);
      var self = this
        , list = this.$('.auto-load');
      if (this.el.scrollHeight - this.el.scrollTop - this.el.clientHeight < 10) {
        this.timeout = setTimeout(function () {
          if (list.length === 0 || list.hasClass('loading')) {
            return;
          }
          list.addClass('loading');
          self.fetch();
        }, 100);
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));