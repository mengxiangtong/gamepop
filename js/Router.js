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
      'config': 'showConfiguration',
      "local/:game(/*path)": "showLocalGuide",
      'remote/:game(/*path)': 'showRemoteGuide',
      'news/:id': 'showNewsById'
    },
    sendGA: function (url) {
      if ('ga' in window) {
        ga('send', 'pageview', url);
      }
    },
    backHome: function () {
      this.$gui.backHome();
      this.$nav.activeNavButton('');
      this.sendGA('/index.html');
    },
    showAll: function () {
      this.$gui.showPage('template/all.html', 'all');
      this.$nav.activeNavButton('all');
      this.sendGA('/all.html');
    },
    showOffline: function () {
      this.$gui.showPage('template/offline.html', 'offline');
      this.$nav.activeNavButton('offline');
      this.sendGA('/offline.html');
    },
    showConfiguration: function () {
      this.$gui.showPage('template/config.html', 'config');
    },
    showLocalGuide: function (game, path) {
      path = path ? path : '';
      this.$gui.showPage(config.local + game + '/' + path, 'game-' + game);
      this.$gui.setGame(game);
      this.sendGA('/local/' + game + '/' + path);
    },
    showRemoteGuide: function (game, path) {
      path = path ? path : '';
      this.$gui.showPage(config.remote + game + '/' + path, 'game-' + game);
      this.$gui.setGame(game);
      this.sendGA('/remote/' + game + '/' + path);
    },
    showNewsById: function (id) {
      this.$gui.showPage(config.news, 'news-' + id, {id: id});
      this.sendGA('/news/' + id);
    }
  });
}(Nervenet.createNameSpace('gamepop')));