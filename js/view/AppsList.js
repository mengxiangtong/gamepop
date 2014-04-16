/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.AppsList = Backbone.View.extend({
    $context: null,
    $router: null,
    events: {
      'tap .no-guide': 'noGuide_tapHandler',
      'tap .require-button': 'requireButton_tapHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html().replace(/\s{2,}|\n/g, ''));
      this.menu = this.$('.no-guide-dialog').remove().removeClass('hide');

      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('change', this.collection_changeHandler, this);
    },
    render: function (collection) {
      var html = this.template({apps: collection.toJSON()})
        , width = this.$el.width() - 12 >> 2
        , data = collection.toJSON();
      this.$('#apps-scroller')
        .width(width * Math.ceil(data.length / 4) << 2)
        .css('padding-right', width * (4 - data.length % 4))
        .html(html);
      var indicators = this.$('.indicators');
      if (data.length > 8) {
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
          click: true,
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
    },
    noGuide_tapHandler: function (event) {
      var target = $(event.currentTarget)
        , offset = target.position()
        , width = target.width()
        , height = target.height()
        , link = target.find('a').attr('href')
        , alias = link.substr(link.lastIndexOf('/') + 1)
        , name = target.find('h3').text()
        , left = offset.left + (width - 180 >> 1)
        , maxLeft = document.body.clientWidth - 180;
      this.menu
        .css({
          top: offset.top + height - 30,
          left: left > maxLeft ? maxLeft : left
        })
        .appendTo(this.$el)
        .toggleClass(function () {
          return 'offset' + ((left - maxLeft >> 3) + 1);
        }, left > maxLeft)
        .find('.require-button').attr('href', '#/require/' + alias)
        .end().find('.game-button').attr('href', 'game://' + alias + '/' + name);

      event.stopPropagation();
    },
    requireButton_tapHandler: function (event) {
      var hash = event.currentTarget.hash
        , alias = hash.substr(hash.lastIndexOf('/') + 1);
      $.ajax({
        type: 'POST',
        url: config.require,
        data: {
          packagename: alias
        }
      });
      alert('您的需求已收到，我们不会让您久等的。');
      ga.event(['game', 'require', alias].join(','));
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));