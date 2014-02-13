/**
 * Created by meathill on 14-2-13.
 */
;(function (ns) {
  ns.GamePage = Backbone.View.extend({
    $all: null,
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
      var path = event.currentTarget.pathname
        , names = path.substr(2).split('/');
      names[1] = decodeURIComponent(names[1]);
      if (!this.collection.get(names[0])) {
        this.collection.add({
          "id": names[0],
          "url": "#/remote/" + names[0] + '/',
          "name": names[1],
          "icon": this.$all.get(names[0]).get('icon_path'),
          "downloading": true
        });
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));