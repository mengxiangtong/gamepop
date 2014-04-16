/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var lastTouch
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
      'tap .game-button': 'gameButton_tapHandler'
    },
    initialize: function () {
      Hammer(this.el, {
        drag: false,
        hold: false,
        transform: false
      });
      this.page = $('#page-container');
      this.loading = this.page.find('#loading').remove();
      this.error = this.page.find('.alert-error').remove();
    },
    backHome: function () {
      this.page.removeClass('active');
      this.$el.attr('class', '');
      this.$('h1').text('游戏泡泡');
      this.$('#main-nav a').removeClass('active')
        .eq(1).addClass('active');
    },
    setGame: function (game) {
      if (game === this.$context.getValue('game')) {
        return;
      }
      var model = this.$apps.get(game) ? this.$apps.get(game) : this.$all.get(game)
        , name = '';
      if (model) {
        name = model.get('name') || model.get('app_name');
      }
      this.$('.game-button').attr('href', 'game://' + game + '/' + name);
      this.$context.mapValue('game', game, true);
    },
    showPage: function (url, className, data) {
      this.page
        .html(this.loading)
        .load(url, data, _.bind(this.page_loadCompleteHandler, this))
        .addClass('active');
      this.$el.attr('class', className);
      this.$('h1').text(TITLES[className] || '游戏泡泡');
    },
    backButton_tapHandler: function () {
      var hash = location.hash.substr(2);
      if (hash === '') {
        location.href = 'popo:return';
      } else if (hash === 'all' || hash === 'offline') {
        this.$router.navigate('#/');
      } else {
        history.back();
      }
    },
    gameButton_tapHandler: function (event) {
      ga.event(['game', 'play', this.$context.getValue('game')].join(','));
      location.href = event.currentTarget.href;
    },
    page_loadCompleteHandler: function (response, status) {
      if (status === 'error') {
        this.$('#page-container').html(this.error);
        return;
      }
      this.$context.mediatorMap.check(this.page[0]);

      // 增加历史记录
      this.$recent.addArticle(location.hash, this.page.find('h1').text(), this.page.find('.thumbnail').attr('src'));
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