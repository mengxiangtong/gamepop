/**
 * Created by meathill on 14-3-3.
 */
;(function (ns) {
  ns.DuoshuoProxy = function (options) {
    // 多说评论框
    if ('DUOSHUO' in window) {
      DUOSHUO.EmbedThread(options.el);
    }
  };
}(Nervenet.createNameSpace('gamepop.component')));