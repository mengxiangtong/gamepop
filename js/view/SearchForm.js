/**
 * Created by meathill on 14-4-18.
 */
;(function (ns) {
  'use strict';

  ns.SearchForm = Backbone.View.extend({
    $router: null,
    events: {
      'keydown': 'keydownHandler',
      'submit': 'submitHandler'
    },
    initialize: function () {
      this.template = TEMPLATES['search-tips'];
    },
    render: function () {
      console.log('search end');
      this.result.html(this.template({games: this.collection.toJSON().slice(0, 4)}));
      this.$('.fa-spin').removeClass('fa-spin fa-spinner');
      this.$('input, button').prop('disabled', false);
      this.$('input').focus();

      var result = this.result;
      setTimeout(function () {
        result.slideDown('fast');
      }, 0);
    },
    getKeyword: function (encode) {
      var keyword = this.$('input').val().toLowerCase();
      keyword = keyword.replace(/\/|\s+|\\/g, '', keyword);
      keyword = encode ? encodeURIComponent(keyword) : keyword;
      return keyword;
    },
    search: function () {
      var keyword = this.getKeyword();
      console.log('search start');
      this.collection.search(keyword, 'homepage');
    },
    collection_requestHandler: function () {
      this.$('input, button').prop('disabled', true);
      this.$('button i').addClass('fa-spin fa-spinner');
    },
    collection_resetHandler: function () {
      this.render();
    },
    keydownHandler: function (event) {
      if (event.keyCode === 13) {
        this.$el.submit();
      }
    },
    submitHandler: function (event) {
      this.$router.navigate('#/search/' + this.getKeyword(true));
      event.preventDefault();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));