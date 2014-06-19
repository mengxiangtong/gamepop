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
      , hpItemWidth = width > 320 ? (width - 60) / 3 : (width - 38) / 3
      , size = {
        width: width,
        height: height,
        hpItemWidth: hpItemWidth
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

    var iOS = navigator.userAgent.match(/iPhone OS (\d+)/)
      , isIOS7 = iOS && iOS[1] == 7
      , context = Nervenet.createContext()
      , gui = new gamepop.view.GUI({
          el: document.body
        })
      , homepage = new gamepop.view.Homepage({
        el: '#homepage'
      })
      , appsCollection = new gamepop.model.AppsCollection()
      , list = new gamepop.view.AppsList({
          el: '#my-apps',
          collection: appsCollection
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
        key: 'fav'
      })
      , sidebar = new gamepop.view.Sidebar({
        el: '#sidebar',
        collection: fav,
        recent: recent
      })
      , router = new gamepop.Router();

    context
      .mapValue('gui', gui)
      .mapValue('sidebar', sidebar)
      .mapValue('router', router)
      .mapValue('apps', appsCollection)
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
        });

    // 判断平台类型
    if (iOS) {
      document.body.className = 'ios' + iOS[1];
    }
    createCss(document.body.clientWidth, document.body.clientHeight);

    // 分析路径
    Backbone.history.start();

    // for native
    gamepop.back = _.bind(gui.backButton_tapHandler, gui);
    gamepop.refresh = _.bind(appsCollection.fetch, appsCollection, {reset: true});

    // stat
    ga.pageview('/');
  }

  if (PHONEGAP) {
    document.addEventListener('deviceready', onDeviceReady, false);
  } else {
    $(init);
  }
}());

if (!ga) {
  var ga = {
    event: function (info) {
      console.log(info);
    },
    pageview: function (url) {
      console.log(url);
    }
  };
}