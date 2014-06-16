/**
 * Created by meathill on 14-6-16.
 */
;(function (ns) {
  ns.Sidebar = Backbone.View.extend({
    events: {
      'tap .panel-heading': 'heading_tapHandler'
    },
    initialize: function (options) {
      this.template = TEMPLATES['my-fav'];

      this.collection.once('reset', this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('change', this.collection_changeHandler, this);
      this.collection.on('remove', this.collection_removeHandler, this);
      options.recent.once('reset', this.render, this);
      options.recent.on('add', this.collection_addHandler, this);
      options.recent.on('change', this.collection_changeHandler, this);
      options.recent.on('remove', this.collection_removeHandler, this);
    },
    render: function (collection) {
      var target = collection === this.collection ? 'my-fav' : 'recent';
      this.$('.' + target).html(this.template(collection.toJSON()));
    },
    createItem: function (model) {
      return this.template({list: [model.toJSON()]});
    },
    collection_addHandler: function (model) {
      var target = model.collection === this.collection ? 'my-fav' : 'recent';
      this.$('.' + target).prepend(this.createItem(model));
    },
    collection_changeHandler: function (model) {
      this.$('#' + model.cid).replaceWith(this.createItem(model));
    },
    collection_removeHandler: function (model) {
      this.$('#' + model.cid).remove();
    },
    heading_tapHandler: function (event) {
      var btn = $(event.currentTarget)
        , collapse = this.$('.in');
      if (btn.next().is(collapse)) {
        return;
      }
      collapse.removeClass('in');
      btn.next().addClass('in');
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));