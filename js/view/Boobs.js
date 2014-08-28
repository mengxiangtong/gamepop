/**
 * Created by meathill on 14-8-28.
 */
;(function (ns) {
  ns.Boobs = Backbone.View.extend({
    events: {
      'tap .tab a': 'tab_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.boobs;
      this.left = this.$('.column').first();
      this.right = this.$('.column').last();
      this.collection = new (Backbone.Collection.extend({
        url: config.girl
      }))();
      this.collection.fetch({reset: true});
    },
    remove: function () {
      this.collection.off();
      Backbone.View.prototype.remove.call(this);
    },
    collection_addHandler: function (model) {
      var column = this.left.height() > this.right.height() ? this.left : this.right;
      column.append(this.template(model.toJSON()));
    },
    collection_resetHandler: function () {
      this.render();
      this.collection.on('add', this.collection_addHandler, this);
    },
    tab_tapHandler: function (event) {
      var button = $(event.currentTarget)
        , cate = button[0].hash.substr(1);
      button.parent().addClass('active')
        .siblings().removeClass('active');
      this.$('.waterfall').addClass('loading');
      this.collection.url = config.girl + cate;
      this.collection.fetch({reset: true});
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));