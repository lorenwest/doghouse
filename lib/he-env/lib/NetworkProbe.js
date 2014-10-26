// NetworkProbe.js (c) 2010-2014 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://github.com/lorenwest/monitor-dashboard
(function(root){

  // Module loading - this runs server-side only
  var Monitor = root.Monitor || require('monitor'),
      DeviceProbe = Monitor.DeviceProbe;

  /**
  * This probe represents the private network
  *
  * It contains information about, and interfaces with the 
  * network router.
  *
  * @class NetworkProbe
  * @extends DeviceProbe
  * @constructor
  * @param [initParams] - Probe initialization parameters
  */
  var NetworkProbe = Monitor.NetworkProbe = DeviceProbe.extend({

    probeClass: 'NetworkProbe',

    /**
    * Constructor initialization.
    *
    * @method initialize
    */
    initialize: function(attributes, options){
      var t = this;

      DeviceProbe.prototype.initialize.apply(t, arguments);
    },

    // Called every polling interval
    poll: function() {
    }

  });

}(this));
