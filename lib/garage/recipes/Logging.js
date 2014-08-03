// Recipe for outputting logs when the BB changes
var Monitor = require('monitor'),
    _ = Monitor._,
    logger = Monitor.getLogger('logging'),
    priorValues = {};

Monitor.RecipeProbe.extend({

  probeClass: 'Logging',
  defaults: {
    monitors: {
      med1: {probeName:'bb-garage'}
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
        med1 = t.monitors.med1,
        probeAttrs = med1.toProbeJSON(),
        changed = {};

    // Get the changed attributes
    for (var attrName in probeAttrs) {
      if (probeAttrs[attrName] !== priorValues[attrName]) {
        changed[attrName] = probeAttrs[attrName];
      }
    }

    // Print changes and record
    if (_.size(changed)) {
      console.log('changed', JSON.stringify(changed));
      _.extend(priorValues, changed);
    }
  }

});
