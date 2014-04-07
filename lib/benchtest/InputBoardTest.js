/*
Input Board Test

Setup: Configure the benchtest cape like this:

 Pin     | Wire Color    | BeagleBone
---------+---------------+-------------
 Wired   | Orange Stripe | Ground
 Wired   | Orange        | +3.3v
 P9_40   | Green Stripe  | GPIO input
 P9_32   | Blue          | +1.8v Analog
 P9_21   | Blue Stripe   | GPIO data0
 P9_22   | Green         | GPIO data1
 P9_23   | Brown Stripe  | GPIO data2
 P9_24   | Brown         | GPIO data3

Test: 

1) Connect test lead to 1.8v (top left terminal)
2) Run this - it should show 0 for all inputs
3) Touch test lead to each input
4) This should show the analog value of the pin being tested

*/

var b = require('bonescript');
var bb = require('../common/bb');
var IC = require('../common/IC74HC4067.js');

/*
* @class IC74HC4067
* @constructor
* @param config {Object} IC Configuration
* @param   config.pins {Object} Pin definitions
* @param     config.pins.data0 {String} BB data0 pin name ex: "P9_18"
* @param     config.pins.data1 {String} BB data1 pin name ex: "P9_19"
* @param     config.[pins.data2=''] {String} BB data2 pin name ex: "P9_20"
* @param     config.[pins.data3=''] {String} BB data3 pin name ex: "P9_21"
* @param     config.[pins.enable] {String} Enable pin name ex: "P9_22"
* @param   [enabled=true] {Boolean} Initial enabled true/false
* @param   [position=0] {int} Current switch position (0-15)
* @param [callback] {function(error)} Callback to run after initialization
*/

var config = {
  pins: {
    data0:'P9_21',
    data1:'P9_22',
    data2:'P9_23',
    data3:'P9_24',
    analog: 'P9_40'
  },
  enabled:true,
  position:0
}

var ic = module.exports = new IC(config, function(err){

  if (err) {
    console.error("IC Init ERROR: ", err);
    return;
  }
  console.log("InputBoard initialized.");

  var delayAfterSwitch = 0;
  var lastStamp = Date.now();

  // Read the analog value
  function readValue(inputNum) {
    b.analogRead(config.pins.analog, function(value){
      var val = +value.value.toFixed(2);
      if (val > .01) {
      // if (true) {
        console.log('Input-' + inputNum + ': ' + val);
      }
    });
  }

  function doIt(inputNum) {
    ic.switch(inputNum, function(){
      readValue(inputNum);
      var nextInput = inputNum == 15 ? 0 : inputNum + 1;
      doIt(nextInput);
    });
  }

  // Kick it off
  doIt(0);

  /*

    Time   | Description
    -------+-------------------------------------------------
    3-4ms  | Position an 8 position mux
    4-5ms  | Position a 16 position mux
    3-4ms  | Read an analog input pin

  */

});
