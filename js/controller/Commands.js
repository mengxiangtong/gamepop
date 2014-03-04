/**
 * Created by 路佳 on 14-3-1.
 */
;(function (ns) {
  ns.AppsListCollapseCommand = function () {
    this.getValue('list').$el.toggleClass('collapse');
  }
  ns.refreshIScrollCommand = function () {
    var gui = this.getValue('gui');
    if (!gamepop.polyfill.refreshScroll(gui)) {
      gamepop.polyfill.checkScroll(gui.page[0], gui);
    }
  }
}(Nervenet.createNameSpace('gamepop.controller')));