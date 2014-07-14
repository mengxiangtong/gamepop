/**
 * Created by meathill on 14-6-16.
 */
;(function (ns) {
  ns.Sidebar = Backbone.View.extend({
    events: {
      'tap .panel-heading': 'heading_tapHandler',
      'tap .edit-button': 'editButton_tapHandler',
      'tap .delete-button': 'deleteButton_tapHandler',
      'tap .item': 'item_tapHandler'
    },
    initialize: function (options) {
      this.template = TEMPLATES['my-fav'];

      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('change', this.collection_changeHandler, this);
      this.collection.on('remove', this.collection_removeHandler, this);
      this.render(this.collection);
      options.recent.on('add', this.collection_addHandler, this);
      options.recent.on('change', this.collection_changeHandler, this);
      options.recent.on('remove', this.collection_removeHandler, this);
      this.render(options.recent)
      this.recent = options.recent;
      options.rss.once('reset', this.rss_resetHandler, this);
      options.rss.on('add', this.rss_addHandler, this);
      options.rss.on('remove', this.rss_removeHandler, this);
      this.rss = options.rss;
    },
    render: function (collection) {
      var target = collection === this.collection ? 'my-fav' : 'recent';
      this.$('.' + target).html(this.template({list: collection.toJSON()}));
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
    deleteButton_tapHandler: function (event) {
      var id = $(event.currentTarget).parent().attr('id');
      if (this.collection.get(id)) {
        this.collection.remove(id);
      } else {
        this.recent.remove(id);
      }
      event.stopPropagation();
    },
    editButton_tapHandler: function (event) {
      var btn = $(event.currentTarget)
        , ul = this.$('.in');
      btn.toggleClass('fa-edit fa-check');
      ul.toggleClass('edit');
    },
    heading_tapHandler: function (event) {
      var btn = $(event.currentTarget)
        , collapse = this.$('.in');
      if (btn.next().is(collapse)) {
        return;
      }
      collapse.removeClass('in');
      btn.addClass('active')
        .next().addClass('in')
        .end().siblings('.panel-heading').removeClass('active');
    },
    item_tapHandler: function (event) {
      ga.event(['view', 'sidebar', $(event.currentTarget).data('href')].join(','));
    },
    rss_resetHandler: function (collection) {

    },
    rss_addHandler: function (model) {

    },
    rss_removeHandler: function (model) {

    }
  });
}(Nervenet.createNameSpace('gamepop.view')));