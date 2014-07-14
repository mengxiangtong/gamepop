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
    getKeyword: function (encode) {
      var keyword = this.$('input').val().toLowerCase();
      keyword = keyword.replace(/\/|\\/g, '', keyword);
      keyword = encode ? encodeURIComponent(keyword) : keyword;
      return keyword;
    },
    search: function () {
      var keyword = this.getKeyword();
      console.log('search start');
      this.collection.search(keyword, 'homepage');
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