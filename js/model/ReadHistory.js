/**
 * Created by 路佳 on 2014/4/16.
 */
;(function (ns) {
  var KEY = 'recent'
    , REG = /#\/local\//
    , MAX = 8
    , ago = gamepop.component.ago
    , Model = Backbone.Model.extend({
      idAttribute: 'hash',
      toJSON: function () {
        var json = Backbone.Model.prototype.toJSON.call(this);
        json.cid = this.cid;
        json.ago = ago(json.timestamp);
        return json;
      }
    });
  ns.ReadHistory = Backbone.Collection.extend({
    comparator: 'timestamp',
    model: Model,
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
    addArticle: function (hash, title) {
      var model = this.get(hash);
      if (model) {
        model.set('timestamp', Date.now());
        this.sort();
        return;
      }

      this.add({
        hash: hash,
        title: title,
        timestamp: Date.now(),
        isOffline: REG.test(hash)
      }, {at: 0});
      if (this.length > MAX) {
        this.pop();
      }

      var self = this;
      setTimeout(function () {
        self.sync()
      }, 500);
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));