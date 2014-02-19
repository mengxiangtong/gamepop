/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  ns.AppsList = Backbone.View.extend({
    $context: null,
    $router: null,
    events: {
      'tap .no-guide': 'noGuide_tapHandler',
      'tap .require-button': 'requireButton_tapHandler',
      'tap .game-button': 'gameButton_tapHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());
      this.menu = this.$('.no-guide-dialog').remove().removeClass('hide');

      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('change', this.collection_changeHandler, this);
    },
    render: function (collection) {
      var html = '',
          data = collection.toJSON();
      for (var i = 0, len = data.length / 8; i < len; i++) {
        html += '<ul>' + this.template({apps: data.slice(i * 8, (i + 1) * 8)}) + '</ul>';
      }
      this.$('#apps-scroller')
        .width(this.$el.width() * Math.ceil(data.length / 8))
        .html(html);
      var indicators = this.$('.indicators');
      if (data.length > 8) {
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
            resize: false
          }
        });
        var width = Math.ceil(data.length / 8) * 16 - 8;
        indicators
          .width(width)
          .css('margin-left', (-width >> 1) + 'px');
      } else {
        indicators.remove();
      }
    },
    collection_addHandler: function () {
      this.render(this.collection);
    },
    collection_changeHandler: function (model) {
      this.$('.' + model.id).replaceWith(this.template({apps: [model.toJSON()]}));
    },
    gameButton_tapHandler: function (event) {
      var href = event.currentTarget.href
        , game = href.substr(href.lastIndexOf('/') + 1);
      this.$router.navigate('game://' + game);
    },
    noGuide_tapHandler: function (event) {
      var target = $(event.currentTarget),
          offset = target.position(),
          width = target.width(),
          height = target.height(),
          link = target.find('a').attr('href'),
          alias = link.substr(link.lastIndexOf('/') + 1);
      this.menu
        .css({
          top: offset.top + height - 40,
          left: offset.left + (width - 180 >> 1)
        })
        .appendTo(this.$el)
        .find('.require-button').attr('href', '#/require/' + alias)
        .end().find('.game-button').attr('href', 'game://' + alias);

      event.stopPropagation();
    },
    requireButton_tapHandler: function (event) {
      // TODO 增加向服务器发送攻略需求的功能
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
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));