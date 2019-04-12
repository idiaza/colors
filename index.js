var StaticServer = require('static-server');
var server = new StaticServer({
  rootPath: '.',
});

server.start();
