/**
 * Created by 路佳 on 2014/4/16.
 */
;(function (ns) {
  var KEY = 'recent'
    , MAX = 5;
  ns.RecentArticles = Backbone.Collection.extend({
    comparator: 'timestamp',
    initialize: function () {
      var store = localStorage.getItem(KEY);
      if (store) {
        store = JSON.parse(store);
        this.set(store);
      }
    },
    sync: function () {
      var json = JSON.stringify(this.toJSON());
      localStorage.setItem(KEY, json);
    },
    addArticle: function (hash, title, image) {
      var model = this.get(hash)
        , data = {
          title: title,
          image: image,
          timestamp: Date.now()
        };
      if (model) {
        model.set(data);
        this.sort();
        return;
      }

      this.add(data, {at: 0});
      if (this.length > MAX) {
        this.pop();
      }

      var self = this;
      setTimeout(function () {
        self.sync()
      }, 0);
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));