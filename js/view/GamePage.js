/**
 * Created by meathill on 14-2-13.
 */
;(function (ns) {
  'use strict';

  ns.GamePage = Backbone.View.extend({
    $rss: null,
    events: {
      'remove': 'remove',
      'tap .collapse': 'gameInfo_tapHandler'
    },
    initialize: function () {
      // 初始化carousel
      var carousel = this.carousel = this.$('.carousel');
      if (carousel.length > 0) {
        var length = carousel.find('.item').length;
        if (length > 3) {
          this.carousel = new gamepop.component.Carousel({
            el: carousel[0],
            indicator: this.$('.indicators')
          });
        } else {
          this.$('.indicators').remove();
          carousel.removeClass('carousel');
        }

        // 看看是不是要显示更新数量
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
    },
    remove: function () {
      this.carousel.remove();
      this.carousel = null;
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
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));