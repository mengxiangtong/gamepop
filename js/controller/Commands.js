/**
 * Created by 路佳 on 14-3-1.
 */
;(function (ns) {
  ns.AppsListCollapseCommand = function () {
    this.getValue('list').$el.toggleClass('collapse');
  }
}(Nervenet.createNameSpace('gamepop.controller')));