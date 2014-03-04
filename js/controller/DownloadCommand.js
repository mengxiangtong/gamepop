/**
 * Created by meathill on 14-2-14.
 */
;(function (ns) {
  var games
    , interval = 0;
  function check() {
    games = _.filter(games, function (game) {
      var percent = progress.getDownLoadProgress(game.id);
      if (percent >= 100) {
        game.set({
          "has-offline": true,
          "downloading": false,
          "url": '#/local/' + game.id + '/index.html'
        });
        return false;
      } else if (percent === -1) {
        game.set({
          "downloading": false
        });
        return false;
      }
      game.set('progress', percent);
      return true;
    });
    if (games.length === 0) {
      clearInterval(interval);
      interval = 0;
    }
  }
  ns.DownloadCommand = function (id, name, collection) {
    // 手工触发下载
    location.href = 'download://' + id + '/' + name;

    games = this.getValue('downloads');
    var icon = this.getValue('all').get(id) ? this.getValue('all').get(id).get('icon_path') : 'img/image.png';
    if (!collection.get(id)) {
      collection.add({
        "id": id,
        "url": "#/remote/" + id + '/',
        "name": name,
        "icon": icon,
        "has-guide": true,
        "downloading": true,
        "progress": 0
      });
    }
    var game = collection.get(id);
    game.set({
      "downloading": true,
      "progress": 0
    });
    if (games.indexOf(game) === -1) {
      games.push(game);
    }
    if (interval === 0) {
      interval = setInterval(check, 500);
    }
  };
}(Nervenet.createNameSpace('gamepop.controller')));