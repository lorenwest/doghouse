var TEST_INTERVAL = 10000;
var TEST_PINS = [0,1];

var b = require('bonescript');
var PINS = ['P9_39','P9_40','P9_37','P9_38','P9_33','P9_36','P9_35'];

/*

This test essentially just prints out the value of all analog inputs that have values

Setup: 

 Pin     | Wire Color    | BeagleBone
---------+---------------+-------------
 P9_32   |               | +1.8v Analog
 P9_39   | Blue Stripe   | AIN0
 P9_40   | Green         | AIN1

*/


var onInterval = function() {
  var readPin = function(pinNum) {

    var pinId = PINS[TEST_PINS[pinNum]];
    var pinName  = b.bone.pins[pinId].name;

    b.analogRead(pinId, function(x){
      // var val = +value.value.toFixed(2);
      var val = +x.value;
      console.log(pinName + ' - ' + pinId + ': ' +  val);

      // Read the next pin, or exit if done
      if (pinNum < TEST_PINS.length - 1) {
        readPin(pinNum + 1);
      }
      else {
        console.log('');
      }
    });
  };

  console.log((new Date()).toISOString());
  readPin(0);

};

// Do it right away, and on interval
onInterval();
setInterval(onInterval, TEST_INTERVAL);
