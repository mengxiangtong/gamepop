/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.Router = Backbone.Router.extend({
    $gui: null,
    routes: {
      "": 'backHome',
      "all": "showAll",
      "offline": "showOffline",
      'config': 'showConfiguration',
      "local/:game(/*path)": "showLocalGuide",
      'remote/:game(/*path)': 'showRemoteGuide',
      'news/:id': 'showNewsById'
    },
    backHome: function () {
      this.$gui.backHome();
      this.$gui.activeNavButton('');
    },
    showAll: function () {
      this.$gui.showPage('template/all.html', 'all');
      this.$gui.activeNavButton('all');
    },
    showOffline: function () {
      this.$gui.showPage('template/offline.html', 'offline');
      this.$gui.activeNavButton('offline');
    },
    showConfiguration: function () {
      this.$gui.showPage('template/config.html', 'config');
    },
    showLocalGuide: function (game, path) {
      path = path ? path : '';
      this.$gui.showPage(config.local + game + '/' + path, 'game-' + game);
      this.$gui.setGame(game);
    },
    showRemoteGuide: function (game, path) {
      path = path ? path : '';
      this.$gui.showPage(config.remote + game + '/' + path, 'game-' + game);
      this.$gui.setGame(game);
    },
    showNewsById: function (id) {
      this.$gui.showPage(config.news + id, 'news-' + id);
    }
  });
}(Nervenet.createNameSpace('gamepop')));