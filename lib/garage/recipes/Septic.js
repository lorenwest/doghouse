// Recipe for turning on the septic pump when the level is high
var Monitor = require('monitor'),
    _ = Monitor._,
    logger = Monitor.getLogger('Septic'),
    priorValues = {};

Monitor.RecipeProbe.extend({

  probeClass: 'Septic',
  defaults: {
    monitors: {
      garage: {probeName:'bb-garage'}
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
