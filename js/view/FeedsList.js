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
      this.$el.html(this.template({feeds: collection.toJSON()}));
    },
    item_tapHandler: function (event) {
      var target = $(event.currentTarget).find('a').attr('href');
      this.$router.navigate('#/feeds/' + encodeURIComponent(target));
    }
  });
}(Nervenet.createNameSpace('Gamepop.view')));