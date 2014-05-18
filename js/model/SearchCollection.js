/**
 * Created by meathill on 14-5-15.
 */
;(function (ns) {
  ns.SearchCollection = Backbone.Collection.extend({
    $apps: null,
    url: config.search,
    keyword: '',
    model: Backbone.Model.extend({idAttribute: 'guide_name'}),
    search: function (keyword, refer) {
      if (!keyword || keyword === this.keyword || keyword.length < 2) {
        return;
      }
      this.keyword = keyword;
      this.fetch({
        reset: true,
        data: {
          w: keyword,
          refer: refer,
          deviceid: this.$apps.deviceid
        }
      })
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));