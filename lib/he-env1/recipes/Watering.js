// Recipe for turning on the water pump when needed
var Monitor = require('monitor'),
    _ = Monitor._,
    logger = Monitor.getLogger('Watering'),
    priorValues = {};

Monitor.RecipeProbe.extend({

  probeClass: 'Watering',
  defaults: {
    monitors: {
      he-env1: {probeName:'he-env1'}
    },
    autoStart: true
  },

  /**
  * Rules: 
  */
  run: function(context) {
    var t = this,
        bb = t.monitors.garage,
        floatUp = bb.get('septicFloatUp') ? 1 : 0;

    // Turn on the septic pump if needed
    bb.set('septicPump', floatUp);
  }

});
