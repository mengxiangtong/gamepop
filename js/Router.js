/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  'use strict';

  // 给backbone添加历史记录的功能，以便正确弹出
  ns.history = [''];
  var loadUrl = Backbone.history.loadUrl;
  Backbone.history.loadUrl = function (fragment) {
    fragment = fragment || Backbone.history.getFragment();
    if (fragment && fragment !== ns.history[ns.history.length - 1]) {
      ns.history.push(fragment);
      console.log(ns.history);
    }
    loadUrl.call(Backbone.history, fragment);
  };

  ns.Router = Backbone.Router.extend({
    $gui: null,
    $apps: null,
    $result: null,
    $fav: null,
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
        , fav = type === 'detail' && this.$fav.get(location.hash);
      this.data = {
        type: 'game',
        guide_name: game,
        game_name: game_name,
        'has-guide': true,
        'has-game': hasGame,
        'is-detail': type === 'detail',
        fav: fav
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
    }
  });
}(Nervenet.createNameSpace('gamepop')));