#! /usr/bin/node
var Monitor = require('monitor').start(),
    FS = require('fs'),
    express = require('express');
    Path = require('path');

// Load Recipes
FS.readdirSync(Path.join(__dirname, 'recipes')).forEach(function(fileName) {
  if (fileName.substr(-3) === '.js') {
    require('./recipes/' + fileName);
  }
});

// Start the monitor server
var Monitor = require('monitor');
Monitor.start();

// Register routes
var app = express();
app.use(express.static(__dirname + '/static'));
app.get('/', function(request, response, next) {
  response.send(
    '<html>' +
    '<head>' +
    '</head>' +
    '<body>' +
      'Hello world' +
    '</body>' +
    '</html>');
});

// Start the web server
var server = app.listen(80, function() {
  console.log('Listening on port %d', server.address().port);
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
