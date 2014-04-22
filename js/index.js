/**
 * main
 */
;(function () {
  'use strict';
  function onDeviceReady() {
    init();
  }
  function createCss(width, height) {
    var style = document.createElement('style')
      , itemWidth = width - 10 >> 2
      , imgWidth = itemWidth - 10
      , content = '.app-container{width:' + width + 'px;height:' + (height - 80) + 'px;}';
    content += '#guide-list .item{min-width:' + itemWidth + 'px;height:' + (imgWidth + 40) + 'px;}';
    content += '#guide-list img{min-width:' + imgWidth + 'px;min-height:' + imgWidth + 'px}';
    content += '.carousel .item,#guide-list{width:' + width + 'px;}';
    style.innerHTML = content;
    document.head.appendChild(style);
  }
  function init() {
    var context = Nervenet.createContext()
      , gui = new gamepop.view.GUI({
          el: document.body
        })
      , appsCollection = new gamepop.model.AppsCollection()
      , list = new gamepop.view.AppsList({
          el: '#apps',
          collection: appsCollection
        })
      , feedsCollection = new gamepop.model.FeedsCollection()
      , feeds = new gamepop.view.FeedsList({
          el: '#feeds-title, #feeds',
          collection: feedsCollection
        })
      , allGuidesCollection = new gamepop.model.AllGuidesCollection()
      , nav = new gamepop.view.Nav({
          el: '#main-nav',
          collection: appsCollection
        })
      , recent = new gamepop.model.RecentArticles()
      , results = new gamepop.model.SearchResults()
      , router = new gamepop.Router();

    context.mapValue('gui', gui);
    context.mapValue('list', list);
    context.mapValue('nav', nav);
    context.mapValue('router', router);
    context.mapValue('all', allGuidesCollection);
    context.mapValue('apps', appsCollection);
    context.mapValue('recent', recent);
    context.mediatorMap.isBackbone = true;
    context
      .inject(gui)
      .inject(nav)
      .inject(feeds)
      .inject(router)
      .mediatorMap
        .map('#all', gamepop.view.AllGuides, {
          isSingle: true,
          collection: allGuidesCollection
        })
        .map('#offline-list', gamepop.view.Offline, {
          isSingle: true,
          collection: appsCollection
        })
        .map('.game-page', gamepop.view.GamePage, {
          isSingle: true,
          collection: appsCollection
        })
        .map('.search-form', gamepop.view.SearchForm, {
          isSingle: true,
          collection: results
        });
    context.mapEvent('download', gamepop.controller.DownloadCommand);

    // 对于Android Webview，不支持标准的display: flex，只能使用display: inline-block
    // 所以只能用JS算出宽度
    createCss(document.body.clientWidth, document.body.clientHeight);

    // 分析路径
    Backbone.history.start();

    // for native
    gamepop.back = _.bind(gui.backButton_tapHandler, gui);
    gamepop.refresh = _.bind(appsCollection.fetch, appsCollection);

    // stat
    ga.pageview('/');
  }

  if (PHONEGAP) {
    document.addEventListener('deviceready', onDeviceReady, false);
  } else {
    $(init);
  }

}());

// for duoshuo
var duoshuoQuery = {short_name: "yxpopo"};
