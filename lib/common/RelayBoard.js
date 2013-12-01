var b = require('bonescript');
var bb = require('./bb');

/*
Notes on an 8 relay module front-ended by a 74HC595 shift register.
See IC74HC595.js for the IC pin layout.
 
IC layout:
PIN 15, 1-7 | Out0-7 | Output pins 0-7
PIN 8       | GND    | Ground (-)
PIN 9       | Out7"  | Chain - Serial out (for chaining to data in)
PIN 10      | MR     | Clear - Master Reclear (active low)
PIN 11      | SH_CP  | Clock - Shift Register Clock Pin
PIN 12      | ST_CP  | Latch - Storage Register Clock Pin
PIN 13      | OE     | Enable - Output Enable (low=enable, high=disable)
PIN 14      | SER    | Data - Serial Data
PIN 16      | VCC    | Supply voltage (+3v3)
 
Assembly notes:
* Tie OE to VCC w/10kOhm resistor to disable solenoids on power-on
* Tie JD-VCC on relay board to +5v
* Tie MR (master reclear) to +VCC.
  

Ethernet from BB to the Relay board

Relay Board     Wire Color     BeagleBone
------------|---------------|-------------
 Ground     | Orange Stripe |   Ground
 Pin 16     | Orange        |   +3.3VDC
 JD-VCC     | Green Stripe  |   +5.0VDC
 Pin 14     | Blue          |   GPIO Data
 Pin 11     | Blue Stripe   |   GPIO Clock
 Pin 12     | Green         |   GPIO Latch
 Pin 13     | Brown Stripe  |   GPIO Enable
 ----       | Brown         |   ----

 
IC Layout

IC                 Notes
-----------------|----------------------------
PIN  1 - Out1    | Relay IN-7
PIN  2 - Out2    | Relay IN-6
PIN  3 - Out3    | Relay IN-5
PIN  4 - Out4    | Relay IN-4
PIN  5 - Out5    | Relay IN-3
PIN  6 - Out6    | Relay IN-2
PIN  7 - Out7    | Relay IN-1
PIN  8 - Ground  | Ground bus - 2 relay GNDs
PIN  9 - SER out | ---
PIN 10 - Clear   | Tied to +VCC
PIN 11 - Clock   | Blue Stripe
PIN 12 - Latch   | Green
PIN 13 - Enable  | Brown Stripe, 10kOhm to VCC
PIN 14 - Data    | Blue
PIN 15 - Out8    | Relay IN-8
PIN 16 - VCC     | VCC Bus - 3.3V
*/

/**
 *  This module drives the relay board with IC as configured above
 *
 * @class RelayBoard
 * @constructor
 * @param config {Object} IC Configuration
 * @param   config.pins {Object} Pin definitions
 * @param     config.pins.data {String} BB data0 pin name ex: "P9_18"
 * @param     config.pins.clock {String} BB data1 pin name ex: "P9_19"
 * @param     config.pins.latch {String} BB data1 pin name ex: "P9_19"
 * @param     config.pins.enable {String} BB data1 pin name ex: "P9_19"
 * @param   config.relays {boolean[]} Array of 8 booleans - one per relay
 * @param [callback] {function(error)} Callback to run after initialization
 */
var RelayBoard = module.exports = function(config, callback) {
  var t = this;
  t.pins = config.pins;
  t.relays = config.relays;
  callback = callback || function(){};

  // Set the pin I/O modes
  t._setPinModes(function(error) {
    if (error) {
      return callback(error);
    }

    // Set initial enable/disable
    t.enable(t.enabled, function(error) {
      if (error) {
        return callback(error);
      }
   
      // Set initial switch position
      t.switch(t.position, function(error) {
        if (error) {
          return callback(error);
        }
        callback();
      });
    });
  });

};

/**
 * Set the BB pin modes
 *
 * This sets all pins to GPIO OUTPUT
 *
 * @private
 * @method
 * @_setPinModes
 * @param callback {Function(err)}
 */
IC74HC4067.prototype._setPinModes = function(callback) {

  // Set the pin modes
  var t = this;

  // Set up the GPIO pins
  var modes = [
    {name: t.pins.data0, direction: b.OUTPUT, value: b.LOW},
    {name: t.pins.data1, direction: b.OUTPUT, value: b.LOW}
  ];

  // Set the optional pins
  if (t.pins.data2) {
    modes.push({name: t.pins.data2, direction: b.OUTPUT, value: b.LOW});
  }
  if (t.pins.data3) {
    modes.push({name: t.pins.data3, direction: b.OUTPUT, value: b.LOW});
  }
  if (t.pins.enable) {
    modes.push({name: t.pins.enable, direction: b.OUTPUT, value: b.LOW});
  }

  // Initialize the BB pins
  bb.initGPIO(modes, callback);

};

/**
 * Enable (or disable) flow to the common I/O pin
 *
 * @method
 * @enable
 * @param [enabled=true] {Boolean} Enable the flow?
 * @param [callback] {Function(err)}
 */
IC74HC4067.prototype.enable = function(enabled, callback) {
  var t = this;

  // Process optional params
  if (typeof(enabled) === 'function') {
    callback = enabled;
  }
  callback = callback || function(){};

  // Default enabled to true;
  if (typeof(enabled) !== 'boolean') {
    enabled = true;
  }

  // Don't process if the enabled pin isn't configured
  if (!t.pins.enable) {
    return callback();
  }

  // Tie pin 15 (enable) LOW to enable, HIGH to disable
  var pinValue = enabled ? b.LOW : b.HIGH;
  b.digitalWrite(t.pins.enable, pinValue, function(err) {
    if (err && err.err) {
      return callback({err: err.err, msg: 'Error enabling IC74HC4067'});
    }
    t.enabled = enabled;
    callback();
  });
};

/**
 * Switch the I/O to the specified I/O number
 *
 * @method
 * @switch
 * @param position {Int} Pin number to switch to (0-15)
 * @param callback {Function(err)}
 */
IC74HC4067.prototype.switch = function(position, callback) {
  var t = this;
  callback = callback || function(){};

  // Precondition - value must be in the range
  if (position < 0 ||
      (!t.pins.data2 && position > 3) ||
      (!t.pins.data3 && position > 7) ||
      (position > 15)) {
    return callback({err: 'RANGE', msg: 'Value out of range for IC74HC4067: ' + position});
  }

  // Called when a pin is set
  var numPinsLeft = 0;
  var didError = false;
  var whenSet = function(err) {

    // Process error (no-op if already errored)
    if (didError) {return;}
    if (err && err.err) {
      didError = true;
      return callback(err.err);
    }

    // Callback if this is the last pin
    if (--numPinsLeft === 0) {
      t.position = position;
      return callback();
    }

    // Still processing pins
    return;
  };

  // Set b.HIGH or b.LOW based on truthy
  function highOrLow(value) {
    return value ? b.HIGH : b.LOW;
  }

  // Set pins asynchronously in parallel
  numPinsLeft++;
  b.digitalWrite(t.pins.data0, highOrLow(position & 0x1), whenSet);
  numPinsLeft++;
  b.digitalWrite(t.pins.data1, highOrLow(position & 0x2), whenSet);
  if (t.pins.data2) {
    numPinsLeft++;
    b.digitalWrite(t.pins.data2, highOrLow(position & 0x4), whenSet);
    if (t.pins.data3) {
      numPinsLeft++;
      b.digitalWrite(t.pins.data3, highOrLow(position & 0x8), whenSet);
    }
  }
};
