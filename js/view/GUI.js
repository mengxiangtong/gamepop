/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var TITLES = {
    'all': '全部攻略',
    'offline': '离线管理'
  };

  ns.GUI = Backbone.View.extend({
    $router: null,
    $context: null,
    events: {
      'click .no-click': 'preventDefault',
      'tap': 'tapHandler',
      'tap .back-button': 'backButton_clickHandler',
      'tap #main-nav a': 'mainNav_tapHandler'
    },
    initialize: function () {
      Hammer(this.el, {
        drag: false,
        hold: false,
        transform: false
      });
      this.sw = document.body.clientWidth;
      this.page = $('#page-container');
    },
    activeNavButton: function (str) {
      this.$('#main-nav [href$="#/' + str + '"]').addClass('active')
        .siblings().removeClass('active');
    },
    backHome: function () {
      this.page.removeClass('active');
      this.$el.attr('class', '');
      this.$('h1').text('游戏泡泡');
      this.$('#main-nav a').removeClass('active')
        .eq(1).addClass('active');
    },
    setGame: function (game) {
      this.$('.game-button').attr('href', 'game://' + game);
    },
    showPage: function (url, className) {
      this.page
        .html('<p id="loading"><i class="fa fa-spin fa-spinner fa-4x"></i></p>')
        .load(url, {sw: this.sw}, _.bind(this.page_loadCompleteHandler, this))
        .addClass('active');
      this.$el.attr('class', className);
      this.$('h1').text(TITLES[className] || '游戏泡泡');
    },
    backButton_clickHandler: function () {
      var hash = location.hash.substr(2);
      if (hash === '') {
        location.href = 'popo:return';
      } else if (hash === 'all' || hash === 'offline') {
        this.$router.navigate('#/');
      } else {
        history.back();
      }
    },
    mainNav_tapHandler: function (event) {
      this.$router.navigate(event.currentTarget.hash);
      $(event.currentTarget).addClass('active')
        .siblings().removeClass('active');
    },
    page_loadCompleteHandler: function (response, status, xhr) {
      if (status === 'error') {
        this.$('#page-container').html('加载失败');
        return;
      }
      this.$context.mediatorMap.check(this.page[0]);
    },
    preventDefault: function (event) {
      event.preventDefault();
    },
    tapHandler: function () {
      this.$('.no-guide-dialog').remove();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));