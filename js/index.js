/**
 * main
 */
;(function () {
  'use strict';
  function onDeviceReady() {
    init();
  }
  function createCss(width) {
    var style = document.createElement('style')
      , itemWidth = width - 10 >> 2
      , imgWidth = itemWidth - 10
      , height = imgWidth + 50 << 1
      , content = '#apps{height:' + height + 'px;min-height:' + height + 'px;}';
    content += '#apps-scroller{height:' + height + 'px;}';
    content += '#apps-scroller ul{width:' + width + 'px;height:' + height + 'px;}';
    content += '#apps-scroller .item,#guide-list .item{min-width:' + itemWidth + 'px;height:' + (imgWidth + 40) + 'px;}';
    content += '#apps-scroller img,#guide-list img{min-width:' + imgWidth + 'px;min-height:' + imgWidth + 'px}';
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
      , feedsCollection = new gamepop.model.FeedsCollection()
      , feeds = new gamepop.view.FeedsList({
          el: '#feeds',
          collection: feedsCollection
        })
      , allGuidesCollection = new gamepop.model.AllGuidesCollection()
      , nav = new gamepop.view.Nav({
          el: '#main-nav',
          collection: appsCollection
        })
      , router = new gamepop.Router();

    context.mapValue('gui', gui);
    context.mapValue('nav', nav);
    context.mapValue('router', router);
    context.mapValue('all', allGuidesCollection);
    context.mapValue('apps', appsCollection);
    context.mapValue('downloads', []);
    context.mediatorMap.isBackbone = true;
    context
      .inject(gui)
      .inject(nav)
      .inject(feeds)
      .inject(router)
      .mediatorMap
        .map('.all-guides-list', gamepop.view.AllGuides, {
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
        });
    context.mapEvent('download', gamepop.controller.DownloadCommand);
    context.createInstance(gamepop.view.AppsList, {
      el: '#apps',
      collection: appsCollection
    });

    // 对于Android Webview，不支持标准的display: flex，只能使用display: inline-block
    // 所以只能用JS算出宽度
    createCss(document.body.clientWidth);

    // 分析路径
    Backbone.history.start();

    // for native
    gamepop.back = _.bind(gui.backButton_tapHandler, gui);

    // for duoshuo
    if (navigator.onLine) {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'http://static.duoshuo.com/embed.js';
      document.head.appendChild(script);
    }

    // ga
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','http://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-35957679-10', 'c.yxpopo.com');
    ga('send', 'pageview');
    ga('send', 'event', 'version', '@@version');
  }

  if (PHONEGAP) {
    document.addEventListener('deviceready', onDeviceReady, false);
  } else {
    $(init);
  }

}());

// for duoshuo
var duoshuoQuery = {short_name:"yxpopo"};