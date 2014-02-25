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

      this.render();
      this.collection.on('reset', this.render, this);
    },
    render: function (collection) {
      if (collection) {
        this.$('.fa-spin').hide();
      } else {
        collection = this.collection;
      }
      this.$el.last().html(this.template({feeds: collection.toJSON()}));
    },
    item_tapHandler: function (event) {
      var href = $(event.currentTarget).find('a').attr('href');
      this.$router.navigate(href);
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));