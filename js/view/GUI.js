/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  function path2class(str) {
    return str.split('/').join('-');
  }
  ns.GUI = Backbone.View.extend({
    initialize: function () {
      Hammer(this.el, {
        drag: false
      });
      this.page = $('#page-container');
    },
    showPage: function (url) {
      this.page
        .html('<i class="fa fa-spin fa-spinner fa-4x"></i>')
        .load(url, function (response, status, xhr) {
          if (status === 'error') {
            this.innerHTML = '加载失败';
          }
        })
        .addClass('active');
      this.$el.attr('class', path2class(url));
    }
  });
}(Nervenet.createNameSpace('Gamepop.view')));