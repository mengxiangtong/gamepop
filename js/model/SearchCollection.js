/**
 * Created by meathill on 14-5-15.
 */
;(function (ns) {
  ns.SearchCollection = Backbone.Collection.extend({
    $apps: null,
    keyword: '',
    size: 12,
    url: config.search,
    model: Backbone.Model.extend({idAttribute: 'guide_name'}),
    parse: function (response) {
      this.total = response.hit;
      return response.rs_list;
    },
    fetch: function (options) {
      options = _.extend({
        data: {
          w: this.keyword,
          re: this.refer,
          p: this.page,
          did: this.$apps.deviceid
        }
      }, options);
      Backbone.Collection.prototype.fetch.call(this, options);
    },
    next: function () {
      this.page += 1;
      this.fetch();
    },
    search: function (keyword, refer) {
      if (!keyword || keyword === this.keyword || keyword.length === 0) {
        return;
      }
      this.keyword = keyword;
      this.page = 1;
      this.refer = refer;
      this.fetch({reset: true});
    }
  });
}(Nervenet.createNameSpace('gamepop.model')));