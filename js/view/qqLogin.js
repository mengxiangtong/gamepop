/**
 * Created by admin on 2014/9/12.
 */
/**
 * Created by meathill on 14-1-21.
 */
;(function (ns) {
  'use strict';
  ns.qqLogin = Backbone.View.extend({
    $gui : null,
    initialize : function(){
      var timer = null
          , dfd =new $.Deferred()
          , $gui = this.$gui;
      timer = setInterval(function(){
        if (document.qqlogin.a !== undefined){
          if (timer) {
            clearInterval(timer);
          }
          dfd.resolve();
        }
      },1000);
      this.ajax_request = _.bind($gui.back,$gui)
      $.when(dfd).then(
        this.ajax_request
      )
    },
    ajax_request: function(){
      alert(1);
      $.ajax({
        url: "https://graph.qq.com/user/get_user_info?access_token="+document.qqlogin.b+"&oauth_consumer_key=101148626&openid="+document.qqlogin.a,
        type : "get",
        dataType : "json"
      }).done(function(data){
        $("#login").text(data.nickname)
            .siblings("p").text("注销").addClass('logout')
            .parent().siblings('img').attr('src',data.figureurl.replace('\\',''));
        var login_data = {
          "status" : "1",
          "login_name" : data.nickname,
          'login_img' : data.figureurl,
          'login_id' : document.qqlogin.a
        };
        localStorage.setItem('login',JSON.stringify(login_data));
        this.back();
        this.back();
      })
    }


  })

}(Nervenet.createNameSpace('gamepop.view')));
