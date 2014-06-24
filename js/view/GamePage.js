/**
 * Created by meathill on 14-2-13.
 */
;(function (ns) {
  'use strict';

  var width = document.body.clientWidth
    , gap = width > 320 ? 15 : 9
    , allGaps = width > 320 ? 60 : 38;

  ns.GamePage = Backbone.View.extend({
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
      }

      if (this.$('.auto-load').length > 0) {
        this.$el.on('scroll', _.bind(this.scrollHandler, this));
      }
    },
    remove: function () {
      this.carousel.remove();
      this.carousel = null;
      this.$el.off('scroll');
      Backbone.View.prototype.remove.call(this);
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