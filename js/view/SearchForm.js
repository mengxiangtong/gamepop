/**
 * Created by meathill on 14-4-18.
 */
;(function (ns) {
  'use strict';

  var timeout = 0
    , autoDelay = 500;

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
      this.collection.on('request', this.collection_requestHandler, this);
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
    countDown: function () {
      console.log('count down');
      clearTimeout(timeout);
      timeout = setTimeout(_.bind(this.search, this), autoDelay);
    },
    getKeyword: function (encode) {
      var keyword = this.$('input').val().toLowerCase();
      keyword = keyword.replace(/\/|^\s+|\s+|\\$/g, '', keyword);
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
      if (event.keyCode === 8 || event.keyCode === 46) {
        this.countDown();
      }
      if (event.keyCode === 13) {
        this.$el.submit();
      }
    },
    submitHandler: function (event) {
      this.$router.navigate('#/search/' + this.getKeyword(true));
      event.preventDefault();
    },
    textInputHandler: function () {
      this.countDown();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));