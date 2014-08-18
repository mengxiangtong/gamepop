/**
 * Created by meathill on 14-8-7.
 */

(function () {
  var iOS = navigator.userAgent.match(/iPhone OS (\d+)/)
    , iframe;
  function createIframe() {
    var iframe = $('<iframe id="app-bridge">');
    iframe.appendTo('body');
    return iframe;
  }
  function callNative(method, options) {
    iframe = iframe || createIframe();
    var params = [];
    for (var prop in options) {
      params.push(prop + '=' + options[prop]);
    }
    console.log('call native: app://' + method + '/?' + params.join('&'));
    iframe.attr('src', 'app://' + method + '/?' + params.join('&'));
  }

  var ga = window.ga = function (method, type, category, action, label, value) {
    if (type === 'pageview') {
      callNative('ga', {
        type: 'pageview',
        url: category || ''
      });
    } else if (type === 'event') {
      callNative('ga', {
        type: 'event',
        category: category,
        action: action,
        label: label || '',
        value: value || ''
      });
    }
  };
  // 将平台类型标注在body上
  document.body.className = 'ios ios' + iOS[1];
}());