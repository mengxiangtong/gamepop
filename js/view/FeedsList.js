/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  var fragment;
  var load = 0; //1代表刷新 -1代表加载 0代表无动作
  var first = true;
  var prepend = true;
  var freshTime = Date.now();
  var ago = gamepop.component.ago;

  function bind(fn, context) {
    return function () {
      fn.call(context, this);
    }
  }

  ns.FeedsList = Backbone.View.extend({
    $context: null,
    $router: null,
    events: {
      'tap .item': 'item_tapHandler',
      'touchend .wrapper': 'handle_touchend',
    },
    initialize: function () {
      this.template = Handlebars.compile(this.$('script').remove().html());

      this.render();
      this.collection.on('reset', this.render, this);
      this.collection.on('add', this.collection_addHandler, this);
      this.collection.on('sync', this.collection_readyHandler, this);
      document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
      //init iscroll
      var scroll = this.scroll = new IScroll(this.$('.wrapper')[0], {
        probeType: 2,
        scrollX: false,
        scrollY: true,
        scrollbars: true,
        mouseWheel: true,
        shrinkScrollbars: 'clip',
        fadeScrollbars: true
      });
      scroll.on('scroll', bind(this.onScroll, this));
      scroll.on('scrollEnd', bind(this.onScrollEnd, this));

    },
    handle_touchend: function() {
      //add loading div
      if (load === 1) {
        this.$('ul').prepend('<div class="loading"><span class="fa fa-spin fa-spinner"></span></div>');
      }
    },
    render: function (collection) {
      collection = collection || this.collection;
      this.$('ul')
        .html(this.template({feeds: collection.toJSON()}))
    },
    collection_addHandler: function (model) {
      var html = this.template({feeds: [model.toJSON()]});
      fragment = fragment ? fragment.add(html) : $(html);
    },
    collection_readyHandler: function () {
      if (!first && !fragment && !prepend) {
        this.$('.loading').remove();
      }
      if (fragment) {
        var method = prepend ? 'prepend':'append';
        this.$('ul')[method](fragment);
        fragment = null;
      }
      if (first) first = false;
      setTimeout(function () {
        this.scroll.refresh();
      }.bind(this), 200);
    },
    item_tapHandler: function (event) {
      var href = $(event.currentTarget).find('a').attr('href');
      this.$router.navigate(href);
    },
    refresh: function() {
      freshTime = Date.now();
      this.collection.fetch({reset: true});
    },
    onScroll: function (scroll) {
      var $pullDown = this.$('.pulldown');
      //change stat
      var y = scroll.y;
      var max = scroll.maxScrollY;
      load = 0;
      var t = ago(freshTime);
      if (y > 30) {
        load = 1;
        $pullDown.addClass('flip').find('.label').html('释放更新 (上次刷新 ' + t + ')');
      } else if (y > 0) {
        $pullDown.removeClass('flip').find('.label').html('下拉刷新 (上次刷新 ' + t + ')');
      } else if (max -y == 0) {
        load = -1;
      }
    },
    onScrollEnd :function (scroll) {
      var refresh = load === 1 ? true : false;
      var more = load == -1 ? true : false;
      prepend = refresh ? true : false;
      load = 0;
      if (refresh) {
        this.refresh();
      }
      if (more) {
        var next = _.throttle(this.collection.next, 2000).bind(this.collection);
        next();
      }
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
