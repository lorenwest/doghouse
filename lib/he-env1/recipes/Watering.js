// Recipe for turning on the water pump when needed
var Monitor = require('monitor'),
    _ = Monitor._,
    logger = Monitor.getLogger('Watering'),
    priorValues = {};

Monitor.RecipeProbe.extend({

  probeClass: 'Watering',
  defaults: {
    monitors: {
      bb: {probeName:'beaglebone'}
    },
    autoStart: false
  },

  /**
  * Rules: 
  */
  run: function(context) {
    var t = this,
        bb = t.monitors.bb,
        floatUp = bb.get('septicFloatUp') ? 1 : 0;

    // Turn on the septic pump if needed
    bb.set('septicPump', floatUp);
  }

});
