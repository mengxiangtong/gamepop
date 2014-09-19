/**
 * Created by admin on 2014/9/12.
 */

;(function (ns) {
  'use strict';
  var uid = null
    , token = null
    , dfd_data = new $.Deferred()
    , gui = null;

  ns.weiboLogin = Backbone.View.extend({
    $gui : null,
    initialize : function(){
      var timer1 = null
          , ajax_request = this.ajax_request;
          gui = this.$gui;
      timer1 = setInterval(function(){
        if(document.sinalogin.query !== undefined){
          if(timer1){
            clearInterval(timer1);
          }
          ajax_request();
        }
      },1000);
      dfd_data.done(this.ajax_request1);
    },
    ajax_request : function(){
      $.ajax({
        url : "https://api.weibo.com/oauth2/access_token?client_id="+"1607521664"+"&client_secret="+"cd436a90079a8757207145d2c23c2ee6"+"&grant_type=authorization_code&code="+document.sinalogin.query+"&redirect_uri=http%3A%2F%2Fwww.yxpopo.com%2Fweibo-redirect.html",
        type : "post",
        dataType : "json",
        success : function(data){
          uid = data.uid;
          token = data.access_token;
          dfd_data.resolve();
        }
      })
    },
    ajax_request1 : function(){
      $.ajax({
        url : "https://api.weibo.com/2/users/show.json?uid="+uid+"&source="+"1607521664"+"&_cache_time=30&access_token="+token,
        type : "get",
        dataType : "json"})
        .done(function(data){
          $("#login").text(data.screen_name)
              .siblings('p').text('注销').addClass('logout')
              .parent().siblings('img').attr('src',data.profile_image_url);
          var login_data = {
            "status" : "1",
            "login_name" : data.screen_name,
            'login_img' : data.profile_image_url,
            'login_id' : uid
          };
          localStorage.setItem('login',JSON.stringify(login_data));
          gui.back();
          gui.back();
          gui.back();
        })
     }
  })
}(Nervenet.createNameSpace('gamepop.view')));
