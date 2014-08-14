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
      this.template = TEMPLATES['sidebar-tpl'];

      this.recent = options.recent;
      this.rss = options.rss;
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('change', this.collection_changeHandler, this);
      this.collection.on('remove', this.collection_removeHandler, this);
      this.render(this.collection);
      options.recent.on('add', this.collection_addHandler, this);
      options.recent.on('change', this.collection_changeHandler, this);
      options.recent.on('remove', this.collection_removeHandler, this);
      this.render(options.recent);
      options.rss.on('add', this.collection_addHandler, this);
      options.rss.on('change', this.collection_changeHandler, this);
      options.rss.on('remove', this.collection_removeHandler, this);
      this.render(options.rss);
    },
    render: function (collection) {
      var target = this.getTarget(collection);
      this.$('.' + target).html(this.template({list: collection.toJSON()}));
    },
    createItem: function (model) {
      return this.template({list: [model.toJSON()]});
    },
    getTarget: function (collection) {
      switch (collection) {
        case this.collection:
          return 'my-fav';

        case this.recent:
          return 'recent';

        case this.rss:
          return 'rss';
      }
    },
    collection_addHandler: function (model) {
      var target = this.getTarget(model.collection);
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
      // 反正cid是唯一的
      this.collection.remove(id);
      this.recent.remove(id);
      this.rss.remove(id);
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
      collapse.removeClass('in edit');
      btn.addClass('active')
        .next().addClass('in')
        .end().siblings('.panel-heading').removeClass('active')
          .find('.fa-check').toggleClass('fa-edit fa-check');
    },
    item_tapHandler: function (event) {
      ga('send', 'event', 'view', 'sidebar', $(event.currentTarget).data('href'));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));