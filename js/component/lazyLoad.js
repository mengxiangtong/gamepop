
;(function (ns) {

var round = Math.round;

/**
 * Get approximate human readable time with `date`.
 *
 * @param {Number|Date} date
 * @return {String}
 * @api public
 */
function showImg(img) {
  if (img.hasAttribute('data-src')) {
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src');
  }
}

function elementInViewport(el) {
  var rect = el.getBoundingClientRect()
  return (
      rect.top    >= 0
  && rect.left   >= 0
  && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
  )
}

ns.lazyLoad = function(el){
  function check() {
    var imgs = el.querySelectorAll('img');
    imgs = [].slice.call(imgs);
    imgs.forEach(function(img) {
      if (!img.hasAttribute('data-src')) return;
      var shown = elementInViewport(img);
      if (shown) {
        showImg(img);
      }
    });
  }
  check();
  //export check method
  return check;
};

function format(n, unit){
  return n + unit;
}
}(Nervenet.createNameSpace('gamepop.component')));
