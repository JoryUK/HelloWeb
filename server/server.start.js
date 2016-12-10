#!/usr/bin/env node

/**
 * Module dependencies.
 */
var express = require('express');
var app = require('../app');
var debug = require('debug')('node-express-mongodb:server');
var http = require('http');
const Rx = require('rx');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
 var requests_ = new Rx.Subject();

 /**
  * Event listener for HTTP server "listening" event.
  */
 // {req, res}
 function onListening(ev) {
    var addr = server.address();
    var bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
    console.log('Listening on ' +bind);
    debug('Listening on ' + bind);
 }


 requests_.subscribe(onListening)

 var hostname = 'localhost';
 var server = http.createServer(app, (req, res) => { requests_.onNext({ req: req, res: res }); })
 .listen(port, hostname, () => {  console.log(`Server running at http://${hostname}:${port}/`); });

 var subscription = requests_
   .tap(e => console.log('request to', e.req.url))
   .subscribe(
     onListening,
     console.error,
     () => {
         console.log('stream is done')
         // nicely frees the stream
         subscription.dispose()
     }
   )
 process.on('exit', () => subscription.dispose())

var io = require('socket.io')(server);
io.on('connection', (socketServer) => {
  socketServer.on('npmStop', () => {
    process.exit(0);
  });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port))
    return val;
  if (port >= 0)
    return port;
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
