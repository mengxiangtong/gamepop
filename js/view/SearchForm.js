/**
 * Created by meathill on 14-4-18.
 */
;(function (ns) {
  'use strict';

  var timeout = 0;

  ns.SearchForm = Backbone.View.extend({
    events: {
      'submit': 'submitHandler'
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
      this.result = this.$el.next();

      clearTimeout(timeout);
      timeout = setTimeout(function () {
        device.openKeyboard();
      }, 1000);
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
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));