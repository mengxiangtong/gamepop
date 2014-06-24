/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  'use strict';

  var lastTouch
    , Popup = gamepop.view.Popup;

  ns.GUI = Backbone.View.extend({
    $router: null,
    $context: null,
    $sidebar: null,
    $fav: null,
    events: {
      'click': 'clickHandler',
      'click .no-click': 'preventDefault',
      'swipeleft': 'swipeLeftHandler',
      'swiperight': 'swipeRightHandler',
      'touch': 'touchHandler',
      'tap .item': 'item_tapHandler',
      'tap #homepage': 'homepage_tapHandler',
      'tap .sidebar-toggle': 'sidebarToggle_tapHandler',
      'tap .back-button': 'backButton_tapHandler',
      'tap .download-button': 'downloadButton_tapHandler',
      'tap .fav-button': 'favButton_tapHandler',
      'tap .game-button': 'gameButton_tapHandler'
    },
    initialize: function () {
      Hammer(this.el, {
        hold: false,
        transform: false
      });
    },
    showPopupPage: function (url, className, options) {
      if (Popup.search(url)) {
        return;
      }
      this.$context.createInstance(Popup, _.extend({
        url: url,
        classes: className
      }, options));
    },
    toggleSidebar: function () {
      $('#homepage').toggleClass('back');
      $('#sidebar').toggleClass('hide');
      ga.event(['toggle', 'sidebar'].join(','));
    },
    backButton_tapHandler: function (event) {
      if ($('#homepage').hasClass('back') && !event) {
        return this.toggleSidebar();
      }
      var hash = location.hash.substr(2);
      if (hash === '' || gamepop.history.length === 0) {
        location.href = 'popo:return';
      } else {
        history.back();
        gamepop.history.pop();
        Popup.removeLast();
      }
    },
    downloadButton_tapHandler: function () {
      ga.event(['game', 'download', this.$context.getValue('game-id')].join(','));
    },
    favButton_tapHandler: function (event) {
      var button = $(event.currentTarget);
      if (button.hasClass('active')) {
        this.$fav.remove(location.hash);
        ga.event(['fav', 'remove', location.hash]);
      } else {
        this.$fav.add({url: location.hash, title: $('.content h1').text()});
        ga.event(['fav', 'add', location.hash]);
      }
      button.toggleClass('active');
    },
    gameButton_tapHandler: function () {
      ga.event(['game', 'play', this.$context.getValue('game-id')].join(','));
    },
    homepage_tapHandler: function (event) {
      if ($(event.currentTarget).hasClass('back')) {
        this.toggleSidebar();
        event.preventDefault();
      }
    },
    item_tapHandler: function (event) {
      var href = $(event.currentTarget).data('href');
      if (!href) {
        return;
      }
      this.$router.navigate(href);
    },
    sidebarToggle_tapHandler: function (event) {
      this.toggleSidebar();
      event.stopPropagation();
    },
    clickHandler: function (event) {
      // 有些功能我们用tap触发，之后可能有ui切换，这个时候系统可能会给手指离开的位置上的a触发一个click事件
      // 这个函数通过记录touch时的对象，和之后的a对比，如果不等于或者不包含就放弃该次点击
      // 还要避免label和对应的input之间出现click问题
      if (lastTouch) {
        var isLabel = lastTouch.tagName.toLowerCase() === 'label'
          , isLabelControl = isLabel && event.target === lastTouch.control;
        if (event.target !== lastTouch && !isLabelControl) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },
    preventDefault: function (event) {
      event.preventDefault();
    },
    swipeLeftHandler: function () {
      if (Popup.pages.length === 0 && !$('#homepage').hasClass('back')) {
        this.toggleSidebar();
      }
    },
    swipeRightHandler: function () {
      if (Popup.pages.length === 0 && $('#homepage').hasClass('back')) {
        this.toggleSidebar();
      }
    },
    touchHandler: function (event) {
      lastTouch = event.target;
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
