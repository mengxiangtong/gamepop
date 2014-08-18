/**
 * Created by wang on 2014/8/14.
 */

var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") < 1;
//判断是否是safari浏览器
if(isSafari){
  var arr = document.getElementById("download");
  arr.style.display="none";
}
