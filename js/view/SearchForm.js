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
      'keydown input': 'keydownHandler',
      'submit': 'submitHandler',
      'textInput input': 'textInputHandler'
    },
    initialize: function () {
      this.template = TEMPLATES['search-tips'];
      this.result = this.$('ul');
      this.collection.on('reset', this.collection_resetHandler, this);
    },
    render: function () {
      console.log('search end');
      this.result.html(this.template({games: this.collection.toJSON().slice(0, 4)}));
      this.$('.fa-spin').removeClass('fa-spin fa-spinner');
      this.$('input').prop('disabled', false);

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
    search: function () {
      var keyword = this.$('input').val();
      if (!keyword || keyword === this.last || keyword.length < 2) {
        return;
      }
      console.log('search start');
      this.collection.fetch({
        reset: true,
        data: {
          w: keyword,
          refer: 'homepage'
        }
      });
      this.last = keyword;
      this.$('input').prop('disabled', true);
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
      this.$router.navigate('#/search/' + this.$('input').val());
      event.preventDefault();
    },
    textInputHandler: function () {
      this.countDown();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));