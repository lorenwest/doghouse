// Schedule.js (c) 2014 Highend Environments
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://github.com/he-env/open-env
(function(root){

  // Module loading - this runs server-side only
  var Monitor = root.Monitor || require('monitor'),
      Backbone = Monitor.Backbone;

  /**
  * This probe is the base class for hardware device control
  *
  * @class Schedule
  * @extends Backbone.Model
  * @constructor
  * @param attrs {Object) - Data model attributes
  *     @param [attrs....
  */
  var Schedule = Monitor.Schedule = Backbone.Model.extend({

    /**
    * Constructor initialization.
    *
    * @method initialize
    */
    initialize: function(attributes, options){
      var t = this;
    }

  });

}(this));
