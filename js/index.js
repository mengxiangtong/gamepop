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
      , hpItemWidth = width > 320 ? (width - 60) / 3 : (width - 50) / 3
      , size = {
        width: width,
        height: height,
        'content-height': height - 45,
        itemWidth: width - 16 * 5 >> 2,
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

    var context = Nervenet.createContext()
      , gui = new gamepop.view.GUI({
          el: document.body
        })
      , appsCollection = new gamepop.model.AppsCollection()
      , list = new gamepop.view.AppsList({
          el: '#apps',
          collection: appsCollection
        })
      , results = new gamepop.model.SearchCollection()
      , search = new gamepop.view.SearchForm({
        el: '#search-form',
        collection: results
      })
      , router = new gamepop.Router();

    context
      .mapValue('gui', gui)
      .mapValue('list', list)
      .mapValue('router', router)
      .mapValue('apps', appsCollection)
      .mapValue('result', results)
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

// 判断平台类型
var platform = navigator.userAgent.match(/iPhone OS (\d+)/);
if (platform) {
  var ga = {
    event: function (type, target, label, value) {
      console.log(type, target, label, value)
    },
    pageview: function (url) {
      console.log(url);
    }
  };
  document.body.className = 'ios' + platform[1];
}