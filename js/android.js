/**
 * Created by wang on 2014/8/7.
 */
var reg =  android = /android/i
  , isAndroid = android.test(navigator.userAgent);


if (isAndroid) {
  setActiveStyleSheet("android.css");
}

function setActiveStyleSheet(filename){
  document.write("<link href= css/" + filename + "  rel = stylesheet >");
}