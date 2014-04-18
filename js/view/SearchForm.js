/**
 * Created by meathill on 14-4-18.
 */
;(function (ns) {
  ns.SearchForm = Backbone.View.extend({
    events: {
      'submit': 'submitHandler',
      'keydown input': 'input_keyDownHandler',
      'focusin input': 'input_focusInHandler',
      'focusout input': 'input_focusOutHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());
      this.collection.on('reset', this.collection_resetHandler, this);
    },
    render: function () {
      var info = this.$('.info').remove();
      this.$('.results')
        .html(this.template({games: this.collection.toJSON()}))
        .append(info);
      this.$('.fa-spin').remove();
      this.$('input').prop('disabled', false);
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
    },
    input_focusInHandler: function () {
      this.$('.results').removeClass('hide');
    },
    input_focusOutHandler: function () {
      if (this.collection.length > 0) {
        this.$('.results').addClass('hide');
      }
    },
    input_keyDownHandler: function (event) {
      if (event.keyCode === 13) {
        this.search();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));