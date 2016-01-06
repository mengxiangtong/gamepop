'use strict';

var express = require('express')
  , app = express();

app.use(express.static('./'));

var server = app.listen(3000, function () {
  let host = server.address().address
    , port = server.address().port;

  console.log('Server: http://%s:%s', host, port);
})
