/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.FeedsList = Backbone.View.extend({
    $router: null,
    events: {
      'tap .item': 'item_tapHandler',
      'tap .refresh-button': 'refreshButton_taHandler',
      'tap .extend-button': 'extendButton_tapHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());

      this.render();
      this.collection.on('reset', this.render, this);
    },
    render: function (collection) {
      if (collection) {
        this.$('.fa-spin').removeClass('fa-spin');
      } else {
        collection = this.collection;
      }
      this.$('ul').html(this.template({feeds: collection.toJSON()}));

      gamepop.polyfill.checkScroll(this.$el[1], this);
    },
    extendButton_tapHandler: function () {

    },
    item_tapHandler: function (event) {
      var href = $(event.currentTarget).find('a').attr('href');
      this.$router.navigate(href);
    },
    refreshButton_taHandler: function (event) {
      $(event.target).addClass('fa-spin');
      this.collection.fetch({reset: true});
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));