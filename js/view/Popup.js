/**
 * Created by meathill on 14-6-16.
 */
;(function (ns) {
  'use strict';

  var lazyLoad = gamepop.component.lazyLoad
    , fadeOutPage
    , pages = [];

  var Popup = ns.Popup = Backbone.View.extend({
    $context: null,
    $router: null,
    $apps: null,
    $rss: null,
    $result: null,
    $recent: null,
    tagName: 'div',
    className: 'page-container active animated fast fadeInScaleUp',
    events: {
      'tap .bookmark-button': 'bookmarkButton_tapHandler',
      'tap .cancel-button': 'cancelButton_tapHandler',
      'tap .search-button': 'searchButton_tapHandler',
      'tap .share-button': 'shareButton_tapHandler',
      'tap .shortcut-button': 'shortcutButton_tapHandler',
      'keydown .search-form input': 'input_keyDownHandler',
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
      var content = this.$('.content');
      content.off('scroll');
      if (this.autoload) {
        this.autoload.remove();
      }
      this.$result.off(null, null, this);
      Backbone.View.prototype.remove.call(this);
    },
    render: function () {
      this.options['has-game'] = this.$apps.get(this.options.guide_name);
      this.$el.html(TEMPLATES.popup(this.options));
      this.$el.appendTo('body');

      var content = this.$('.content');
      content.addClass(this.options.classes);
      if (this.options.url) {
        content.load(this.options.url, {width: gamepop.width},  _.bind(this.loadCompleteHandler, this));
      } else {
        content.empty();
        this.$('.navbar .fa-spin').remove();
        this.initMediator();
      }
      // 搜索界面需要特殊背景
      if (/search/.test(this.options.classes)) {
        this.$el.addClass('search');
      }
    },
    checkSearchStatus: function () {
      if (this.isSearch) {
        this.toggleSearchForm(false);
        return true;
      }
      return false;
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
        , el = this.el
        , options = this.options;
      setTimeout(function () {
        map.check(el, options);
        // 网页版生成评论框
        if (WEB) {
          var duoshuo = el.getElementsByClassName('ds-thread');
          if (duoshuo.length > 0) {
            DUOSHUO.EmbedThread(duoshuo[0]);
          }
        }
      }, 50);
      // 功能按钮
      this.$('.navbar-btn-group').removeClass('hide');
      // 自动加载
      var autoLoad = this.$('.auto-load');
      if (autoLoad.length > 0) {
        var content = autoLoad.data('self') ? autoLoad : this.$('.content')
          , mediator = new gamepop.view.AutoLoad({
            el: content,
            list: autoLoad
          });
        this.autoload = mediator;
      }
      // lazyload
      lazyLoad(this.el);
    },
    show: function () {
      this.$el.show();
    },
    toggleSearchForm: function (isShow) {
      this.isSearch = isShow = isShow === undefined ? !this.isSearch() : isShow;
      this.$('.search-form')[isShow ? 'fadeIn' : 'fadeOut']('fast');
      this.$('.navbar-btn-group,.back-button').toggleClass('hide', isShow);
    },
    bookmarkButton_tapHandler: function (event) {
      var button = $(event.currentTarget)
        , parent = button.closest('.item');
      if (parent.length === 0) {
        parent = this.$('.game-info');
      }
      var guide_name = this.options.guide_name || button.closest('.item').data('id')
        , title = parent.find('h1, h2').text()
        , icon = parent.find('img').attr('src');
      this.$rss.toggle(button.hasClass('active'), guide_name, title, icon);
      button.toggleClass('active');
      event.stopPropagation();
    },
    cancelButton_tapHandler: function () {
      this.toggleSearchForm(false);
    },
    input_keyDownHandler: function (event) {
      if (event.keyCode === 13 && event.target.value !== '') {
        $(event.target).closest('form').submit();
      }
    },
    searchButton_tapHandler: function () {
      this.toggleSearchForm(true);
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
      event.target.elements.keyword.blur();
      event.preventDefault();
    },
    searchResult_resetHandler: function (collection) {
      this.$('.search-form')
        .toggleClass('success', collection.length > 0)
        .toggleClass('failed', collection.length === 0)
        .find('input, button').prop('disabled', false);
    },
    shareButton_tapHandler: function () {
      var url = 'http://m.yxpopo.com/' + location.hash
        , title = '游戏攻略全都有，真是宝典啊，哈哈。来看这篇：' + $('title').text()
        , pic = this.$('.icon').text() || 'http://m.yxpopo.com/img/web/144.png';
      device.share(url, title, pic);
    },
    shortcutButton_tapHandler: function () {
      device.addShortCut(this.options.game_name, this.options.guide_name, this.$('.icon').attr('src'));
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
      this.$('.navbar .fa-spin').remove();
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
        return;
      }
      // 修改title
      if (this.options.game_name === '游戏') {
        this.options.game_name = this.$('h1').contents()[0];
      }
      $('title').text('游戏宝典 ' + this.$('.content').find('h1, h2').first().text());

      // lazyload
      this.$('.content').on('scroll', function () { lazyLoad(this, 800); });
      this.initMediator();
    }
  });

  Popup.removeLast = function () {
    if (pages.length > 0) {
      fadeOutPage = pages.pop().fadeOut();
      if (pages.length > 0) {
        $('title').text('游戏宝典 ' + pages[pages.length - 1].$('.content').find('h1, h2').first().text());
      }
    }
  };
  Popup.search = function (url) {
    var page = pages[pages.length - 1];
    if (page && page.url === url) {
      if (page.options.type === 'search' && !fadeOutPage) {
        page.$result.search();
      }
      return true;
    }
    return false;
  };
  /**
   * 判断当前popup是否处于搜索状态，如果是则取消搜索
   * @returns {boolean}
   */
  Popup.isSearch = function () {
    var page = pages[pages.length - 1];
    return page.checkSearchStatus();
  };
  Popup.pages = pages;
}(Nervenet.createNameSpace('gamepop.view')));