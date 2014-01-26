/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.AppsList = Backbone.View.extend({
    $router: null,
    events: {
      'tap .no-guide': 'noGuide_tapHandler',
      'tap .require-button': 'requireButton_tapHandler',
      'tap .game-button': 'gameButton_tapHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());
      this.menu = this.$('.pure-menu').remove().removeClass('hide');

      this.collection.on('reset', this.render, this);
    },
    render: function (collection) {
      this.$el.html(this.template({apps: collection.toJSON()}));
    },
    gameButton_tapHandler: function (event) {
      var href = event.currentTarget.href
        , game = href.substr(href.lastIndexOf('/') + 1);
      this.$router.navigate('game://' + game);
    },
    noGuide_tapHandler: function (event) {
      var target = $(event.currentTarget),
          offset = target.position(),
          width = target.width(),
          height = target.height();
      this.menu
        .css({
          top: offset.top + height /2,
          left: offset.left + (width - 200 >> 1)
        })
        .appendTo(this.$el);

      event.stopPropagation();
    },
    requireButton_tapHandler: function (event) {
      // TODO 增加向服务器发送攻略需求的功能
      alert('您的需求已收到，我们不会让您久等的。');
    }
  });
}(Nervenet.createNameSpace('Gamepop.view')));