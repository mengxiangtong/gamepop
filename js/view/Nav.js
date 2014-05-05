/**
 * Created by meathill on 14-2-21.
 */
;(function (ns) {
  'use strict';

  function check(model) {
    return model.get('downloading');
  }

  ns.Nav = Backbone.View.extend({
    $router: null,
    events: {
      'tap a': 'a_tapHandler'
    },
    initialize: function () {
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('change', this.collection_changeHandler, this);
    },
    render: function () {
      var badge = this.$('.badge').length ? this.$('.badge') : $('<span class="badge"></span>')
        , num = this.collection.filter(check).length;
      if (num === 0) {
        badge.remove();
        return;
      }
      badge.text(num);
      if (!$.contains(badge[0], this.el)) {
        this.$el.append(badge);
      }
    },
    activeNavButton: function (str) {
      this.$('[href$="#/' + str + '"]').addClass('active')
        .siblings().removeClass('active');
    },
    a_tapHandler: function (event) {
      this.$router.navigate(event.currentTarget.hash);
      $(event.currentTarget).addClass('active')
        .siblings().removeClass('active');
    },
    collection_addHandler: function () {
      this.render();
    },
    collection_changeHandler: function (model) {
      if ('downloading' in model.changed) {
        this.render();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));