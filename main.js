var http = require('http'),
    router = require('./router.js'),
    parser = require('./parser.js'),
    tape = require('tape');

router.get('/', function(req, res){
  res.end();
});

var server = http.createServer(router.handler);

server.listen(3000);
