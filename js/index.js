/**
 * main
 */
;(function () {
  'use strict';
  function createCss(width, height) {
    // 作为客户端默认样式写在样式表中
    if (width === 360 && height === 615 || width === 320 && height === 568) {
      return;
    }
    var style = document.createElement('style')
      , size = {
        height: height,
        sidebarHeight: height * .9 - 150 >> 0,
        'cards-toggle-top': height - 40
      }
      , content;
    if (width !== 360 && width !== 320) { // 标准宽度不计算
      var homepageItemWidth = width > 320 ? (width - 60) / 3 : (width - 38) / 3
        , hotGameItemWidth = width > 320 ? (width - 62) / 3 : (width - 52) / 3
        , hotGameHeight = hotGameItemWidth + 35;
      size = _.extend(size, {
        width: width,
        homepageItemWidth: homepageItemWidth,
        hotGameItemWidth: hotGameItemWidth,
        'hot-game-height': hotGameHeight,
        'girl-height': (width - 30 << 1) / 3,
        'girl-item-height': (width - 30) / 3 >> 0
      });
    }
    content = TEMPLATES.css(size);
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

      // 加载client的CSS
      if (!WEB) {
        if (/android/i.test(navigator.userAgent)) {
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'css/android.css';
          document.head.appendChild(link);
        } else if (/iphone os/i.test(navigator.userAgent)) {
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'css/iOS.css';
          document.head.appendChild(link);
          var ios = navigator.userAgent.match(/iphone os (\d)/i);
          document.body.className = 'ios ios' + ios[1];
        }
      }
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
      , cards = new gamepop.view.Cards({
        el: '#cards',
        collection: appsCollection
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
      .mapValue('homepage', homepage)
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
        .map('.hot-game-list', gamepop.view.HotGame, {
          collection: rss
        })
        .map('#boobs', gamepop.view.Boobs);

    createCss(document.body.clientWidth, document.body.clientHeight);

    // for android native
    if (!WEB) {
      gamepop.back = _.bind(gui.backButton_tapHandler, gui);
      gamepop.refresh = _.bind(appsCollection.fetch, appsCollection, {reset: true});
      gamepop.ready = _.bind(homepage.render, homepage);
    } else { // 通过浏览器浏览，也可能是微信微博等
      var android = /android/i
        , isAndroid = android.test(navigator.userAgent);

      if (isAndroid) {
        var css = $('<link href="css/android.css" rel="stylesheet" />');
        $('head').append(css);
        $(".download-url-button").attr("href",config.android_url);
      }else{
        $(".download-url-button").attr("href",config.ios_url);
      }
      // 添加下载栏条
      var web_css = $('<link href="css/web.css" rel="stylesheet" />');
      $('head').append(web_css);
      document.body.className = 'web';

      // 用于记录download-panel是否存在
      localStorage.setItem("no-download-panel",0);

      // stat
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
