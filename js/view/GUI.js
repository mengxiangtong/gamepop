/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var lastTouch
    , topPage = null
    , pages = [];

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
      console.log(url, className);
      if (pages.length > 0 && pages[pages.length - 1].url === url) {
        return;
      }
      topPage = this.$context.createInstance(gamepop.view.Popup, _.extend({
        url: url,
        classes: className
      }, options));
      pages.push(topPage);
    },
    toggleSidebar: function () {
      $('#homepage').toggleClass('back');
      $('#sidebar').toggleClass('hide');
    },
    backButton_tapHandler: function () {
      var hash = location.hash.substr(2);
      if (hash === '' || history.length === 1) {
        location.href = 'popo:return';
      } else {
        history.back();
        if (pages.length > 0) {
          pages.pop().fadeOut();
        }
      }
    },
    downloadButton_tapHandler: function (event) {
      ga.event(['game', 'download', this.$context.getValue('game-id')].join(','));
      location.href = event.currentTarget.href;
    },
    favButton_tapHandler: function (event) {
      var button = $(event.currentTarget);
      if (button.hasClass('active')) {
        this.$fav.remove(this.$fav.get(location.hash));
      } else {
        this.$fav.add({url: location.hash, title: $('.content h1').text()});
      }
      button.toggleClass('active');
    },
    gameButton_tapHandler: function (event) {
      ga.event(['game', 'play', this.$context.getValue('game-id')].join(','));
      location.href = event.currentTarget.href;
    },
    item_tapHandler: function (event) {
      var href = $(event.currentTarget).data('href');
      if (!href) {
        return;
      }
      this.$router.navigate(href);
    },
    sidebarToggle_tapHandler: function () {
      this.toggleSidebar();
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
      if (pages.length === 0 && !$('#homepage').hasClass('back')) {
        this.toggleSidebar();
      }
    },
    swipeRightHandler: function () {
      if (pages.length === 0 && $('#homepage').hasClass('back')) {
        this.toggleSidebar();
      }
    },
    touchHandler: function (event) {
      lastTouch = event.target;
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
