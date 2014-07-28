/**
 * Created by meathill on 14-1-21.
 */
var DEBUG = true
  , PHONEGAP = false
  , WEB = false
  , TEMPLATES = {}
  , gamepop = gamepop || {
    view: {},
    model: {},
    polyfill: {},
    controller: {}
  }
  , DUOSHUO = {
    EmbedThread: function (dom) {}
  }
  , ga = {
    event: function (info) {
      console.log(info);
    },
    pageview: function (url) {
      console.log(url);
    }
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
    };

    window.device = {
      openKeyboard: function () {
        console.log('zhima, zhima, open keyboard');
      }
    };
  }(window));

}