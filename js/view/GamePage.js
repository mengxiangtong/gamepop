/**
 * Created by meathill on 14-2-13.
 */
;(function (ns) {
  'use strict';

  var lazyload = gamepop.component.lazyLoad;

  // TODO: 下一版先把这里的game和model重构了
  ns.GamePage = Backbone.View.extend({
    events: {
      'tap .game-info p': 'gameInfo_tapHandler'
    },
    initialize: function () {
      // 初始化carousel
      if (this.iscroll) {
        this.iscroll.destroy();
        this.iscroll = null;
      }
      var carousel = this.$('.home-page');
      if (carousel.length) {
        var length = Math.ceil(carousel.find('.item').length / 3)
          , width = (document.body.clientWidth - 20) / 3
          , space = (3 - carousel.find('.item').length % 3);
        space = space > 2 ? 0 : space;
        carousel.find('ul').width((document.body.clientWidth - 20) * length)
          .css('padding-right', width * space)
          .end().find('.indicators').css({
            width: (length * 20) - 10,
            'margin-left': 10 - (length * 10)
          });
        this.iscroll = new IScroll(carousel[0], {
          scrollX: true,
          scrollY: false,
          scrollbars: false,
          momentum: false,
          mouseWheel: false,
          disableMouse: true,
          disablePointer: true,
          snap: true,
          indicators: {
            el: carousel.find('.indicators')[0],
            resize: false
          }
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