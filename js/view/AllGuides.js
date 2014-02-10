/**
 * Created by meathill on 14-1-28.
 */
;(function (ns) {
  ns.AllGuides = Backbone.View.extend({
    events: {
      'tap .pagination a': 'pagination_tapHandler',
      'tap .filter .dropdown': 'filter_tapHandler',
      'change form input': 'input_changeHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());
      this.collection = new gamepop.model.AllGuidesCollection();
      this.collection.on('reset', this.collection_resetHandler, this);
      this.collection.fetch();
    },
    render: function () {
      this.$('#guide-list').html(this.template(this.collection.toJSON()));
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
      var input = $(event.currentTarget)
        , dropdown = input.parent()
        , form = dropdown.parent()[0];
      this.collection.setOptions(form.elements.group, form.elements.sort);
      dropdown.removeClass('active');
    },
    pagination_tapHandler: function (event) {
      var target = event.currentTarget.hash
        , dir = target.substr(2);
      this.collection[dir]();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));