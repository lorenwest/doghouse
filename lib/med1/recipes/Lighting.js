// Recipe for controlling lighting

var Monitor = require('monitor'),
    logger = Monitor.getLogger('BoardTemp');

// Constants
var HOURS_ON = [9,10,11,12,13,14,15,16,17,18];
var LIGHT_NAMES = ['lights1_1', 'lights1_2', 'lights2_1', 'lights2_2'];
var MAX_TIME_BETWEEN_LIGHTS_MS = 30000;
var MAX_SWITCHING_TIME_MS = LIGHT_NAMES.length * MAX_TIME_BETWEEN_LIGHTS_MS;

Monitor.RecipeProbe.extend({

  probeClass: 'BoardTemp',
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
  *  - Lights on between the hours of 9am and 9pm
  *  - On transition from on->off and off->on
  *    - Switch in order 1-1, 1-2, 2-1, and 2-2
  *    - Delay random 0-30 seconds between lights
  */
  run: function(context) {
    var t = this,
        med1 = context.med1,
        hour = new Date().getHours();

    // Don't process if switching now
    if (t.isSwitchingNow) {
      return;
    }

    // What is the expected value based on on/off
    var expectedValue = (HOURS_ON.indexOf(hour) >= 0) ? 1 : 0;

    // Are any lights in need of switching?
    var needsSwitching = false;
    for (var lightName in LIGHT_NAMES) {
      if (med1.get(lightName) !== expectedValue) {
        needsSwitching = true;
      }
    }
    if (!needsSwitching) {
      return;
    }

    // Switch the lights now
    t.isSwitchingNow = true;
    var switchLight = function() {
      for (var lightName1 in LIGHT_NAMES) {
        if (med1.get(lightName1) !== expectedValue) {
          med1.set(lightName1, expectedValue);
          setTimeout(switchLight, Math.random() * MAX_TIME_BETWEEN_LIGHTS_MS);
          return;
        }
      }
      t.isSwitchingNow = false;
    }
    switchLight();
  }

});
