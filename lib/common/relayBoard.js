// This module represents an 8 relay board,
// front-ended by a 74HC595 shift register.
// a LOW value to these pins represents ON
//
// IC layout:
// PIN 15, 1-7 | Out0-7 | Output pins 0-7
// PIN 8       | GND    | Ground (-)
// PIN 9       | Out7"  | Chain - Serial out (for chaining to data in)
// PIN 10      | MR     | Clear - Master Reclear (active low)
// PIN 11      | SH_CP  | Clock - Shift Register Clock Pin
// PIN 12      | ST_CP  | Latch - Storage Register Clock Pin
// PIN 13      | OE     | Enable - Output Enable (low=enable, high=disable)
// PIN 14      | SER    | Data - Serial Data
// PIN 16      | VCC    | Supply voltage (+3v3)
//
// Assembly notes:
// * Tie OE to VCC w/10kOhm resistor to disable solenoids on power-on
// * 
//
// Pins
// {
//   data: "P9_18",
//   clock: "P9_22",
//   latch: "P9_17",
//   clear: "P9_15",
//   enable: "P9_18",
//
//   pSerialOut: b.
var sData  = "P9_18";
var sClock = "P9_22";
var sLatch = "P9_17";
var sClear = "P9_15";  // This can be tied high
// }

var b = require('bonescript');

var ModuleBoard = module.exports = function(pins) {
  var t = this;
  t.pins = pins;
  t.initialize();
};

ModuleBoard.prototype.initialize = function(pins, callback) {
}

moduleBoard.ON = b.LOW;
moduleBoard.OFF = b.HIGH;
