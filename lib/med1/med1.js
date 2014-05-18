#! /usr/bin/node
var Monitor = require('monitor'),
    bbMonitor = require('beaglebone-monitor'),
    FS = require('fs'),
    Path = require('path');

// Load Recipes
FS.readdirSync(Path.join(__dirname, 'recipes')).forEach(function(fileName) {
  if (fileName.substr(-3) === '.js') {
    require('./recipes/' + fileName);
  }
});

// Output BB values on change
setTimeout(function(){
  var bbMonitor = new Monitor({probeName: 'bb-med1'});
  bbMonitor.connect(function(){
  /*
    setTimeout(function(){
      bbMonitor.set('lights1_2', 1);
    },1000);
  */
  });
  bbMonitor.on('change', function() {
    var attrs = bbMonitor.toProbeJSON();
    delete attrs.id;
    delete attrs.pins;
    console.log(JSON.stringify(attrs));
  });
}, 100);

// Process safety
function gracefulShutdown(reason) {

  // This can be called multiple times from different events.  We have
  // to look at all events, but don't want to run this code more than once.
  // Adding this to the process object for widespread publication.
  if (process.shuttingDown) {return;}
  process.shuttingDown = true;
  console.error('Shutting down: ' + reason);

  // Print a stack trace
  console.log('Stack trace:');
  console.log((new Error).stack);

  // TODO: Call the shutdown method of all boards
  process.exit(0);
}
process.on('exit', function() {gracefulShutdown('exit');});
process.on('SIGINT', function() {gracefulShutdown('SIGINT');});
process.on('SIGHUP', function() {gracefulShutdown('SIGHUP');});
process.on('SIGTERM', function() {gracefulShutdown('SIGTERM');});
process.on('SIGUSR2', function() {gracefulShutdown('SIGUSR2');});
process.on('uncaughtException', function() {gracefulShutdown('uncaughtException');});
