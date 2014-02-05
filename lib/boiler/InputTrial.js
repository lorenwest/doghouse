#! /usr/bin/node

var Monitor = require('monitor');
require('beaglebone-monitor');
var BoardDef = require('./board-def');
var inputBoard = BoardDef.inputBoard;
var outputBoard = BoardDef.outputBoard;

inputBoard.connect(function(error) {
  if (error) {
    console.error('inputBoard error: ', error);
    process.exit(1);
  }

  inputBoard.on('change', function() {
    inPins = inputBoard.toProbeJSON();
    delete inPins.id;
    delete inPins.pins;
    delete inPins.inputs;
    delete inPins.probeId;
    console.log('Input pins:\n', inPins);
  });
});

// Process safety
function gracefulShutdown(reason) {

  // This can be called multiple times from different events.  We have
  // to look at all events, but don't want to run this code more than once.
  // Adding this to the process object for widespread publication.
  if (process.shuttingDown) {return;}
  process.shuttingDown = true;
  console.error('Shutting down: ' + reason);
  process.exit(0);
}
process.on('exit', function() {gracefulShutdown('exit');});
process.on('SIGINT', function() {gracefulShutdown('SIGINT');});
process.on('SIGHUP', function() {gracefulShutdown('SIGHUP');});
process.on('SIGTERM', function() {gracefulShutdown('SIGTERM');});
process.on('SIGUSR2', function() {gracefulShutdown('SIGUSR2');});
process.on('uncaughtException', function() {gracefulShutdown('uncaughtException');});
