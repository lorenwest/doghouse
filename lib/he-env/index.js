#! /usr/bin/node
var FS = require('fs'),
    bb = require('beaglebone-monitor'),
    express = require('express'),
    Path = require('path');

// Load Recipes
FS.readdirSync(Path.join(__dirname, 'lib')).forEach(function(fileName) {
  if (fileName.substr(-3) === '.js') {
    require('./lib/' + fileName);
  }
});

// Register routes
var app = express();
app.use(express.static(__dirname + '/app'));

// Start the web server
var server = app.listen(9000, function() {
  console.log('Listening on port %d', server.address().port);
});

// Start the monitor server
var Monitor = require('monitor');
var monitorServer = new Monitor.Server({server:server, gateway: true});
monitorServer.start(function(error){
  if(error) {
    console.error('Error starting monitor: ', error);
  }
});

// Process safety
function gracefulShutdown(reason, error) {

  // This can be called multiple times from different events.  We have
  // to look at all events, but don't want to run this code more than once.
  // Adding this to the process object for widespread publication.
  if (process.shuttingDown) {return;}
  process.shuttingDown = true;
  console.error('Shutting down: ' + reason);

  // Print a stack trace
  console.log('Stack trace:');
  console.log(error && error.stack ? error.stack : (new Error).stack);

  // TODO: Call the shutdown method of all boards
  process.exit(0);
}
process.on('exit', function() {gracefulShutdown('exit');});
process.on('SIGINT', function() {gracefulShutdown('SIGINT');});
process.on('SIGHUP', function() {gracefulShutdown('SIGHUP');});
process.on('SIGTERM', function() {gracefulShutdown('SIGTERM');});
process.on('SIGUSR2', function() {gracefulShutdown('SIGUSR2');});
process.on('uncaughtException', function(e) {
    gracefulShutdown('uncaughtException',e);
});
