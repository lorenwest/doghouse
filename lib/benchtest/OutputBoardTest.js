var SET_PIN = 7;
var SET_VALUE = 1;

/*
Output Board Test

Setup: Configure the benchtest cape like this:

 Pin     | Wire Color    | BeagleBone
---------+---------------+-------------
 Wired   | Orange Stripe | Ground
 Wired   | Orange        | +3.3v
 Wired   | Green Stripe  | +5.0v
 P8_10   | Blue          | data
 P8_12   | Blue Stripe   | clock
 P8_14   | Green         | latch
 P8_16   | Brown Stripe  | enable
 -----   | Brown         | (not used)

Test: 

1) Connect voltmeter negative to ground terminal
2) Determine the pin to set (top of the file)
3) Run this
4) Test the pin w/voltmeter

*/

var b = require('bonescript');
var bb = require('../common/bb');
var IC = require('../common/IC74HC595');

var shiftRegisterPins = { 
  data:  'P8_10',
  clock: 'P8_12',
  latch: 'P8_14',
  enable:'P8_16'
};

  // Initialize the relays
module.exports = ic = new IC(shiftRegisterPins, 0x00, function(err){
  if (err) {
    console.error("ERROR initializing relays: ", err);
    return;
  }

  console.log('Initialized.');
  ic.set(SET_PIN, SET_VALUE);
  ic.shiftOut(function(error) {
    if (error) {
      console.error("ERROR setting pin values: ", error);
      return
    }
    console.log('Set pin: ' + SET_PIN + ' to value: ' + SET_VALUE);
  });

});
