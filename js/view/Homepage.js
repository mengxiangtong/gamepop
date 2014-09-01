/**
 * Created by meathill on 14-6-13.
 */
;(function (ns) {
  var KEY = 'homepage';

  ns.Homepage = Backbone.View.extend({
    events: {
      'tap #cards-toggle': 'cardsToggle_tapHandler',
      'tap .entrance': 'entrance_tapHandler',
      'tap #history-button': 'historyButton_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.entrance;
      var store;
      if (!WEB) {
        // 取上一次的记录
        store = localStorage.getItem(KEY);
        if (store) {
          store = JSON.parse(store);
        }
      }

      this.model = new (Backbone.Model.extend({
        urlRoot: config.topgame
      }))(store);
      this.model.on('change', this.model_changeHandler, this);
      this.model.fetch();
      if (store) {
        this.render();
      }

      this.collection.once('sync', this.collection_syncHandler, this);
    },
    render: function (isClass) {
      if (!this.model.get('big_pic')) {
        return;
      }
      this.$('.entrance').remove();
      this.$el.append(this.template(this.model.toJSON()));
      if (WEB || !isClass) {
        this.$el.css('background-image', 'url(' + this.model.get('big_pic') + ')');
        if (this.model.get('blur_pic')) {
          this.$('#cards, #cards-top-bar').css('background-image', 'url(' + this.model.get('blur_pic') + ')');
        }
      } else {
        this.$el.addClass('ready')
          .find('#cards').addClass('ready');
      }

      this.$('#history-button').prop('disabled', false)
        .find('i').removeClass('fa-spin fa-spinner').addClass('fa-history');
    },
    collection_syncHandler: function (collection) {
      if (collection.hasOtherUpdate()) {
        this.$('#sidebar-toggle').addClass('reminder');
      }
    },
    cardsToggle_tapHandler: function () {
      this.$el.toggleClass('back');
      $('#cards, #cards-toggle').toggleClass('active');
      if (!$('#cards').hasClass('active')) {
        $('#cards-top-bar').hide();
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
      if (WEB) { // 网页无法缓存本地图片
        this.render();
      } else { // 客户端把图片缓存在本地
        if (device.save(model.get('big_pic'), model.get('blur_pic'), 'gamepop.ready')) {
          this.model.set({
            'big_pic': 'img/homepage.jpg',
            'blur_pic': 'img/homepage_blur.jpg'
          }, {silent: true});
        } else {
          this.render();
        }

        localStorage.setItem(KEY, JSON.stringify(model.omit('id')));
      }

    }
  });
}(Nervenet.createNameSpace('gamepop.view')));