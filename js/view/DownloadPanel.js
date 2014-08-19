/**
 * Created by wang on 2014/8/14.
 */
;(function (ns) {
  ns.DownloadPanel = Backbone.View.extend({
  url: '',
    events: {
      'tap .download-url': 'downloadURL_tapHandler',
      'tap .remove-panel': 'removePanel_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.download-url;
      if(WEB){
        var android = /android/i
          , isAndroid = android.test(navigator.userAgent);

        if (isAndroid) {
          url = "http://fast-cdn.dianjoy.com/gamemaster/popo_v1.2.0_003_signed.apk";
        }else{
          url = "http://fast-cdn.dianjoy.com/gamemaster/popo_v1.2.0_003.ipa";
        }
      }
    },
    downloadURL_tapHandler: function(event){

    },
    removePanel_tapHandler: function(event){
      this.$('.download-panel').remove();
    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
