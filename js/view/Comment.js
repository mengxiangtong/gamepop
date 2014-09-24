/**
 * Created by meathill on 14-9-19.
 */
;(function (ns) {
  'use strict';
  ns.Comment = Backbone.View.extend({
    initialize: function (options) {
      this.options = options;
      this.template = TEMPLATES.comment;
      this.$el.html(this.template(this.options));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));