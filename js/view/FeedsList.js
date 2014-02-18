/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.FeedsList = Backbone.View.extend({
    $router: null,
    events: {
      'tap .item': 'item_tapHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());

      this.collection.on('reset', this.render, this);
    },
    render: function (collection) {
      this.$('ul').html(this.template({feeds: collection.toJSON()}));
      this.scroll = new IScroll(this.el, {
        momentum: false,
        mouseWheel: false,
        disableMouse: true,
        disablePointer: true
      });
    },
    item_tapHandler: function (event) {
      var href = $(event.currentTarget).find('a').attr('href');
      this.$router.navigate(href);
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));