var b = require('bonescript');
var bb = require('./bb');
var IC = require('./IC74HC4067.js');

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
    data0:'P9_11',
    data1:'P9_12',
    data2:'P9_13',
    data3:'P9_14',
    enable: 'P9_21',
    analog: 'P9_36'
  },
  enabled:true,
  position:0
}

var ic = module.exports = new IC(config, function(err){

  if (err) {
    console.error("IC Init ERROR: ", err);
    return;
  }

  var lastPin = 0;
  var lastVal = 0;
  var delayAfterSwitch = 0;
  var lastStamp = Date.now();

  // Read the analog value
  function readValue() {
    b.analogRead(config.pins.analog, function(value){
      lastVal = Math.round(value.value * 1000);
      lastVal = lastVal > 970 ? '' : lastVal;
      if (lastPin == 0) {
        // console.log('Pin-' + lastPin + ': ' + lastVal);
      }
    });
  }

  function doIt() {
    if (++lastPin > 7) {
      lastPin = 0;
      var now = Date.now();
      // console.log("Cycle: " + (now - lastStamp));
      lastStamp = now;
    }
    ic.switch(lastPin, function(){
      readValue();
      process.nextTick(doIt);
    });
  }
  doIt();

  /*

    Time   | Description
    -------+-------------------------------------------------
    3-4ms  | Position an 8 position mux
    4-5ms  | Position a 16 position mux
    3-4ms  | Read an analog input pin

  */

});
