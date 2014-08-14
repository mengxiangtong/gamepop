/**
 * Created by meathill on 14-6-13.
 */
;(function (ns) {
  var KEY = 'homepage';

  ns.Homepage = Backbone.View.extend({
    events: {
      'tap .entrance': 'entrance_tapHandler',
      'tap .history-button': 'historyButton_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.entrance;
      // 取上一次的记录
      var store = localStorage.getItem(KEY);
      if (store) {
        store = JSON.parse(store);
      }
      this.model = new (Backbone.Model.extend({
        urlRoot: config.topgame
      }))(store);
      this.model.on('change', this.model_changeHandler, this);
      this.model.fetch();
      this.render();

      this.collection.once('sync', this.collection_syncHandler, this);
    },
    render: function () {
      if (!this.model.get('big_pic')) {
        return;
      }
      this.$('.entrance').remove();
      this.$el.append(this.template(this.model.toJSON()));
      this.$el.addClass('ready');
      this.$('.history-button').prop('disabled', false)
        .find('i').removeClass('fa-spin fa-spinner').addClass('fa-history');
    },
    collection_syncHandler: function (collection) {
      if (collection.hasOtherUpdate()) {
        this.$('.sidebar-toggle').addClass('reminder');
      }
    },
    entrance_tapHandler: function () {
      ga('send', 'event', 'view', 'homepage', this.model.get('guide_name'));
    },
    historyButton_tapHandler: function (event) {
      var button = $(event.currentTarget);
      if (button.prop('disabled')) {
        return;
      }
      button.prop('disabled', true)
        .find('i').removeClass('fa-history').addClass('fa-spinner fa-spin');
      this.model.id = this.model.get('prev');
      this.model.fetch();
    },
    model_changeHandler: function (model) {
      this.render();

      localStorage.setItem(KEY, JSON.stringify(model.toJSON()));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));