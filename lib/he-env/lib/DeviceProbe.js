// DeviceProbe.js (c) 2010-2014 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://github.com/lorenwest/monitor-dashboard
(function(root){

  // Module loading - this runs server-side only
  var Monitor = root.Monitor || require('monitor'),
      PollingProbe = Monitor.PollingProbe;

  /**
  * This probe is the base class for hardware device control
  *
  * @class DeviceProbe
  * @extends PollingProbe
  * @constructor
  * @param [initParams] - Probe initialization parameters
  *     @param [initParams.pollInterval] {Integer} Polling interval in 
  *            milliseconds. Default: null
  *     @param [initParams.cronPattern] {String} Crontab syle polling pattern. 
  *            Default once per second: "* * * * * *"
  *            The format is: 
  *     <i>[second] [minute] [hour] [day of month] [month] [day of week]</i>.<br>
  */
  var DeviceProbe = Monitor.DeviceProbe = PollingProbe.extend({

    probeClass: 'DeviceProbe',
    defaults: {},

    /**
    * Constructor initialization.
    *
    * @method initialize
    */
    initialize: function(attributes, options){
      var t = this;

      PollingProbe.prototype.initialize.apply(t, arguments);
    }

  });

}(this));
