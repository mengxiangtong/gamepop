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
      'no-guide/:game(/:name)': 'showNoGuidePage'
    },
    backHome: function () {
      this.game = '';
      ga.pageview('home');
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
        'is-detail': type === 'detail',
        fav: fav,
        bookmark: bookmark
      };
      this.$gui.showPopupPage(config.remote + game + '/' + path, 'remote game-page guide-' + type, this.data);
      ga.pageview('remote/' + game + '/' + path);
    },
    showSearch: function (game, keyword) {
      this.data = {
        type: 'search',
        guide_name: keyword ? game: '',
        keyword: decodeURIComponent(keyword || game)
      };
      this.$gui.showPopupPage('template/search.html', 'search-result', this.data);
      ga.pageview('search');
    },
    showNoGuidePage: function (game, name) {
      this.data = {
        type: 'no-game',
        guide_name: game,
        game_name: name || '',
        'has-game': true
      };
      this.$gui.showPopupPage('template/no-guide.html', 'no-guide', this.data);
      ga.pageview('no-guide/' + game + '/' + name);
    },
    start: function (fromGame) {
      this.from = fromGame ? Backbone.history.fragment : '';
      this.on('route', this.routeHandler, this);
    },
    routeHandler: function () {
      var fragment = Backbone.history.fragment;
      if (fragment && this.from !== fragment && fragment !== history[history.length - 1]) {
        history.push(fragment);
        console.log(history);
      }
    }
  });
}(Nervenet.createNameSpace('gamepop')));