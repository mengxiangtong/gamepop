/**
 * Created by meathill on 14-2-14.
 */
;(function (ns) {
  var games = []
    , interval = 0;
  function check() {
    games = _.filter(games, function (game) {
      var percent = progress.getDownLoadProgress(game.id);
      console.log('check', game.id, percent);
      if (percent >= 100) {
        game.unset('progress');
        game.set({
          "has-offline": true,
          "downloading": false,
          "url": '#/local/' + game.id + '/index.html'
        });
        ga.event('download', 'ok', game.id);
        return false;
      } else if (percent === -1) {
        game.set({
          "downloading": false
        });
        ga.event('download', 'fail', game.id);
        return false;
      }
      game.set('progress', percent);
      return true;
    });
    console.log('check turn', games.length);
    if (games.length === 0) {
      console.log('download all');
      clearInterval(interval);
      interval = 0;
    }
  }
  ns.DownloadCommand = function (id, name, collection) {
    // 手工触发下载
    location.href = 'download://' + id + '/' + name;

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
    ga.event('download', 'start', id);
  };
}(Nervenet.createNameSpace('gamepop.controller')));