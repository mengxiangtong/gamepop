/**
 * Created by meathill on 14-2-13.
 */
;(function (ns) {
  ns.GamePage = Backbone.View.extend({
    $all: null,
    $context: null,
    events: {
      'tap .back-button': 'backButton_tapHandler',
      'tap .download-button': 'downloadButton_tapHandler',
      'tap a': 'a_tapHandler'
    },
    setElement: function (element, delegate) {
      Backbone.View.prototype.setElement.call(this, element, delegate);
      if (this.iscroll) {
        this.iscroll.destroy();
      }
      if (this.$('.carousel').length) {
        var length = this.$('.carousel .item').length;
        this.$('.carousel ul').width(document.body.clientWidth * length);
        this.iscroll = new IScroll(this.$('.carousel')[0], {
          scrollX: true,
          scrollY: false,
          scrollbars: false,
          momentum: false,
          mouseWheel: false,
          disableMouse: true,
          disablePointer: true,
          snap: true
        });
      }
    },
    a_tapHandler: function (event) {
      var a = event.currentTarget;
      if (a.hostname === 'a.yxpopo.com') {
        a.href = '#/remote' + a.pathname.replace('vguide/', '');
      }
    },
    backButton_tapHandler: function (event) {
      history.back();
    },
    downloadButton_tapHandler: function (event) {
      var path = event.currentTarget.href
        , names = path.substr(11).split('/');
      names[1] = decodeURIComponent(names[1]);
      this.$context.trigger('download', names[0], names[1], this.collection);
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));