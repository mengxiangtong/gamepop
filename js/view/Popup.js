/**
 * Created by meathill on 14-6-16.
 */
;(function (ns) {
  'use strict';

  //没有暴露事件，只能写到这儿了
  var lazyLoad = gamepop.component.lazyLoad
    , fadeOutPage
    , pages = [];

  ns.Popup = Backbone.View.extend({
    $context: null,
    $router: null,
    $apps: null,
    $result: null,
    $recent: null,
    tagName: 'div',
    className: 'page-container active animated fast fadeInScaleUp',
    events: {
      'tap .cancel-button': 'cancelButton_tapHandler',
      'tap .search-button': 'searchButton_tapHandler',
      'keydown input': 'input_keyDownHandler',
      'submit .search-form': 'searchForm_submitHandler',
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
      this.$result.on('reset', this.searchResult_resetHandler, this);
      pages.push(this);
    },
    remove: function () {
      this.$('.content').off('scroll');
      this.$result.off(null, null, this);
      Backbone.View.prototype.remove.call(this);
    },
    render: function () {
      this.options['has-game'] = this.$apps.get(this.options.guide_name);
      this.$el.html(TEMPLATES.popup(this.options));
      this.$el.appendTo('body');
      this.$('.content')
        .addClass(this.options.classes)
        .load(this.options.url, _.bind(this.loadCompleteHandler, this));
    },
    fadeOut: function () {
      if (pages.length > 0) {
        pages[pages.length - 1].show();
      }
      this.$el.addClass('animated fast fadeOutScaleDown');
      return this;
    },
    getKeyword: function (encode) {
      var keyword = this.$('[name=keyword]').val().toLowerCase();
      keyword = keyword.replace(/\/|\s+|\\/g, '', keyword);
      keyword = encode ? encodeURIComponent(keyword) : keyword;
      return keyword;
    },
    hide: function () {
      this.$el.hide();
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
    show: function () {
      this.$el.show();
    },
    cancelButton_tapHandler: function () {
      this.$('.search-form').fadeOut('fast');
      this.$('.navbar-btn-group,.back-button').removeClass('hide');
    },
    input_keyDownHandler: function (event) {
      if (event.keyCode === 13 && event.target.value !== '') {
        $(event.target).closest('form').submit();
      }
    },
    searchButton_tapHandler: function () {
      this.$('.navbar-btn-group,.back-button').addClass('hide');
      this.$('.search-form').fadeIn('fast');
    },
    searchForm_submitHandler: function (event) {
      if (event.currentTarget.elements.keyword.value === '') {
        return false;
      }
      if (this.options.type === 'search') {
        var options = {replace: true};
      }
      var path = this.options.guide_name ? this.options.guide_name + '/' : '';
      this.$router.navigate('#/search/' + path + this.getKeyword(true), options);
      if (this.options.type === 'game') {
        this.$('.search-form').hide();
        this.$('.navbar-btn-group,.back-button').removeClass('hide');
      }
      event.preventDefault();
    },
    searchResult_resetHandler: function () {
      this.$('.search-form').find('input, button').prop('disabled', false);
    },
    animationEndHandler: function () {
      if (/scaleup/i.test(this.el.className)) {
        this.$el.removeClass('animated fadeInScaleUp fast');
        this.initMediator();
        if (pages.length > 1) {
          pages[pages.length - 2].hide();
        }
      }
      if (/scaledown/i.test(this.el.className)) {
        this.remove();
        fadeOutPage = null;
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
      // 修改game-button
      if (this.options.type === 'no-game') {
        this.$('.content .game-button').attr('href', 'game://' + this.options.guide_name + '/' + this.options.game_name);
      }

      this.$('.navbar .fa-spin').remove();
      this.$('.content').on('scroll', function () { lazyLoad(this, 800); });
      this.initMediator();
    }
  });

  ns.Popup.removeLast = function () {
    if (pages.length > 0) {
      fadeOutPage = pages.pop().fadeOut();
    }
  };
  ns.Popup.search = function (url) {
    var page = pages[pages.length - 1];
    if (page && page.url === url) {
      if (page.options.type === 'search' && !fadeOutPage) {
        page.$result.search();
      }
      return true;
    }
    return false;
  };
  ns.Popup.pages = pages;
}(Nervenet.createNameSpace('gamepop.view')));