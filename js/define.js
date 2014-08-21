/**
 * Created by meathill on 14-1-21.
 */
var DEBUG = true
  , PHONEGAP = false
  , WEB = true
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
  , ga = null;

if (!WEB) {
  ga = function (method, type, category, action, label, value) {
    console.log(method, type, category, action, label, value);
  };
}

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
      addShortCut: function (game_name, guide_name, icon_path) {
        console.log('create desktop shortcut: ', game_name, guide_name, icon_path);
      },
      openKeyboard: function () {
        console.log('zhima, zhima, open keyboard');
      },
      share: function (url, title) {
        console.log('share: ', url, title);
      }
    };

  }(window));

}