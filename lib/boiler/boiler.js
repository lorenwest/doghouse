#! /usr/bin/node
var b = require('beaglebone');
var bb = require('../common/bb.js');

var Monitor = require('monitor');
require('beaglebone-monitor');
var BoardDef = require('./board-def');
var inputBoard = BoardDef.inputBoard;
var outputBoard = BoardDef.outputBoard;

// Rules to run on initialize and change
function processRules() {
  var input = inputBoard.toJSON();
  var output = outputBoard.toJSON();
  var set = {};
  var changes = {};

  // Rules
  set.aptRadiantValveOn = input.aptBoilerCalling ? 1 : 0;
  set.homeRadiantValveOff = input.aptBoilerCalling && !input.homeThermostat ? 1 : 0;
  set.homeRadiantPumpOn = input.homeThermostat && input.dhwRadiantValve ? 1 : 0;
  set.dhwRadiantValveRadiant = 
    (input.aptBoilerCalling || input.homeThermostat) && !input.dhwWaterFlow ? 1 : 0;
  set.callForRadiantOn = 
    (input.aptBoilerCalling || input.homeThermostat) ? 1 : 0;
  set.callForDhwOn = input.dhwWaterFlow;

  // Set the pins directly
  console.log('Set to: ', set);
  b.digitalWrite('P8_7', set.aptRadiantValveOn ? 1 : 0);
  b.digitalWrite('P8_9', set.homeRadiantValveOff ? 1 : 0);
  b.digitalWrite('P8_11', set.homeRadiantPumpOn ? 1 : 0);
  b.digitalWrite('P8_13', set.dhwRadiantValveRadiant ? 1 : 0);
  b.digitalWrite('P8_15', set.callForRadiantOn ? 1 : 0);
  b.digitalWrite('P8_17', set.CallForDhwOn ? 1 : 0);

  // Update the outputs if any changes
  var didChanges = false;
  for (var name in set) {
    if (set[name] !== output[name]) {
      changes[name] = set[name];
      didChanges = true;
    }
  }
  if (didChanges) {
    var inPins = inputBoard.toProbeJSON();
    delete inPins.id;
    delete inPins.pins;
    delete inPins.inputs;
    delete inPins.probeId;
    var outPins = outputBoard.toProbeJSON();
    delete outPins.id;
    delete outPins.pins;
    delete outPins.outputs;
    delete outPins.probeId;
    console.log('Changes detected');
    console.log('Inputs:\n', inPins);
    console.log('Prior Outputs:\n', outPins);
    console.log('New Settings:\n', changes);
    outputBoard.control('setOutputs', changes);
  }
}


// Connect the output board first, then the input board
console.log('Connecting output board');
outputBoard.connect(function(error) {
  if (error) {
    console.error('outputBoard error: ', error);
    process.exit(1);
  }
  console.log('Connecting input board');
  inputBoard.connect(function(error) {
    if (error) {
      console.error('inputBoard error: ', error);
      process.exit(1);
    }

    console.log('Initializing direct pins');
    bb.initGPIO([
      {name:'P8_7', direction:b.OUTPUT, value:b.HIGH, pull:'pulldown'},
      {name:'P8_9', direction:b.OUTPUT, value:b.HIGH, pull:'pulldown'},
      {name:'P8_11', direction:b.OUTPUT, value:b.HIGH, pull:'pulldown'},
      {name:'P8_13', direction:b.OUTPUT, value:b.HIGH, pull:'pulldown'},
      {name:'P8_15', direction:b.OUTPUT, value:b.HIGH, pull:'pulldown'},
      {name:'P8_17', direction:b.OUTPUT, value:b.HIGH, pull:'pulldown'}
    ], function() {

        // Process rules now and on change
        console.log('Processing rules');
        processRules();
        inputBoard.on('change', processRules);

    });
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

  // Shut down the output board
  outputBoard.control('enable', {enabled:false}, function(error){
    if (error) {
      console.error('Error during board disable: ', error);
    }
    else {
      console.error('Gracefully shut down');
    }
    process.exit(0);
  });
}
process.on('exit', function() {gracefulShutdown('exit');});
process.on('SIGINT', function() {gracefulShutdown('SIGINT');});
process.on('SIGHUP', function() {gracefulShutdown('SIGHUP');});
process.on('SIGTERM', function() {gracefulShutdown('SIGTERM');});
process.on('SIGUSR2', function() {gracefulShutdown('SIGUSR2');});
process.on('uncaughtException', function() {gracefulShutdown('uncaughtException');});
