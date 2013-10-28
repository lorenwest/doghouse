var b = require('bonescript');
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
    enable: 'P9_21'
  },
  enabled:true,
  position:0
}

var ic = module.exports = new IC(config, 0x0, function(err){

  if (err) {
    console.error("ERROR: ", err);
    return;
  }

});
