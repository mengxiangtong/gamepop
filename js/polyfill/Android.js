/**
 * Created by meathill on 14-2-28.
 */
;(function (ns) {
  var ua = navigator.userAgent
    , match = ua.match(/Android\s([0-9\.]*)/)
    , isAndroid = !!match
    , androidVersion = parseFloat(match[1]);
  /**
   * Android 2.x版本，不支持overflow:auto时自动滚动
   * 所以用iScroll替代
   * @param dom dom节点
   * @return IScroll
   */
  ns.checkScroll = function (dom, context) {
    if (isAndroid && androidVersion < 3) {
      if (context.iscroll) {
        context.iscroll.destroy();
      }
      context.iscroll = ns.createIScroll(dom);
    }
  };
  ns.createIScroll = function (dom) {
    var iscroll = new IScroll(dom, {
      momentum: false,
      mouseWheel: false,
      disableMouse: true,
      disablePointer: true
    });
    return iscroll;
  };
  ns.refreshScroll = function (context) {
    if (context.iscroll) {
      setTimeout(function () {
        context.iscroll.refresh();
      }, 50);
    }
  }
}(Nervenet.createNameSpace('gamepop.polyfill')));