/**
 * Created by ghostflow on 2014/9/23.
 */
document.addEventListener("WeixinJSBridgeReady", function onBridgeReady() {
  WeixinJSBridge.call("hideToolbar");
});

var dataForWeixin = {
  appId: "",
  img_width: "200",
  img_height: "200",
  img: "http://m.yxpopo.com/img/web/144.png",
  url: location.href
};

function onWxBridgeReady() {
  // 发送给好友;
  WeixinJSBridge.on("menu:share:appmessage", function (argv) {
    WeixinJSBridge.invoke("sendAppMessage", {
      "appid": dataForWeixin.appId,
      "img_url": dataForWeixin.img,
      "img_width": dataForWeixin.img_width,
      "img_height": dataForWeixin.img_height,
      "link": location.href,
      "desc": $("article").find('p').eq(0).html(),
      "title": $("title").text()
     },
    function (res) {
      WeixinJSBridge.log(res.err_msg);
    });
  });

  // 分享到朋友圈;
  WeixinJSBridge.on("menu:share:timeline", function (argv) {
    WeixinJSBridge.invoke("shareTimeline", {
      "img_url": dataForWeixin.img,
      "img_width": dataForWeixin.img_width,
      "img_height": dataForWeixin.img_height,
      "link": location.href,
      "desc": $("article").find('p').eq(0).html(),
      "title": $("title").text()
    },
    function (res) {
      WeixinJSBridge.log(res.err_msg);
    });
  });

  // 分享到微博;
  WeixinJSBridge.on("menu:share:weibo", function (argv) {
    WeixinJSBridge.invoke("shareWeibo", {
      "content": $("title").text() + " " + location.href,
      "url": location.href
    },
    function (res) {
      WeixinJSBridge.log(res.err_msg);
    });
  });

  // 分享到Facebook
  WeixinJSBridge.on("menu:share:facebook", function (argv) {
    WeixinJSBridge.invoke("shareFB", {
      "img_url": dataForWeixin.img,
      "img_width": dataForWeixin.img_width,
      "img_height": dataForWeixin.img_height,
      "link": location.href,
      "desc": $("article").find('p').eq(0).html(),
      "title": $("title").text()
    },
    function (res) {
      WeixinJSBridge.log(res.err_msg);
    });
  });
}

if (typeof WeixinJSBridge == "undefined") {
  if (document.addEventListener) {
    document.addEventListener("WeixinJSBridgeReady", onWxBridgeReady, false);
  } else if (document.attachEvent) {
    document.attachEvent("WeixinJSBridgeReady", onWxBridgeReady);
    document.attachEvent("onWeixinJSBridgeReady", onWxBridgeReady);
  }
} else {
  onWxBridgeReady();
}