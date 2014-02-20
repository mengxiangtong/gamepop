/**
 * Created by meathill on 14-2-14.
 */
;(function (ns) {
  var games
    , interval = 0;
  function check() {
    for (var i = 0, len = games.length; i < len; i++) {
      var game = games[i]
        , percent = progress.getDownLoadProgress(game.id);
      game.set('progress', percent);
      if (percent >= 100) {
        game.set({
          "has-offline": true,
          "has-guide": true,
          "downloading": false,
          "url": '#/local/' + game.id + '/index.html'
        });
        games = _.without(games, game);
      }
    }
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
        "downloading": true
      });
    }
    var game = collection.get(id);
    game.set({
      "has-guide": false,
      "downloading": true
    });
    if (games.indexOf(game) === -1) {
      games.push(game);
    }
    if (interval === 0) {
      interval = setInterval(check, 500);
    }
  };
}(Nervenet.createNameSpace('gamepop.controller')));