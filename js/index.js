/**
 * main
 */
;(function () {
  'use strict';
  function onDeviceReady() {
    init();
  }
  function init() {
    var context = Nervenet.createContext(),
        gui = new gamepop.view.GUI({
          el: document.body
        }),
        appsCollection = new gamepop.model.AppsCollection(),
        feedsCollection = new gamepop.model.FeedsCollection(),
        feeds = new gamepop.view.FeedsList({
          el: '#feeds',
          collection: feedsCollection
        }),
        allGuidesCollection = new gamepop.model.AllGuidesCollection(),
        router = new gamepop.Router();

    context.mapValue('gui', gui);
    context.mapValue('router', router);
    context.mapValue('all', allGuidesCollection);
    context.mediatorMap.isBackbone = true;
    context
      .inject(gui)
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
    context.mapEvent('layout', gamepop.controller.CreateCssCommand);
    context.createInstance(gamepop.view.AppsList, {
      el: '#apps',
      collection: appsCollection
    });

    Backbone.history.start();
  }

  if (PHONEGAP) {
    document.addEventListener('deviceready', onDeviceReady, false);
  } else {
    $(init);
  }

}());