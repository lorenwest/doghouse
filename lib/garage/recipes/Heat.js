// Recipe for turning on the heat
var Monitor = require('monitor'),
    _ = Monitor._,
    logger = Monitor.getLogger('Heat'),
    priorValues = {};

Monitor.RecipeProbe.extend({

  probeClass: 'Heat',
  defaults: {
    monitors: {
      garage: {probeName:'bb-garage'}
    },
    autoStart: true
  },

  /**
  * Rules: 
  *
  *  - Every time the BB monitor changes, print out those changes
  */
  run: function(context) {
    var t = this,
        bb = t.monitors.garage,
        thermostat = bb.get('apartmentThermostatOn') ? 1 : 0;

    // Call for heat if needed (relays - inverse)
    bb.set('radiantCallForHeat', thermostat ? 0 : 1);
  }

});
