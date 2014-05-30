/**
 * Created by meathill on 14-5-19.
 */
;(function (ns) {
  'use strict';

  var is3d = (function () {
    var div = document.createElement('div')
      , before = div.style.webkitPerspective;
    div.style.webkitPerspective = '1px';
    return div.style.webkitPerspective != before;
  }());

  ns.Carousel = Backbone.View.extend({
    width: 360,
    total: 0,
    current: 0,
    events: {
      'dragright': 'dragHandler',
      'dragleft': 'dragHandler',
      'swipeleft': 'swipeLeftHandler',
      'swiperight': 'swipeRightHandler',
      'release': 'releaseHandler'
    },
    initialize: function (options) {
      Hammer(this.el, {
        dragLockToAxis: true,
        preventDefault: true
      });
      this.container = this.$('ul');
      this.indicator = options.indicator;
      this.indicatorWidth = options.indicator.width();
      this.token = this.indicator.children();
      this.refresh();
    },
    next: function() {
      return this.showPane(this.current + 1, true);
    },
    prev: function() {
      return this.showPane(this.current - 1, true);
    },
    refresh: function () {
      this.width = this.$el.width();
      this.total = Math.ceil(this.container.outerWidth() / this.width);

      // indicators
      var width = this.indicatorWidth * (this.total * 2 - 1);
      this.indicatorBarWidth = width - this.indicatorWidth;
      this.indicator.css({
        width: width,
        'margin-left': -(width >> 1) + 'px'
      }).show();
    },
    setContainerOffset: function (percent, animate) {
      this.container.toggleClass("animate", animate);
      this.token.toggleClass('animate', animate);
      var indicatorOffset = -percent / (1 - 1 / this.total) * this.indicatorBarWidth / 100;
      indicatorOffset = indicatorOffset > 0 ? indicatorOffset : 0;
      indicatorOffset = indicatorOffset < this.indicatorBarWidth ? indicatorOffset : this.indicatorBarWidth;

      if (is3d) {
        this.container.css("transform", "translate3d("+ percent +"%,0,0) scale3d(1,1,1)");
        this.token.css('transform', "translate3d(" + indicatorOffset + "px,0,0) scale3d(1,1,1)");
      } else {
        this.container.css("transform", "translateX("+ percent +"%)");
        this.token.css('transform', 'translateX(' + indicatorOffset + 'px)');
      }
    },
    showPane: function(index, animate) {
      // between the bounds
      index = Math.max(0, Math.min(index, this.total-1));
      this.current = index;

      var offset = -((100 / this.total) * this.current);
      this.setContainerOffset(offset, animate);
    },
    dragHandler: function (event) {
      // stick to the finger
      var pane_offset = -(100 / this.total) * this.current;
      var drag_offset = ((100 /this.width) * event.originalEvent.gesture.deltaX) / this.total;

      // slow down at the first and last pane
      if ((this.current === 0 && event.originalEvent.gesture.direction === "right") ||
        (this.current === this.total - 1 && event.originalEvent.gesture.direction === "left")) {
        drag_offset *= .4;
      }
      this.setContainerOffset(drag_offset + pane_offset);
    },
    releaseHandler: function (event) {
      if (Math.abs(event.originalEvent.gesture.deltaX) > this.width / 3) {
        if (event.originalEvent.gesture.direction === 'right') {
          this.prev();
        } else {
          this.next();
        }
      } else {
        this.showPane(this.current, true);
      }
    },
    swipeLeftHandler: function (event) {
      this.next();
      event.originalEvent.gesture.stopDetect();
    },
    swipeRightHandler: function (event) {
      this.prev();
      event.originalEvent.gesture.stopDetect();
    }
  });
}(Nervenet.createNameSpace('gamepop.component')));