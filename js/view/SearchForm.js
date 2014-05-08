/**
 * Created by meathill on 14-4-18.
 */
;(function (ns) {
  ns.SearchForm = Backbone.View.extend({
    $router: null,
    events: {
      'submit': 'submitHandler',
      'keydown input': 'input_keyDownHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.result.find('script').remove().html().replace(/\s{2,}|\n/g, ''));
      this.collection.on('reset', this.collection_resetHandler, this);
    },
    render: function () {
      this.result
        .html(this.template({games: this.collection.toJSON()}));
      this.$('.fa-spin').remove();
      this.$('input').prop('disabled', false);
    },
    setElement: function (elements, delegate) {
      Backbone.View.prototype.setElement.call(this, elements, delegate);
      if (this.result) {
        this.result.off();
      }
      this.result = this.$el.next();
      this.result.on('tap', '.item', _.bind(this.item_tapHandler, this));
    },
    search: function () {
      var keyword = this.$('input').val();
      if (!keyword || keyword === this.last) {
        return;
      }
      this.collection.fetch({
        reset: true,
        data: {
          keyword: keyword
        }
      });
      this.$('input').prop('disabled', true);
      this.$el.append('<i class="fa fa-spin fa-spinner"></i>');
    },
    collection_resetHandler: function () {
      this.render();
    },
    input_keyDownHandler: function (event) {
      if (event.keyCode === 13) {
        this.search();
      }
    },
    item_tapHandler: function (event) {
      var href = $(event.currentTarget).data('href');
      this.$router.navigate(href);
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));