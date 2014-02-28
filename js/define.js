/**
 * Created by meathill on 14-1-21.
 */
var DEBUG = true
  , PHONEGAP = false
  , gamepop = gamepop || {
    view: {},
    model: {},
    polyfill: {},
    controller: {}
  }
  , DUOSHUO = DUOSHUO || {
    EmbedThread: function (dom) {}
  };

if (DEBUG) {
  (function (window) {
    var downloads = {};
    window.progress = {
      getDownLoadProgress: function (id) {
        if (id in downloads) {
          downloads[id] += 5;
          return downloads[id];
        } else {
          downloads[id] = 0;
          return 0;
        }
      }
    }
  }(window));

}