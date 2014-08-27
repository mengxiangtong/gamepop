/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  'use strict';

  var history = ns.history = [];

  ns.Router = Backbone.Router.extend({
    $gui: null,
    $apps: null,
    $result: null,
    $rss: null,
    $fav: null,
    from: '',
    routes: {
      "": 'backHome',
      "search/:keyword": "showSearch",
      "search/:game/:keyword": "showSearch",
      'remote/:game(/*path)': 'showRemoteGuide',
      'no-guide/:game(/:name)': 'showNoGuidePage',
      'page/:page': 'showPage'
    },
    backHome: function () {
      this.game = '';
      this.$gui.backHome();
      'ga' in window && ga('send', 'pageview');
    },
    showRemoteGuide: function (game, path) {
      path = path ? path : '';
      var isIndex = !path
        , model = this.$apps.get(game)
        , hasGame = model && model.get('is_local')
        , game_name = model ? model.get('name') : (this.$result.get(game) ? this.$result.get(game).get('game_name') : '游戏')
        , isList = /\/list/.test(path)
        , type = isIndex ? 'index' : (isList ? 'list' : 'detail')
        , fav = type === 'detail' && !!this.$fav.get(location.hash)
        , bookmark = type === 'index' && !!this.$rss.get(game);
      this.data = {
        type: 'game',
        guide_name: game,
        game_name: game_name,
        'has-guide': true,
        'has-game': hasGame,
        'has-search': true,
        'is-detail': type === 'detail',
        'is-index': isIndex,
        fav: fav,
        bookmark: bookmark
      };
      // 记录下最近访问的时间
      if (isIndex && this.$rss.get(game)) {
        // 利用model的save方法从服务器端取各栏目的更新数量
        var model = this.$rss.get(game);
        if (model.has('NUM') && model.get('NUM') > 0) {
          model.fetch({
            type: 'post',
            data: {
              attr: model.attributes
            }
          });
          model.set({
            time: Date.now() / 1000 >> 0,
            NUM: 0
          });
        }
      }
      if (isList && this.$rss.get(game)) {
        var cate = parseInt(path.substr(0, path.indexOf('/')));
        if (cate) {
          var attr = {};
          attr['cate' + cate] = Date.now() / 1000 >> 0;
          attr['cate' + cate + '_num'] = 0;
          this.$rss.get(game).set(attr);
        }
      }
      this.$gui.showPopupPage(config.remote + game + '/' + path, 'game-page guide-' + type + ' ' + game, this.data);
      ga('send', 'pageview', 'remote/' + game + '/' + path);
    },
    showSearch: function (game, keyword) {
      this.data = {
        type: 'search',
        guide_name: keyword ? game: '',
        keyword: decodeURIComponent(keyword || game)
      };
      this.$gui.showPopupPage('template/search.html', 'search-result', this.data);
      ga('send', 'pageview', 'search');
    },
    showNoGuidePage: function (game, name) {
      this.data = {
        type: 'no-game',
        guide_name: game,
        game_name: name || '',
        'has-game': true
      };
      this.$gui.showPopupPage('template/no-guide.html', 'no-guide', this.data);
      ga('send', 'pageview', 'no-guide/' + game + '/' + name);
    },
    showPage: function (page) {
      var is_hot = page === 'hot';
      this.data = {
        type: page,
        'has-search': is_hot,
        'title': is_hot ? '热门游戏' : 0
      };
      this.$gui.showPopupPage(config[page], page, this.data);
      ga('send', 'pageview', 'page/' + page);
    },
    /**
     * 记录首次访问时的地址
     * @param fromGame 是否从游戏的浮窗进入的，如果开始位置不为空，则认为是从游戏进来的
     */
    start: function (fromGame) {
      if (WEB) {
        this.from = '';
      } else {
        this.from = fromGame ? Backbone.history.fragment : '';
      }
      this.on('route', this.routeHandler, this);
    },
    routeHandler: function () {
      var fragment = Backbone.history.fragment;
      if (fragment && this.from !== fragment && fragment !== history[history.length - 1]
          && fragment !== history[history.length - 2]) {
        history.push(fragment);
        console.log(history);
      }
      if (WEB) {
        $('[name=apple-itunes-app]').attr('content', "app-id=892347556, app-argument=gamemaster://" + fragment);
      }
    }
  });

  // 放在最后吧，浏览器当中无法侦听历史事件，所以无法得知用户是否按下后退按钮，只能自行判断处理
  if (WEB) {
    ns.Router = ns.Router.extend({
      execute: function (callback, args) {
        var fragment = Backbone.history.fragment;
        if (history[history.length - 2] === fragment) {
          // 可以认为是用户点了后退按钮
          return this.$gui.back(true);
        }
        Backbone.Router.prototype.execute.call(this, callback, args);
      }
    });
  }
}(Nervenet.createNameSpace('gamepop')));