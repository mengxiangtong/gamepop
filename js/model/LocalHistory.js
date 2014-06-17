/**
 * Created by 路佳 on 2014/4/16.
 */
;(function (ns) {
  var Model = Backbone.Model.extend({
      idAttribute: 'url',
      toJSON: function () {
        var json = Backbone.Model.prototype.toJSON.call(this);
        json.cid = this.cid;
        return json;
      }
    });
  ns.LocalHistory = Backbone.Collection.extend({
    comparator: 'timestamp',
    model: Model,
    initialize: function (models, options) {
      this.key = options.key;
      this.max = options.max;
      var store = localStorage.getItem(this.key);
      if (store) {
        store = JSON.parse(store);
        this.reset(store);
      }
    },
    sync: function () {
      var json = JSON.stringify(this.toJSON());
      localStorage.setItem(this.key, json);
    },
    add: function (models, options) {
      options = _.extend({at: 0}, options);
      Backbone.Collection.prototype.add.call(this, models, options);

      if (this.max && this.length > this.max) {
        this.pop();
      }

      var self = this;
      setTimeout(function () {
        self.sync()
      }, 500);
    },
    remove: function (models, options) {
      Backbone.Collection.prototype.remove.call(this, models, options);
      var self = this;
      setTimeout(function () {
        self.sync()
      }, 500);
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));