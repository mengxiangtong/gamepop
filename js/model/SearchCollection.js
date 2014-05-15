/**
 * Created by meathill on 14-5-15.
 */
;(function (ns) {
  ns.SearchCollection = Backbone.Collection.extend({
    $apps: null,
    loading: false,
    url: config.search,
    model: Backbone.Model.extend({idAttribute: 'guide_name'}),
    fetch: function (options) {
      if (this.loading) {
        return;
      }
      this.loading = true;
      if ('data' in options) {
        options.data.deviceid = this.$apps.deviceid;
      }
      Backbone.Collection.prototype.fetch.call(this, options);
    },
    parse: function (response) {
      this.loading = false;
      return response;
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));