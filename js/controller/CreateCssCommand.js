/**
 * Created by meathill on 14-2-18.
 * 针对不同的分辨率制定固定宽高的CSS样式
 */
;(function (ns) {
  ns.CreateCssCommand = function (width, num) {
    var style = document.createElement('style')
      , sw = document.body.clientWidth
      , itemWidth = width - 12 >> 2
      , height = itemWidth + 40 << 1
      , content = '#apps{height:' + height + 'px;min-height:' + height + 'px;}';
    content += '#apps-scroller{width:' + width * num + 'px;height:' + height + 'px;}';
    content += '#apps-scroller ul{width:' + width + 'px;height:' + height + 'px;}';
    content += '#apps-scroller .item{min-width:' + itemWidth + 'px}';
    content += '.carousel .item{width:' + sw + 'px;}'
    style.innerHTML = content;
    document.head.appendChild(style);
  }
}(Nervenet.createNameSpace('gamepop.controller')));