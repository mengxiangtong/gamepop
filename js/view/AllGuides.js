/**
 * Created by meathill on 14-1-28.
 */
;(function (ns) {
  'use strict';
  ns.AllGuides = Backbone.View.extend({
    events: {
      'tap .pagination a': 'pagination_tapHandler',
      'tap .filter .dropdown': 'filter_tapHandler',
      'change form input': 'input_changeHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());
      this.collection.on('reset', this.collection_resetHandler, this);
      this.collection.fetch();

      this.form = this.$('form')[0];
      this.form.elements.group.value = this.collection.options.group;
      this.form.elements.sort.value = this.collection.options.sort;
    },
    render: function () {
      if (!this.template) {
        return;
      }
      this.$('#guide-list').html(this.template({games: this.collection.toJSON()}));
      this.$('.pagination a')
        .find('.fa-spin').toggleClass(function () {
          var dir = $(this).parent().index() === 0 ? 'left' : 'right';
          return 'fa-spin fa-spinner fa-chevron-' + dir;
        })
        .end().last().removeClass('disabled')
        .end().first().toggleClass('disabled', this.collection.curr <= 1);
    },
    setElement: function (el) {
      Backbone.View.prototype.setElement.call(this, el);
      this.render();
    },
    collection_resetHandler: function () {
      this.render();
    },
    filter_tapHandler: function (event) {
      var target = $(event.currentTarget);
      if (!target.hasClass('active')) {
        target.addClass('active');
      } else if (event.target.control.checked) {
        target.removeClass('active');
      }
    },
    input_changeHandler: function (event) {
      var dropdown = $(event.currentTarget).parent();
      this.collection.setOptions(this.form.elements.group.value, this.form.elements.sort.value);
      dropdown.removeClass('active');
    },
    pagination_tapHandler: function (event) {
      if (/disabled/.test(event.currentTarget.className)) {
        return;
      }
      var target = $(event.currentTarget)
        , hash = event.currentTarget.hash
        , dir = hash.substr(2);
      this.collection[dir]();
      this.$('.pagination a')
        .addClass('disabled');
      target.find('i')
        .addClass('fa-spin fa-spinner')
        .removeClass('fa-chevron-left fa-chevron-right');
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));