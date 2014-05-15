/**
 * Created by meathill on 14-5-15.
 */
;(function (ns) {
  ns.SearchResult = Backbone.View.extend({
    initialize: function () {
      this.template = TEMPLATES['search-result'];
      this.collection.on('reset', this.collection_resetHandler, this);
      if (this.collection.length) {
        this.render();
      } else if (!this.collection.loading) {
        this.collection.fetch({
          reset: true,
          data: {
            refer: 'search',
            w: location.hash.substr(location.hash.lastIndexOf('/') + 1)
          }
        });
      }
    },
    render: function () {
      this.$el.html(this.template({list: this.collection.toJSON()}));

      // 去服务器端取详细信息
      var guide_names = [];
      this.collection.each(function (model) {
        guide_names.push(model.id);
      });
      $.ajax(config.info, {
        context: this,
        data: {
          guide_names: guide_names
        },
        dataType: 'json',
        method: 'post',
        success: function (response) {
          this.$('p').text(function (i, text) {
            return text.replace(/{{(\w+)}}/g, function (matches) {
              return response[i][matches[1]];
            });
          });
        }
      })
    },
    collection_resetHandler: function () {
      this.render();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));