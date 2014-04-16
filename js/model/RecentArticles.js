/**
 * Created by 路佳 on 2014/4/16.
 */
;(function (ns) {
  ns.RecentArticles = Backbone.Collection.extend({
    comparator: 'timestamp',
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
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));