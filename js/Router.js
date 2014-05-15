/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.Router = Backbone.Router.extend({
    $gui: null,
    routes: {
      "": 'backHome',
      "search(/:keyword)": "showSearch",
      'remote/:game(/*path)': 'showRemoteGuide',
      'no-guide/:game(/:name)': 'showNoGuidePage'
    },
    backHome: function () {
      ga.pageview('home');
    },
    showRemoteGuide: function (game, path) {
      path = path ? path : '';
      this.$gui.setGame(game);
      this.$gui.showPopupPage(config.remote + game + '/' + path, 'remote game game-' + game);
      ga.pageview('remote/' + game + '/' + path);
    },
    showSearch: function (keyword) {
      this.$gui.showPopupPage('template/search.html', 'search', null, '搜索：' + keyword);
      ga.pageview('search');
    },
    showNoGuidePage: function (game, name) {
      this.$gui.showPopupPage('template/no-guide.html', 'no-guide');
      ga.pageview('no-guide/' + game + '/' + name);
    }
  });
}(Nervenet.createNameSpace('gamepop')));