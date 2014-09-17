/**
 * Created by 路佳 on 2014/7/24.
 */
var reg = /micromessenger/i
  , ios = /iPhone OS/
  , android = /android/i
  , isWeixin = reg.test(navigator.userAgent)
  , isIOS = ios.test(navigator.userAgent)
  , isAndroid = android.test(navigator.userAgent);
if (isWeixin) {
  document.body.addEventListener('click', function (event) {
    if (event.target.className === 'download-button' ||
      event.target.parentNode.className === 'download-button') {
      document.getElementById('cover').className = 'show';
    }
  }, false);
}
if (isIOS) {
  document.body.className = 'ios';
}
if (isAndroid) {
  document.body.className = 'android';
}
