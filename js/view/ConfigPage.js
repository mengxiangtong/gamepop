/**
 * Created by admin on 2014/8/19.
 */
;(function (ns) {
  'use strict';
  ns.ConfigPage = Backbone.View.extend({
    events: {
      "tap .intro-link": "introLink_tapHandler",
      "tap .suggustion-link": "suggustionLink_tapHandler",
      "tap .version-checked": "versionChecked_tapHandler"
    },
    initialize: function(){
      if($('#suggustion').length>0){
        var ifr = document.getElementById('suggustion').contentWindow.document.body;
        $(ifr).css('margin','0');
        $('.setting-suggustion iframe').height($(ifr).height())
      }
    },
    introLink_tapHandler: function(){
      window.location.href = "#/config-intro"
    },
    suggustionLink_tapHandler: function(){
      window.location.href = "#/config-suggustion"
    },
    versionChecked_tapHandler: function(){

    }
  });
}(Nervenet.createNameSpace('gamepop.view')));
