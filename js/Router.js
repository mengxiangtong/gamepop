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
      "local/:game": "showLocalGuide",
      'remote/:game': 'showRemoteGuide'
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
    showConfiguration: function (game) {
      this.$gui.showPage('local/' + game + '/', 'local-' + game);
    },
    showConfiguration: function (game) {
      this.$gui.showPage('http://yxpopo.com/' + game + '/', 'remote-' + game);
    }
  });
}(Nervenet.createNameSpace('Gamepop')));