#! /usr/bin/node

var b = require('bonescript');
var bb = require('../common/bb');
var IC = require('../common/IC74HC595');

var shiftRegisterPins = {
  data: 'P9_18',
  clock: 'P9_22',
  latch: 'P9_17',
  enable: 'P9_21',
};

var boilerPins = {
  waterFlow: 'P9_27',
  apartmentThermostat: 'P9_28',
  mainThermostat: 'P9_29'
}

var sensorState = 0;
var relayState = 0;

var initialize = function(callback) {

  // Initialize the relays
  ic = new IC(shiftRegisterPins, ~0x00, function(err){

    if (err) {
      console.error("ERROR initializing relays: ", err);
      console.error("Continuing...");
      err = null;
    }

    var pins = [
      {name:boilerPins.waterFlow, direction:b.INPUT},
      {name:boilerPins.apartmentThermostat, direction:b.INPUT},
      {name:boilerPins.mainThermostat, direction:b.INPUT}
    ]
    bb.initGPIO(pins, function(err) {
      if (err) {
        console.error("ERROR initializing GPIO input: ", err);
        console.error("Continuing...");
        err = null;
      }

      callback();
    });


  });
};


initialize(function(){
  console.log('Initialized');

  setInterval(function() {

    // Initialize values
    var values = {
      waterFlow: false,
      apartmentThermostat: false,
      mainThermostat: false
    }

    // Read all pins
    b.digitalRead(boilerPins.waterFlow, function(result) {
      values.waterFlow = result.value === 1 ? 0 : 1;
      b.digitalRead(boilerPins.apartmentThermostat, function(result) {
        values.apartmentThermostat = result.value === 1 ? 0 : 1;
        b.digitalRead(boilerPins.mainThermostat, function(result) {
          values.mainThermostat = result.value === 1 ? 0 : 1;

          // Set output states
          var callForHeat = values.mainThermostat || values.apartmentThermostat;
          var states = {
            dhw: values.waterFlow,
            radiant: values.waterFlow ? 0 : (callForHeat ? 1 : 0),
            waterSwitch: (callForHeat && !values.waterFlow) ? 1 : 0
          }

          // Compute the state of input sensors and relay states
          var sensors = 0 | values.waterFlow | (values.apartmentThermostat * 2) | (values.mainThermostat * 4)
          var relays = 0 | states.dhw | (states.radiant * 2) | (states.waterSwitch * 4)

          // Log if either relays or sensors are different
          if (sensors !== sensorState || relays !== relayState) {
            console.log(JSON.stringify({inputs:values,outputs:states}));
            sensorState = sensors;
          }

          // Change relays if relay state is different
          if (relays !== relayState) {
            ic.values = [~relays];
            ic.shiftOut(function(err) {
              if (err) {
                console.error('Relay shiftOut error: ', err);
              }
              relayState = relays;
            });
          }
        });
      });
    });
  }, 2000);

});

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
