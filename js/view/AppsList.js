/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.AppsList = Backbone.View.extend({
    $context: null,
    events: {
      'tap .no-game': 'noGame_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.installed;

      this.collection.on('reset', this.render, this);
    },
    render: function (collection) {
      var html = this.template({apps: collection.toJSON()})
        , width = this.$el.width() - 16 >> 2
        , data = collection.toJSON()
        , space = (4 - data.length % 4);
      space = space > 3 ? 0 : space;
      this.$('ul')
        .width(width * Math.ceil(data.length / 4) << 2)
        .css('padding-right', width * space)
        .html(html);
      var indicator = this.$('.indicators');
      if (data.length > 0) {
        if (this.carousel) {
          this.carousel.refresh();
          return;
        }
        this.carousel = new gamepop.component.Carousel({
          el: '#apps-container',
          indicator: indicator
        });
      } else {
        if (this.carousel) {
          this.carousel.remove();
          this.carousel = null;
        }
        indicators.hide();
      }
    },
    noGame_tapHandler: function (event) {
      ga.event(['view', 'recommended', $(event.currentTarget).data('href')].join(','));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));