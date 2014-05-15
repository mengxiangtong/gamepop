/**
 * Created by meathill on 14-4-18.
 */
;(function (ns) {
  'use strict';

  var timeout = 0
    , autoDelay = 1500;

  ns.SearchForm = Backbone.View.extend({
    $router: null,
    events: {
      'keydown': 'keydownHandler',
      'submit': 'submitHandler',
      'textInput': 'textInputHandler'
    },
    initialize: function () {
      this.template = TEMPLATES['search-tips'];
      this.result = this.$('ul');
      this.collection.on('reset', this.collection_resetHandler, this);
    },
    render: function () {
      this.result.html(this.template({games: this.collection.toJSON().slice(0, 4)}));
      this.$('.fa-spin').remove();
      this.$('input').prop('disabled', false);

      var result = this.result;
      setTimeout(function () {
        result.slideDown('fast');
      }, 0);
    },
    countDown: function () {
      clearTimeout(timeout);
      timeout = setTimeout(_.bind(this.search, this), autoDelay);
    },
    search: function () {
      var keyword = this.$('input').val();
      if (!keyword || keyword === this.last || keyword.length < 2) {
        return;
      }
      this.collection.fetch({
        reset: true,
        data: {
          w: keyword,
          refer: 'homepage'
        }
      });
      this.$('input').prop('disabled', true);
      this.$el.append('<i class="fa fa-spin fa-spinner"></i>');
    },
    collection_resetHandler: function () {
      this.render();
    },
    keydownHandler: function () {
      if (event.keyCode === 8 || event.keyCode === 46) {
        this.countDown();
      }
    },
    submitHandler: function (event) {
      this.$router.navigate('#/search/' + this.$('input').val());
      event.preventDefault();
    },
    textInputHandler: function () {
      this.countDown();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));