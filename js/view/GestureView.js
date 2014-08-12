;(function (ns) {
  ns.GestureView = ns.View.extend({
    gestures: {

    },
    constructor: function (options) {
      ns.View.prototype.constructor.call(this, options);
      this.delegateGestures();
    },
    delegateGestures: function () {

    }
  });
}(Backbone));