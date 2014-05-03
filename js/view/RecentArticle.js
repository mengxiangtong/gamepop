/**
 * Created by 路佳 on 2014/5/3.
 */
;(function (ns) {
  ns.RecentArticle = Backbone.View.extend({
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());

      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('change', this.collection_changeHandler, this);
      this.collection.on('sort', this.collection_sortHandler, this);
    },
    render: function () {
      this.$el.html(this.template({list: this.collection.toJSON()}));
    },
    createItem: function (model) {
      return this.template({list: [model.toJSON()]});
    },
    collection_addHandler: function (model) {
      this.prepend(this.createItem(model));
    },
    collection_changeHandler: function (model) {
      this.$('#news-' + model.id).replaceWith(this.createItem(model));
    },
    collection_sortHandler: function (collection) {
      this.prepend(this.$('#news-' + collection.at(0).id));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));