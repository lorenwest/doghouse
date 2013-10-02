// Measuring a 10K thermistor
//
//  GND --- 10K fixed resistor --------- 10K thermistor --- VADC (pin 32)
//                                 ^
//                                 |
//                       Analog In Measured Here
//
// If resistor size = resistence of the thermistor at the "midpoint" of the 
// temperature range to monitor, analog reading (0-100) will be 50.

var b = require('bonescript');
var PIN = "P9_40";

function readIt() {
  b.analogRead(PIN, function(x) {
    if (x.err) {
      console.log('Error: ' + x.err);
    } else {
      console.log('Value: ' + Math.floor(x.value * 100));
    }
  });
}

setInterval(readIt, 100);
