/**
 * Created by meathill on 14-6-13.
 */
;(function (ns) {
  ns.Homepage = Backbone.View.extend({
    events: {
      'tap .entrance': 'entrance_tapHandler',
      'tap .history-button': 'historyButton_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.entrance;
      this.model = new (Backbone.Model.extend({
        urlRoot: config.topgame
      }));
      this.model.on('sync', this.model_syncHandler, this);
      this.model.fetch();

      this.collection.once('sync', this.collection_syncHandler, this);
    },
    collection_syncHandler: function (collection) {
      if (collection.hasOtherUpdate()) {
        this.$('.sidebar-toggle').addClass('reminder');
      }
    },
    entrance_tapHandler: function () {
      ga.event(['view', 'homepage', this.model.get('guide_name')].join(','));
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
    model_syncHandler: function (model) {
      if (!model.get('big_pic')) {
        return;
      }
      this.$('.entrance').remove();
      this.$el.append(this.template(model.toJSON()));
      this.$el.css('background-image', 'url(' + model.get('big_pic') + ')');
      this.$('.history-button').prop('disabled', false)
        .find('i').removeClass('fa-spin fa-spinner').addClass('fa-history');
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));