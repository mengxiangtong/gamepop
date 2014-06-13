/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var lastTouch
    , topPage = null
    , pages = [];

  //没有暴露事件，只能写到这儿了
  var lazyLoad = gamepop.component.lazyLoad;

  ns.GUI = Backbone.View.extend({
    $apps: null,
    $router: null,
    $context: null,
    $result: null,
    events: {
      'click': 'clickHandler',
      'click .no-click': 'preventDefault',
      'touch': 'touchHandler',
      'tap .item': 'item_tapHandler',
      'tap .back-button': 'backButton_tapHandler',
      'tap .download-button': 'downloadButton_tapHandler',
      'tap .game-button': 'gameButton_tapHandler',
      'webkitAnimationEnd': 'animationEndHandler',
      'animationEnd': 'animationEndHandler'
    },
    initialize: function () {
      Hammer(this.el, {
        hold: false,
        transform: false
      });
      this.template = this.$('#page-container').removeAttr('id').remove();
    },
    initMediator: function () {
      // 如果还在动画中或者没有完成加载则不初始化
      if (topPage.hasClass('animated') || topPage.find('.alert-error').length) {
        return;
      }
      // 给load进来的页面增加mediator
      var map = this.$context.mediatorMap;
      setTimeout(function () {
        map.check(topPage[0]);
      }, 50);
      // lazyload
      lazyLoad(topPage[0]);
      // 功能按钮
      topPage.find('.navbar-btn-group').removeClass('hide');
    },
    setGame: function (game) {
      if (game === this.$context.getValue('game-id')) {
        return;
      }

      // game-button
      this.$context.mapValue('game-id', game, true);
      var model = this.$apps.get(game)
        , name = model ? model.get('name') : (this.$result.get(game) ? this.$result.get('game_name') : '');
      topPage.find('.game-button').attr('href', 'game://' + game + '/' + name)
        .toggleClass('game-button', model)
        .toggleClass('download-button', model);
    },
    showPopupPage: function (url, className, data, title) {
      console.log(url, className);
      if (pages.length > 0 && pages[pages.length - 1].data('url') === url) {
        return;
      }
      topPage = this.template.clone();
      topPage
        .data('url', url)
        .appendTo('body')
        .removeClass('out')
        .addClass('active animated fast fadeInScaleUp')
        .find('h2').text(title).end()
        .find('.content')
          .addClass(className)
          .load(url, data, _.bind(this.page_loadCompleteHandler, this));
      pages.push(topPage);
    },
    backButton_tapHandler: function () {
      var hash = location.hash.substr(2);
      if (hash === '' || history.length === 1) {
        location.href = 'popo:return';
      } else {
        history.back();
        if (pages.length > 0) {
          pages.pop()
            .addClass('animated fast fadeOutScaleDown')
            .find('.content')
              .trigger('remove')
              .off('scroll');
        }
      }
    },
    downloadButton_tapHandler: function (event) {
      ga.event(['game', 'download', this.$context.getValue('game-id')].join(','));
      location.href = event.currentTarget.href;
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
    page_loadCompleteHandler: function (response, status) {
      if (status === 'error') {
        topPage.find('.alert').removeClass('hide');
        return;
      }

      var content = topPage.find('.content')
        , title = content.find('h1, h2').first().html();
      title = title ? title.replace(/<\w+>.*<\/\w+>/, '') : '';
      topPage.find('.navbar .fa-spin').remove();
      if (title) {
        topPage.find('.navbar h2').text(title).end();
      }
      content.on('scroll', function () { lazyLoad(this, 800); });
      this.initMediator();
    },
    animationEndHandler: function (event) {
      var target = $(event.target)
        , classes = event.target.className;
      if (/scaleup/i.test(classes)) {
        target.removeClass('animated fadeInScaleUp fast');
        this.initMediator();
      }
      if (/scaledown/i.test(classes)) {
        return target.remove();
      }
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
    touchHandler: function (event) {
      lastTouch = event.target;
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
