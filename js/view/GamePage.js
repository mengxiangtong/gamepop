/**
 * Created by meathill on 14-2-13.
 */
;(function (ns) {
  'use strict';

  var lazyload = gamepop.component.lazyLoad
    , width = document.body.clientWidth
    , gap = width > 320 ? 15 : 10
    , allGaps = width > 320 ? 60 : 50;

  // TODO: 下一版先把这里的game和model重构了
  ns.GamePage = Backbone.View.extend({
    events: {
      'tap .game-info p': 'gameInfo_tapHandler'
    },
    initialize: function () {
      // 初始化carousel
      var carousel = this.$('.home-page');
      if (carousel.length) {
        var width = (document.body.clientWidth - allGaps) / 3 + gap
          , length = carousel.find('.item').length
          , space = 3 - length % 3;
        space = space > 2 ? 0 : space;
        carousel.find('ul').width(width * (length + space))
          .css('padding-right', width * space);
        this.carousel = new gamepop.component.Carousel({
          el: carousel[0],
          indicator: this.$('.indicators')
        });
      }

      lazyload(this.el);
    },
    gameInfo_tapHandler: function (event) {
      var target = $(event.currentTarget)
        , collapse = target.hasClass('active');
      target.toggleClass('active')
        .height(collapse ? '3em' : target[0].scrollHeight);
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));