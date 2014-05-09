/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.Router = Backbone.Router.extend({
    $gui: null,
    $nav: null,
    routes: {
      "": 'backHome',
      "all": "showAll",
      "offline": "showOffline",
      "search(/:keyword)": "showSearch",
      "local/:game(/*path)": "showLocalGuide",
      'remote/:game(/*path)': 'showRemoteGuide',
      'no-guide/:game(/:name)': 'showNoGuidePage',
      'news/:id': 'showNewsById'
    },
    backHome: function () {
      this.$gui.showMainPage('homepage');
      this.$nav.activeNavButton('');
      ga.pageview('home');
    },
    showAll: function () {
      this.$gui.showMainPage('all');
      this.$nav.activeNavButton('all');
      ga.pageview('all');
    },
    showOffline: function () {
      this.$gui.showMainPage('offline');
      this.$nav.activeNavButton('offline');
      ga.pageview('offline');
    },
    showLocalGuide: function (game, path) {
      path = path ? path : '';
      this.$gui.setGame(game);
      this.$gui.showPopupPage(config.local + game + '/' + path, 'local game game-' + game);
      ga.pageview('local/' + game + '/' + path);
    },
    showRemoteGuide: function (game, path) {
      path = path ? path : '';
      this.$gui.setGame(game);
      this.$gui.showPopupPage(config.remote + game + '/' + path, 'remote game game-' + game);
      ga.pageview('remote/' + game + '/' + path);
    },
    showSearch: function (keyword) {
      this.$gui.showPopupPage('template/search.html', 'search');
      ga.pageview('search');
    },
    showNewsById: function (id) {
      this.$gui.showPopupPage(config.news, 'news news-' + id, {id: id});
      ga.pageview('news/' + id);
    },
    showNoGuidePage: function (game, name) {
      this.$gui.showPopupPage('template/no-guide.html', 'no-guide');
      ga.pageview('no-guide/' + game + '/' + name);
    }
  });
}(Nervenet.createNameSpace('gamepop')));