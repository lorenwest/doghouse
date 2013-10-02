var b = require('bonescript');
var ic = require('./IC74HC595');

var pins = {
  data: 'P9_18',
  clock: 'P9_22',
  latch: 'P9_17',
  enable: 'P9_21'
};


var relays = new ic(pins, ~0x01, function(err){

  if (err) {
    console.error("ERROR: ", err);
    return;
  }

});

