/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.Router = Backbone.Router.extend({
    $gui: null,
    routes: {
      "": 'backHome',
      "local/:game(/*path)": "showLocalGuide",
      'news/:id': 'showNewsById'
    },
    backHome: function () {
      this.$gui.showPage('index.html');
      ga('send', 'pageview');
    },
    showLocalGuide: function (game, path) {
      path = path ? path : '';
      this.$gui.showPage(path, 'local game game-' + game);
      this.$gui.setGame(game);
      ga('send', 'pageview', 'single/' + game + '/' + path);
    }
  });
}(Nervenet.createNameSpace('gamepop')));