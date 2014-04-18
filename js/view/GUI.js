/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var lastTouch
    , curr = '#homepage'
    , topPage = '#homepage'
    , pages = []
    , TITLES = {
        'all': '攻略大全',
        'offline': '离线管理'
      };

  ns.GUI = Backbone.View.extend({
    $apps: null,
    $all: null,
    $recent: null,
    $router: null,
    $context: null,
    events: {
      'click': 'clickHandler',
      'click .no-click': 'preventDefault',
      'touch': 'touchHandler',
      'tap .back-button': 'backButton_tapHandler',
      'tap .game-button': 'gameButton_tapHandler',
      'webkitAnimationEnd': 'animationEndHandler',
      'animationEnd': 'animationEndHandler'
    },
    initialize: function () {
      Hammer(this.el, {
        drag: false,
        hold: false,
        transform: false
      });
      this.template = this.$('#page-container');
      curr = topPage = $(curr);
    },
    setGame: function (game) {
      if (game === this.$context.getValue('game-id')) {
        return;
      }
      var model = this.$apps.get(game) ? this.$apps.get(game) : this.$all.get(game)
        , name = '';
      if (model) {
        name = model.get('name') || model.get('app_name');
      }
      this.$('.game-button').attr('href', 'game://' + game + '/' + name);
      this.$context.mapValue('game', model, true);
      this.$context.mapValue('game-id', game, true);
    },
    showMainPage: function (target) {
      if (curr.is('#' + target)) {
        return;
      }
      var page = $('#' + target)
        , outDir = page.index() < curr.index() ? 'Right' : 'Left'
        , inDir = outDir === 'Left' ? 'Right' : 'Left';
      page.removeClass('out').addClass('active animated slideIn' + inDir);
      curr.addClass('animated slideOut' + outDir);
      curr = page;
      this.$context.mediatorMap.check(page[0]);
      this.$('h1').text(TITLES[target] || '游戏泡泡');
    },
    showPopupPage: function (url, className, data, title) {
      if (pages.length > 0 && pages[pages.length - 1].data('url') === url) {
        return;
      }
      topPage = this.template.clone();
      topPage
        .removeClass('out')
        .addClass('active animated fast fadeInScaleUp')
        .data('url', url)
        .appendTo('body')
        .find('h2').text(title).end()
        .find('.content').load(url, data, _.bind(this.page_loadCompleteHandler, this));
      this.$el.attr('class', className);
      pages.push(topPage);
    },
    backButton_tapHandler: function () {
      var hash = location.hash.substr(2);
      if (hash === '' || history.length === 0) {
        location.href = 'popo:return';
      } else {
        history.back();
        if (pages.length > 0) {
          pages.pop().addClass('animated fast fadeOutScaleDown');
        }
      }
    },
    gameButton_tapHandler: function (event) {
      ga.event(['game', 'play', this.$context.getValue('game-id')].join(','));
      location.href = event.currentTarget.href;
    },
    page_loadCompleteHandler: function (response, status) {
      if (status === 'error') {
        topPage
          .find('.alert').removeClass('hide').end()
          .find('.loading').remove();
        return;
      }
      this.$context.mediatorMap.check(topPage[0]);

      // 增加历史记录
      if (topPage.is('.page-container')) {
        var model = this.$context.getValue('game')
          , content = topPage.find('.content')
          , title = content.find('h1, h2').text()
          , thumbnail = content.find('.thumbnail').attr('src');
        topPage.find('.navbar h2').text(title || model.get('name') || model.get('app_name'));
        this.$recent.addArticle(location.hash, title, thumbnail);
      }
    },
    animationEndHandler: function (event) {
      var target = $(event.target)
        , classes = event.target.className;
      if (/slideout/i.test(classes)) {
        return target.removeClass('animated slideOutLeft slideOutRight active').addClass('out');
      }
      if (/slidein/i.test(classes)){
        return target.removeClass('animated slideInLeft slideInRight');
      }
      if (/scaleup/i.test(classes)) {
        return target.removeClass('animated fadeInScaleUp fast');
      }
      if (/scaledown/i.test(classes)) {
        return target.remove();
      }
    },
    clickHandler: function (event) {
      // 有些功能我们用tap触发，之后可能有ui切换，这个时候系统可能会给手指离开的位置上的a触发一个click事件
      // 这个函数通过记录touch时的对象，和之后的a对比，如果不等于或者不包含就放弃该次点击
      // 还要避免label和对应的input之间出现click问题
      var isLabel = lastTouch.tagName.toLowerCase() === 'label'
        , isLabelControl = isLabel && event.target === lastTouch.control;
      if (event.target !== lastTouch && !isLabelControl) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    preventDefault: function (event) {
      event.preventDefault();
    },
    touchHandler: function (event) {
      var dialog = this.$('.no-guide-dialog');
      if (dialog.length > 0 && !$.contains(dialog[0], event.target)) {
        dialog.remove();
      }
      lastTouch = event.target;
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
