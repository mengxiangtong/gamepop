/**
 * Created by meathill on 14-4-18.
 */
;(function (ns) {
  ns.SearchForm = Backbone.View.extend({
    events: {
      'submit': 'submitHandler',
      'keydown input': 'input_keyDownHandler'
    },
    initialize: function () {
      this.result = this.$el.next();
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
      this.result = this.$el.next();
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
    submitHandler: function (event) {
      this.search();
      event.preventDefault();
      return false;
    },
    input_keyDownHandler: function (event) {
      if (event.keyCode === 13) {
        this.search();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));