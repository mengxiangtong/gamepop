/**
 * Created by meathill on 14-6-16.
 */
;(function (ns) {
  'use strict';

  //没有暴露事件，只能写到这儿了
  var lazyLoad = gamepop.component.lazyLoad;

  ns.Popup = Backbone.View.extend({
    $context: null,
    $router: null,
    $apps: null,
    $result: null,
    $recent: null,
    $fav: null,
    tagName: 'div',
    className: 'page-container active animated fast fadeInScaleUp',
    events: {
      'webkitAnimationEnd': 'animationEndHandler',
      'animationEnd': 'animationEndHandler'
    },
    initialize: function (options) {
      this.options = options;
      this.url = options.url;
      if (this.$apps.device_id) {
        this.render();
      } else {
        this.$apps.once('reset', this.render, this);
      }
    },
    remove: function () {
      this.$('.content').off('scroll');
      Backbone.View.prototype.remove.call(this);
    },
    render: function () {
      var init;
      switch (this.$router.type) {
        case 'game':
          var guide_name = this.$router.game
            , hasGame = !!this.$apps.get(guide_name)
            , game_name = hasGame ? this.$apps.get(guide_name).get('name') : (this.$result.get(guide_name) ? this.$result.get(guide_name).get('game_name') : '')
            , isDetail = /-detail/.test(this.options.classes)
            , fav = isDetail && this.$fav.get(location.hash);
          init = {
            game_name: game_name,
            guide_name: guide_name,
            'has-game': hasGame,
            'has-download': this.$apps.channel_show,
            'is-detail': isDetail,
            fav: fav
          };
          break;

        case 'search':
          init = this.options;
          break;
      }
      this.$el.html(TEMPLATES.popup(init));
      this.$el.appendTo('body');
      this.$('.content')
        .addClass(this.options.classes)
        .load(this.options.url, _.bind(this.loadCompleteHandler, this));
      this.options = null;
    },
    fadeOut: function () {
      this.$el.addClass('animated fast fadeOutScaleDown');
    },
    initMediator: function () {
      // 如果还在动画中或者没有完成加载则不初始化
      if (this.$el.hasClass('animated') || this.$el.find('.alert-error').length) {
        return;
      }
      // 给load进来的页面增加mediator
      var map = this.$context.mediatorMap
        , el = this.el;
      setTimeout(function () {
        map.check(el);
      }, 50);
      // lazyload
      lazyLoad(this.el);
      // 功能按钮
      this.$('.navbar-btn-group').removeClass('hide');
    },
    animationEndHandler: function () {
      if (/scaleup/i.test(this.el.className)) {
        this.$el.removeClass('animated fadeInScaleUp fast');
        this.initMediator();
      }
      if (/scaledown/i.test(this.el.className)) {
        this.remove();
      }
    },
    loadCompleteHandler: function (response, status) {
      if (status === 'error') {
        this.$('.alert').removeClass('hide');
        return;
      }

      // 阅读记录
      if (/-detail/.test(this.$('.content').attr('class'))) {
        this.$recent.add({url: location.hash, title: this.$('h1').text()});
      }

      this.$('.navbar .fa-spin').remove();
      this.$('.content').on('scroll', function () { lazyLoad(this, 800); });
      this.initMediator();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));