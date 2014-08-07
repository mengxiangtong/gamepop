/**
 * Created by meathill on 14-2-28.
 */
/**
 * 处理Android添加的GA方法
 */
(function () {
  var nga = ga;
  ga = function (method, type, category, action, label, value) {
    if (type === 'pageview') {
      nga.pageview(category);
    } else if (type === 'event') {
      nga.event([category, action, label, value].join(','));
    }
  }
}());
