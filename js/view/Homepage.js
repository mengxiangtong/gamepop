/**
 * Created by meathill on 14-6-13.
 */
;(function (ns) {
  ns.Homepage = Backbone.View.extend({
    events: {
      'tap .entrance': 'entrance_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.entrance;
      this.model = new (Backbone.Model.extend({
        urlRoot: config.topgame
      }));
      this.model.once('sync', this.model_syncHandler, this);
      this.model.fetch();
    },
    model_syncHandler: function (model) {
      if (!model.get('big_pic')) {
        return;
      }
      this.$el.append(this.template(model.toJSON()));
      this.$el.css('background-image', 'url(' + model.get('big_pic') + ')');
    },
    entrance_tapHandler: function () {
      ga.event(['view', 'homepage', this.model.get('guide_name')].join(','));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));