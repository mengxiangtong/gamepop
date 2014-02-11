/**
 * main
 */
;(function () {
  function onDeviceReady() {
    init();
  }
  function init() {
    var context = Nervenet.createContext(),
        gui = new gamepop.view.GUI({
          el: document.body
        }),
        appsCollection = new gamepop.model.AppsCollection(),
        apps = new gamepop.view.AppsList({
          el: '#apps',
          collection: appsCollection
        }),
        feedsCollection = new gamepop.model.FeedsCollection(),
        feeds = new gamepop.view.FeedsList({
          el: '#feeds',
          collection: feedsCollection
        }),
        router = new gamepop.Router();

    context.mapValue('gui', gui);
    context.mapValue('router', router);
    context.mediatorMap.isBackbone = true;
    context
      .inject(gui)
      .inject(feeds)
      .inject(router)
      .mediatorMap
        .map('.all-guides-list', gamepop.view.AllGuides, {isSingle: true})
        .map('#offline-list', gamepop.view.Offline, {
          isSingle: true,
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