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
    context
      .inject(gui)
      .inject(feeds)
      .inject(router);

    Backbone.history.start();
  }

  if (PHONEGAP) {
    document.addEventListener('deviceready', onDeviceReady, false);
  } else {
    $(init);
  }

}());