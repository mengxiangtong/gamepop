/**
 * Created by meathill on 14-1-28.
 */
;(function (ns) {
  'use strict';
  ns.AllGuides = Backbone.View.extend({
    $context: null,
    events: {
      'tap .pagination button': 'pagination_tapHandler',
      'tap .filter .dropdown': 'filter_tapHandler',
      'change form input': 'input_changeHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html().replace(/\s{2,}|\n/g, ''));
      this.collection.on('reset', this.collection_resetHandler, this);
      this.collection.fetch();

      this.$('[name="group"][value="' + this.collection.options.group + '"]').prop('checked', true);
      this.$('[name="sort"][value="' + this.collection.options.sort + '"]').prop('checked', true);
    },
    render: function () {
      if (!this.template) {
        return;
      }
      this.list.html(this.template({games: this.collection.toJSON()}));
      this.$('.filter i').remove();
      this.$('button')
        .find('.fa-spin').toggleClass('fa-spin fa-spinner')
        .end().last().prop('disabled', this.collection.curr > this.collection.total - 2)
        .end().first().prop('disabled', this.collection.curr < 1);
      this.form.removeClass('loading');

      this.$context.trigger('refresh-iscroll');
    },
    setElement: function (el, delegate) {
      Backbone.View.prototype.setElement.call(this, el, delegate);
      this.form = this.$('form');
      this.list = this.$('#guide-list');
      this.render();
    },
    collection_resetHandler: function () {
      this.render();
    },
    filter_tapHandler: function (event) {
      if (this.form.hasClass('loading')) {
        return;
      }
      var target = $(event.currentTarget);
      if (!target.hasClass('active')) {
        target.addClass('active');
      } else if ('control' in event.target && event.target.control.checked) {
        target.removeClass('active');
      }
    },
    input_changeHandler: function (event) {
      var target = event.currentTarget
        , label = $(target).next()
        , dropdown = label.parent();
      this.collection.setOptions(target.name, target.value);
      dropdown.removeClass('active');
      label.append('<i class="fa fa-spin fa-spinner"></i>');
      this.form.addClass('loading');
    },
    pagination_tapHandler: function (event) {
      if (event.currentTarget.disabled) {
        return;
      }
      this.collection[event.currentTarget.value]();
      this.$('button').prop('disabled', true);
      $(event.currentTarget).find('i')
        .addClass('fa-spin fa-spinner');
    },
    preventDefault: function (event) {
      event.preventDefault();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));