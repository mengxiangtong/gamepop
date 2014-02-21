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
        ga('send', 'event', 'download', 'ok', game.id);
        return false;
      } else if (percent === -1) {
        game.set({
          "downloading": false
        });
        ga('send', 'event', 'download', 'fail', game.id);
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
  ns.DownloadCommand = function (id, name, collection, context) {
    games = context.getValue('downloads');
    var icon = context.getValue('all').get(id) ? context.getValue('all').get(id).get('icon_path') : 'img/image.png';
    if (!collection.get(id)) {
      collection.add({
        "id": id,
        "url": "#/remote/" + id + '/',
        "name": name,
        "icon": icon,
        "has-guide": true,
        "downloading": true
      });
    }
    var game = collection.get(id);
    game.set({
      "downloading": true
    });
    if (games.indexOf(game) === -1) {
      games.push(game);
    }
    if (interval === 0) {
      interval = setInterval(check, 500);
    }
    ga('send', 'event', 'download', 'start', id);
  };
}(Nervenet.createNameSpace('gamepop.controller')));