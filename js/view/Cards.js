/**
 * Created by meathill on 14-8-11.
 */
;(function (ns) {
  ns.Cards = Backbone.View.extend({
    events: {
      'tap .handle': 'handle_tapHandler'
    },
    handle_tapHandler: function () {
      this.$el.toggleClass('active');
      $('#homepage').toggleClass('blur', this.$el.hasClass('active'));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));