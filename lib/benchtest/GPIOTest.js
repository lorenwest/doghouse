/*
GPIO tester
*/

var b = require('bonescript');
var bb = require('../common/bb');
var IC = require('../common/IC74HC4067.js');

var pins = [
  {
    name: 'P9_11',
    direction: b.OUTPUT,
    value: b.HIGH,
    pull: 'pullup'
  }
];

bb.initGPIO(pins, function(error) {
  if (error) {
    return console.error('Initialization error', error);
  }

  console.log('Initialized.');

  b.digitalWrite('P9_11', b.LOW);
  setTimeout(function(){
    b.digitalWrite('P9_11', b.HIGH);
  },5000);

  // console.log('Set pin: ' + SET_PIN + ' to value: ' + SET_VALUE);

});
