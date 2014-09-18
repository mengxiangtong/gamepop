;(function (ns) {
  'use strict';

  function showImg(img) {
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src');
    img.removeAttribute('class');
  }

  function elementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 && rect.left >= 0
      && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  ns.lazyLoad = function(el, delay){
    function check() {
      var imgs = el.getElementsByClassName('ph');
      for (var i = 0, len = imgs.length, img; i < len; i++) {
        img = imgs[i];
        if (elementInViewport(img)) {
          showImg(img);
          i--;
          len--;
        }
      }
    }
    if (delay) {
      clearTimeout(el.timeout);
      el.timeout = setTimeout(check, delay);
    } else {
      check();
    }

    //export check method
    return check;
  };
}(Nervenet.createNameSpace('gamepop.component')));
