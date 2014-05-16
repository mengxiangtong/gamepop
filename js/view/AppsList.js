/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.AppsList = Backbone.View.extend({
    $context: null,
    initialize: function () {
      this.template = TEMPLATES.installed;

      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('change', this.collection_changeHandler, this);
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
      var indicators = this.$('.indicators');
      if (data.length > 0) {
        var width = Math.ceil(data.length / 4) * 20 - 10;
        indicators.css({
          width: width + 'px',
          'margin-left': (-width >> 1) + 'px'
        }).show();
        if (this.iscroll) {
          this.iscroll.refresh();
          return;
        }
        this.iscroll = new IScroll('#apps-container', {
          scrollX: true,
          scrollY: false,
          scrollbars: false,
          momentum: false,
          mouseWheel: false,
          disableMouse: true,
          disablePointer: true,
          snap: true,
          indicators: {
            el: indicators[0],
            resize: false,
            listenY: false
          }
        });
      } else {
        if (this.iscroll) {
          this.iscroll.destroy();
          this.iscroll = null;
        }
        indicators.hide();
      }
    },
    collection_addHandler: function () {
      this.render(this.collection);
    },
    collection_changeHandler: function (model) {
      this.$('.' + model.id).replaceWith(this.template({apps: [model.toJSON()]}));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));