/**
 * Created by wang on 2014/8/14.
 */
;(function (ns) {
  ns.DownloadPanel = Backbone.View.extend({
    nav:[
      {url: "http://fast-cdn.dianjoy.com/gamemaster/popo_v1.2.0_003.ipa", title:"ios"},
      {url: "http://fast-cdn.dianjoy.com/gamemaster/popo_v1.2.0_003_signed.apk",title:"android"}
    ],
    events: {
      'tap .download-url': 'downloadURL_tapHandler',
      'tap .remove-panel': 'removePanel_tapHandler'
    },
    initialize: function () {
      this.template = TEMPLATES.downloadUrl;
      this.render();
    },
    render: function(){
      //判断手机，以决定下载地址
      if(WEB){
        var ios = /iPhone OS/
          , isIOS = ios.test(navigator.userAgent);
        if(isIOS){
          //alert("http://fast-cdn.dianjoy.com/gamemaster/popo_v1.2.0_003.ipa");
        }else{
          //alert("http://fast-cdn.dianjoy.com/gamemaster/popo_v1.2.0_003_signed.apk");
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
