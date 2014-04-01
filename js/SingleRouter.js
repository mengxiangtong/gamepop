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
      ga.pageview('home');
    },
    showLocalGuide: function (game, path) {
      path = path ? path : '';
      this.$gui.showPage(path, 'local game game-' + game);
      this.$gui.setGame(game);
      ga.pageview('single/' + game + '/' + path);
    },
    showNewsById: function (id) {
      this.$gui.showPage(config.news, 'news news-' + id, {id: id});
      ga.pageview('news/' + id);
    }
  });
}(Nervenet.createNameSpace('gamepop')));