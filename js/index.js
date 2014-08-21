/**
 * main
 */
;(function () {
  'use strict';
  function createCss(width, height) {
    var style = document.createElement('style')
      , hpItemWidth = width > 320 ? (width - 60) / 3 : (width - 38) / 3
      , size = {
        width: width,
        height: height,
        hpItemWidth: hpItemWidth,
        sidebarHeight: height * .9 - 195 >> 0
      }
      , content = TEMPLATES.css(size);
    style.innerHTML = content;
    document.head.appendChild(style);
  }
  function init() {
    if (DEBUG) {
      $('.template').each(function () {
        var key = this.id
          , content = this.innerHTML.replace(/\s{2,}|\n/g, '');
        TEMPLATES[key] = Handlebars.compile(content);
      }).remove();
    }

    var context = Nervenet.createContext()
      , gui = new gamepop.view.GUI({
          el: document.body
        })
      , appsCollection = new gamepop.model.AppsCollection()
      , rss = new gamepop.model.RSSCollection(null, {apps: appsCollection})
      , homepage = new gamepop.view.Homepage({
        el: '#homepage',
        collection: rss
      })
      , list = new gamepop.view.AppsList({
          el: '#my-apps',
          collection: appsCollection,
          rss: rss
        })
      , results = new gamepop.model.SearchCollection()
      , search = new gamepop.view.SearchForm({
        el: '#search-form',
        collection: results
      })
      , recent = new gamepop.model.LocalHistory(null, {
        key: 'recent',
        max: 10
      })
      , fav = new gamepop.model.LocalHistory(null, {
        key: 'fav',
        max: 128
      })
      , sidebar = new gamepop.view.Sidebar({
        el: '#sidebar',
        collection: fav,
        recent: recent,
        rss: rss
      })
      , router = new gamepop.Router();

    context
      .mapValue('gui', gui)
      .mapValue('sidebar', sidebar)
      .mapValue('router', router)
      .mapValue('apps', appsCollection)
      .mapValue('rss', rss)
      .mapValue('result', results)
      .mapValue('recent', recent)
      .mapValue('fav', fav)
      .mediatorMap.isBackbone = true;
    context
      .inject(gui)
      .inject(router)
      .inject(search)
      .inject(results)
      .mediatorMap
        .map('.game-page', gamepop.view.GamePage, {
          collection: appsCollection
        })
        .map('.search-result', gamepop.view.SearchResult, {
          collection: results
        })

    createCss(document.body.clientWidth, document.body.clientHeight);

    // for android native
    if (!WEB) {
      gamepop.back = _.bind(gui.backButton_tapHandler, gui);
      gamepop.refresh = _.bind(appsCollection.fetch, appsCollection, {reset: true});
    }

    // stat
    if (WEB) { // 通过浏览器浏览，也可能是
      var android = /android/i
        , isAndroid = android.test(navigator.userAgent);

      if (isAndroid) {
        var css = $('<link href="css/android.css" rel="stylesheet" />');
        $('head').append(css);
      }
      document.body.className = 'web';

      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=Array.prototype.pop.call(s.getElementsByTagName(o));
        a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-35957679-14', 'auto');
    }

    // 除了首次访问，其它路径都记录下来，以便回退时找到跳出点
    router.start(Backbone.history.start());
  }

  if (PHONEGAP) {
    document.addEventListener('deviceready', init, false);
  } else {
    $(init);
  }
}());
