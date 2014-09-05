/**
 * Created by meathill on 14-6-13.
 */
;(function (ns) {
  var KEY = 'homepage';

  ns.Homepage = Backbone.View.extend({
    events: {
      'swipeup': 'swipeUpHandler',
      'swipedown': 'swipeDownHandler',
      'tap': 'tapHandler',
      'tap #cards-toggle': 'cardsToggle_tapHandler',
      'tap #sidebar-toggle': 'sidebarToggle_tapHandler',
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
    render: function () {
      if (!this.model.get('big_pic')) {
        return;
      }
      this.$('.entrance').remove();
      this.$el.append(this.template(this.model.toJSON()));
      this.$el.css('background-image', 'url(' + this.model.get('big_pic') + ')');
      this.$('#cards, #cards-top-bar').css('background-image', 'url(' + this.model.get('blur_pic') + ')');

      this.$('#history-button').prop('disabled', false)
        .find('i').removeClass('fa-spin fa-spinner').addClass('fa-history');
    },
    isNormal: function () {
      if (/back|side/.test(this.el.className)) {
        if (this.el.className === 'side') {
          this.el.className = '';
        } else {
          this.toggleCards(false);
        }
        return false;
      }
      return true;
    },
    toggleCards: function (isShow) {
      isShow = isShow === null ? !this.$el.hasClass('back') : isShow;
      this.$el.toggleClass('back', isShow);
      this.$('#cards, #cards-toggle').toggleClass('active', isShow);
      this.$('#cards-top-bar').toggle(isShow);
    },
    toggleSidebar: function () {
      this.$el.toggleClass('side');
      ga('send', 'event', 'toggle', 'sidebar');
    },
    collection_syncHandler: function (collection) {
      if (collection.hasOtherUpdate()) {
        this.$('#sidebar-toggle').addClass('reminder');
      }
    },
    cardsToggle_tapHandler: function () {
      this.toggleCards();
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
          var bg = model.get('big_pic')
            , blur = model.get('blur_pic');
          bg = 'img/' + bg.substr(bg.lastIndexOf('/') + 1);
          blur = 'img/' + blur.substr(blur.lastIndexOf('/') + 1);
          model.set({
            'big_pic': bg,
            'blur_pic': blur
          }, {silent: true});
        } else {
          this.render();
        }

        localStorage.setItem(KEY, JSON.stringify(model.omit('id')));
      }
    },
    sidebarToggle_tapHandler: function (event) {
      event.currentTarget.classList.remove('reminder');
      this.toggleSidebar();
      event.stopPropagation();
    },
    swipeDownHandler: function () {
      this.toggleCards(false);
    },
    swipeUpHandler: function () {
      this.toggleCards(true);
    },
    tapHandler: function (event) {
      if (this.el.classList.contains('side')) {
        this.toggleSidebar();
        event.preventDefault();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));