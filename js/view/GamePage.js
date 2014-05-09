/**
 * Created by meathill on 14-2-13.
 */
;(function (ns) {
  'use strict';

  var game
    , lazyload = gamepop.component.lazyLoad;

  // TODO: 下一版先把这里的game和model重构了
  ns.GamePage = Backbone.View.extend({
    $all: null,
    $context: null,
    events: {
      'tap .back-button': 'backButton_tapHandler',
      'tap .download-button': 'downloadButton_tapHandler'
    },
    initialize: function () {
      this.collection.on('change', this.collection_changeHandler, this);
      this.collection.on('add', this.collection_addHandler, this);

      lazyload(this.el);
    },
    setElement: function (element, delegate) {
      Backbone.View.prototype.setElement.call(this, element, delegate);

      // 初始化carousel
      if (this.iscroll) {
        this.iscroll.destroy();
        this.iscroll = null;
      }
      var carousel = this.$('.carousel');
      if (carousel.length) {
        var length = carousel.find('.item').length;
        carousel.find('ul').width(document.body.clientWidth * length)
          .end().find('.indicators').css({
            width: (length * 20) - 10,
            'margin-left': 4 - (length << 3)
          });
        this.iscroll = new IScroll(carousel[0], {
          scrollX: true,
          scrollY: false,
          scrollbars: false,
          momentum: false,
          mouseWheel: false,
          disableMouse: true,
          disablePointer: true,
          snap: true,
          indicators: {
            el: carousel.find('.indicators')[0],
            resize: false
          }
        });
      }

      // 下载按钮的状态
      game = this.$context.getValue('game-id');
      var model = this.collection.get(game);
      if (model && model.get('downloading')) {
        this.setDownloadButtonStatus('downloading', model.get('progress'));
      }
      if (model && model.get('has-offline')) {
        this.setDownloadButtonStatus('downloaded');
      }
    },
    setDownloadButtonStatus: function (status, percent) {
      switch (status) {
        case 'downloading':
          var button = '<i class="fa fa-spin fa-spinner"></i> <span>正在下载' + (percent ? '（' + percent + '%）' : '')+ '</span>';
          this.$('.download-button').addClass('disabled')
            .html(button);
          break;

        case 'downloaded':
          this.$('.download-button').html('<i class="fa fa-play"></i> 离线版本')
            .attr('href', '#/local/' + game + '/index.html')
            .removeClass('download-button disabled')
            .addClass('btn-success');
          break;

        case 'progress':
          this.$('.download-button span').text('正在下载（' + percent + '%）');
          break;
      }
    },
    backButton_tapHandler: function () {
      history.back();
    },
    collection_addHandler: function (model) {
      if (model.id !== game) {
        return;
      }
      if (model.get('downloading')) {
        this.setDownloadButtonStatus('downloading');
      }
    },
    collection_changeHandler: function (model) {
      if (model.id !== game) {
        return;
      }
      var changed = model.changedAttributes();
      if ('downloading' in changed && changed.downloading) {
        this.setDownloadButtonStatus('downloading');
      } else if ('has-offline' in changed && changed['has-offline']) {
        this.setDownloadButtonStatus('downloaded');
      } else if ('progress' in changed) {
        this.setDownloadButtonStatus('progress', model.get('progress'));
      }
    },
    downloadButton_tapHandler: function (event) {
      if ($(event.currentTarget).hasClass('disabled')) {
        event.preventDefault();
        return;
      }
      var path = event.currentTarget.href
        , alias = this.$context.getValue('game-id')
        , fullname = decodeURIComponent(path.substr(path.lastIndexOf('/') + 1));
      this.$context.trigger('download', alias, fullname, this.collection);
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));