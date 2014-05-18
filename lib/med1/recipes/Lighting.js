// Recipe for controlling lighting

var Monitor = require('monitor'),
    logger = Monitor.getLogger('BoardTemp');

// Constants
var HOURS_ON = [9,10,11,12,13,14,15,16,17,18,19,20];
var HOURS_ON = [1,3,5,7,9,11,13,15,17,19,21,23];
var LIGHT_NAMES = ['lights1_1', 'lights1_2', 'lights2_1', 'lights2_2'];
var MIN_TIME_BETWEEN_LIGHTS_MS = 10000;
var MAX_TIME_BETWEEN_LIGHTS_MS = 30000;
var MAX_RANDOM_MS = MAX_TIME_BETWEEN_LIGHTS_MS - MIN_TIME_BETWEEN_LIGHTS_MS;

Monitor.RecipeProbe.extend({

  probeClass: 'Lighting',
  defaults: {
    monitors: {
      med1: {probeName:'bb-med1'}
    },
    autoStart: true,
    triggeredBy: {
      interval: 10000
    }
  },

  /**
  * Rules: 
  *
  *  - Interval recipe - every 10 seconds
  *  - Lights on between 9am and 9pm
  *  - Turn on/off the light fan at the same interval
  *  - On transition from on->off and off->on
  *    - Switch in order 1-1, 1-2, 2-1, and 2-2
  *    - Delay random 10-30 seconds between lights
  */
  run: function(context) {
    var t = this,
        med1 = t.monitors.med1,
        hour = new Date().getHours();

    // Don't process if switching now
    if (t.isSwitchingNow) {
      return;
    }
    t.isSwitchingNow = true;

    // Determine the expected value (on or off)
    var expectedValue = (HOURS_ON.indexOf(hour) >= 0) ? 1 : 0;

    // Turn the light fan on/off in sync with the lights
    med1.set('lightFan', expectedValue);

    // Turn the exhaust fans on/off with the lights
    // TODO: control these based on room temperature
    med1.set('exhFan1', expectedValue);
    med1.set('exhFan2', expectedValue);

    // Define a function to switch one light and dela for the next
    var switchOne = function() {

      // Are any lights in need of switching?
      for (var i = 0; i < LIGHT_NAMES.length; i++) {
        var lightName = LIGHT_NAMES[i];

        // Switch the light if needed
        if (med1.get(lightName) !== expectedValue) {
          med1.set(lightName, expectedValue);

          // Schedule the next light
          var randomMs = Math.floor(Math.random() * MAX_RANDOM_MS);
          var timeoutMs = MIN_TIME_BETWEEN_LIGHTS_MS + randomMs;
          setTimeout(switchOne, timeoutMs);
          return;
        }
      }

      // No lights neededed switching.  We're done.
      t.isSwitchingNow = false;
    };

    // Kick off the first switch
    switchOne();
  }

});
