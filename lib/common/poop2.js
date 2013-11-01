#! /usr/bin/node

var b = require('bonescript');
var bb = require('../common/bb');
var IC = require('../common/IC74HC595');

var shiftRegisterPins = { 
  data: 'P9_11',   // blue
  clock: 'P9_12',  // blue stripe
  latch: 'P9_13',  // green
  enable: 'P9_14'  // brown stripe
};

  // Initialize the relays
module.exports = ic = new IC(shiftRegisterPins, ~0x00, function(err){
  if (err) {
    console.error("ERROR initializing relays: ", err);
    console.error("Continuing...");
    err = null;
  }

  console.log('Initialized.');
});
