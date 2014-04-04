/**
 * 单行本JS，直接加载游戏首页
 */
;(function () {
  'use strict';
  function onDeviceReady() {
    init();
  }
  function init() {
    var context = Nervenet.createContext()
      , gui = new gamepop.view.GUI({
          el: document.body
        })
      , router = new gamepop.Router();

    context.mapValue('gui', gui);
    context.mapValue('router', router);
    context.mediatorMap.isBackbone = true;
    context
      .inject(gui)
      .inject(router);

    // 分析路径
    Backbone.history.start();
  }

  if (PHONEGAP) {
    document.addEventListener('deviceready', onDeviceReady, false);
  } else {
    $(init);
  }

}());

ga = ga || function () {};