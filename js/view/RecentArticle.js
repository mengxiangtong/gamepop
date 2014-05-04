/**
 * Created by 路佳 on 2014/5/3.
 */
;(function (ns) {
  var interval = 0
    , ago = gamepop.component.ago;
  ns.RecentArticle = Backbone.View.extend({
    $router: null,
    events: {
      'tap .item': 'item_tapHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());

      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('change', this.collection_changeHandler, this);
      this.collection.on('sort', this.collection_sortHandler, this);

      this.render();
      interval = setInterval(_.bind(this.refreshTime, this), 6000);
    },
    render: function () {
      this.$el.html(this.template({list: this.collection.toJSON()}));
    },
    createItem: function (model) {
      return this.template({list: [model.toJSON()]});
    },
    refreshTime: function () {
      this.$('time').each(function () {
        this.innerHTML = ago(Number($(this).attr('datetime')));
      });
    },
    collection_addHandler: function (model) {
      this.$el.prepend(this.createItem(model));
    },
    collection_changeHandler: function (model) {
      this.$('#recent-' + model.cid).replaceWith(this.createItem(model));
    },
    collection_sortHandler: function (collection) {
      this.$el.prepend(this.$('#recent-' + collection.at(0).cid));
    },
    item_tapHandler: function (event) {
      this.$router.navigate($(event.currentTarget).data('href'));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));