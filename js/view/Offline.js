/**
 * Created by meathill on 14-1-28.
 */
;(function (ns) {
  'use strict';
  var download = ''
    , interval = 0;
  ns.Offline = Backbone.View.extend({
    events: {
      'tap .delete-button': 'deleteButton_tapHandler',
      'tap .download-button': 'downloadButton_tapHandler'
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());
      this.render();
    },
    render: function () {
      this.$el.html(this.template({apps: this.collection.toJSON()}));
    },
    deleteButton_tapHandler: function (event) {
      $(event.currentTarget).closest('.item').fadeOut(function () {
        $(this).remove();
      });
    },
    downloadButton_tapHandler: function (event) {
      var target = $(event.currentTarget);
      if (target.hasClass('disabled')) {
        return;
      }
      var item = target.closest('.item');
      item.find('.btn').hide()
        .end().find('p').removeClass('hidden')
        .end().append('<div class="progress><div class="bar"></div></div>');
      download = event.currentTarget.pathname.substr(2);
      interval = setInterval(_.bind(this.progress_handler, this), 500);
      this.$('.download-button').addClass('disabled');
    },
    progress_handler: function () {
      var percent = progress.getDownLoadProgress(download)
        , item = this.$('.' + download);
      if (percent < 100) {
        item.find('span').text(percent)
          .end().find('.bar').width(percent + '%');
      } else {
        item
          .find('.btn').show()
          .end().find('p').addClass('text-success')
          .end().find('i').removeClass('fa-download').addClass('fa-check')
          .end().find('.progress').remove();
      }

    }
  });
}(Nervenet.createNameSpace('gamepop.view')));