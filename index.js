var StaticServer = require('static-server');
var server = new StaticServer({
  rootPath: '.',
  port: process.env.PORT || 1337
});

server.start();
