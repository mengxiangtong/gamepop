/**
 * Created by meathill on 14-1-22.
 */
var fs = require('fs')
  , xml2json = require('xml2json-stream')
  , parser = new xml2json.Parser()
  , input = fs.createReadStream(process.argv[2])
  , output = fs.createWriteStream(process.argv[3]);

input.pipe(parser).pipe(output);