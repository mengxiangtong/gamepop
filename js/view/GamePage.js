/**
 * Created by meathill on 14-2-13.
 */
;(function (ns) {
  ns.GamePage = Backbone.View.extend({
    $all: null,
    $context: null,
    events: {
      'tap .download-button': 'downloadButton_tapHandler',
      'tap a': 'a_tapHandler'
    },
    a_tapHandler: function (event) {
      var a = event.currentTarget;
      if (a.hostname === 'a.yxpopo.com') {
        a.href = '#/remote' + a.pathname.replace('vguide/', '');
      }
    },
    downloadButton_tapHandler: function (event) {
      var path = event.currentTarget.href
        , names = path.substr(11).split('/');
      names[1] = decodeURIComponent(names[1]);
      this.$context.trigger('download', names[0], names[1], this.collection);
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));