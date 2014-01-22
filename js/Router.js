/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.Router = Backbone.Router.extend({
    $gui: null,
    routes: {
      "all": "showAll",
      "offline": "showOffline",
      "local/:game": "local"
    },
    showAll: function () {
      this.$gui.showPage('template/all.html');
    },
    showOffline: function () {

    }
  });
}(Nervenet.createNameSpace('Gamepop')));