// Recipe for monitoring the board temperature

var Monitor = require('monitor'),
    logger = Monitor.getLogger('BoardTemp');

Monitor.RecipeProbe.extend({

  probeClass: 'BoardTemp',
  defaults: {
    monitors: {
      med1: {probeName:'bb-med1'}
    },
    autoStart: true
  },

  run: function(context) {
    var t = this,
        med1 = context.med1;

    //console.log('BoardTemp running');
  },

  computeTemp: function(context) {
  }

});
