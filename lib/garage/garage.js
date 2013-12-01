#! /usr/bin/node

var b = require('bonescript');
var bb = require('../common/bb');
var IC = require('../common/IC74HC595');

// Process safety
function gracefulShutdown(reason) {

  // This can be called multiple times from different events.  We have
  // to look at all events, but don't want to run this code more than once.
  // Adding this to the process object for widespread publication.
  if (process.shuttingDown) {return;}
  process.shuttingDown = true;

  console.error('Shutting down: ' + reason);
  ic.values = [0xFF];
  ic.shiftOut(function(){
    console.error('Solenoids switched off');
    console.error('Graceful shutdown complete');
    process.exit(0);
  });
}
process.on('exit', function() {gracefulShutdown('exit');});
process.on('SIGHUP', function() {gracefulShutdown('SIGHUP');});
process.on('SIGTERM', function() {gracefulShutdown('SIGTERM');});
process.on('SIGUSR2', function() {gracefulShutdown('SIGUSR2');});
process.on('uncaughtException', function() {gracefulShutdown('uncaughtException');});
