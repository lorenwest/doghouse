// DripWateringRecipe.js

(function(root){

  // Module loading - this runs server-side only
  var Monitor = root.Monitor || require('monitor'),
      _ = Monitor._,
      fs = require('fs'),
      RecipeProbe = Monitor.RecipeProbe,
      logger = Monitor.getLogger('DripWateringRecipe');

  // 6 second cycle minimum
  var MINIMUM_CYCLE_MINUTES = .1;
  var MINUTES_PER_DAY = 60 * 24;
  var SECONDS_PER_DAY = MINUTES_PER_DAY * 60;
  var MILLISECONDS_PER_MINUTE = 60000;
  var MILLISECONDS_PER_DAY = SECONDS_PER_DAY * 1000;
  var DISCONNECT_POLLING_INTERVAL = 5000;

  /**
   * Drip watering recipe
   *
   * This recipe manages a single drip watering device
   *
   * It controls a pump on/off attribute of a Device probe according
   * to the defined schedule.
   *
   * @class DripWateringRecipe
   * @extends RecipeProbe
   * @constructor
   * @param monitors {Object} - Named list of monitors to instantiate
   *   Key: monitor variable name, Value: Monitor model parameters
   *   This must include one with the key: waterPump, and that probe
   *   must have a pumpOn device attribute.
   * @param [setRuleOrder=3] {Number} - Order this recipe inserts setRules (3-10)
   * @param [autoStart=false] {boolean} - Call the start control on instantiation?
   * @param actions {Array of } - Is the recipe started and currently active?
   */
  var DripWateringRecipe = Monitor.DripWateringRecipe = RecipeProbe.extend({

    probeClass: 'DripWateringRecipe',
    writableAttributes: [],
    defaults: {
      setRuleOrder: 3,
      setRuleLabel: 'Drip watering scheduler',
      cyclesPerDay: 0,
      minutesPerCycle: 0,
      firstCycleMinutesAfterMidnight: 0,
      waterPumpMonitorName: 'waterPump',
      pumpOnAttrName: 'pumpOn',
      autoStart: true,
      started: false
    },

    // Constructor
    initialize: function(attributes, options) {
      var t = this;
      RecipeProbe.prototype.initialize.apply(t, arguments);
    },

    /**
     * Set my attribute rules into the device
     *
     * @method setDeviceRules
     * @param currentSchedule {Object} - Contains {value, expires}
     * @param callback(function(err))
     */
    setDeviceRules: function(currentSchedule, callback) {
      var t = this,
          monitor = t.monitors[t.get('waterPumpMonitorName')];

      if (!monitor || !monitor.isConnected()) {
        return callback({err: 'NOT_CONNECTED', msg: 'Not connected to the water pump monitor'});
      }

      monitor.control('setRule', {
        attrName: t.get('pumpOnAttrName'),
        rule: {
          name: t.get('probeName'),
          value: currentSchedule.value,
          order: t.get('setRuleOrder'),
          until: currentSchedule.expires,
          label: t.get('setRuleLabel')
        }
      }, callback);
    },

    /**
     * Clear my attribute rules from the device
     *
     * @method clearDeviceRules
     * @param callback(function(err))
     */
    clearDeviceRules: function(callback) {
      var t = this,
          monitor = t.monitors[t.get('waterPumpMonitorName')];

      if (!monitor || !monitor.isConnected()) {
        return callback({err: 'NOT_CONNECTED', msg: 'Not connected to the water pump monitor'});
      }

      monitor.control('clearRule', {
        attrName: t.get('pumpOnAttrName'),
        ruleName: t.get('probeName')
      }, callback);
    },

    /**
     * Get the scheduled value for now, and when it expires
     *
     * @method getScheduledValue()
     * @return {value: value, expires: expires}
     */
    getScheduledValue: function() {
      var t = this,
          now = Date.now(),
          cyclesPerDay = t.get('cyclesPerDay'),
          minutesPerCycle = t.get('minutesPerCycle'),
          msPerOnCycle = minutesPerCycle * MILLISECONDS_PER_MINUTE,
          firstCycleMinutesAfterMidnight = t.get('firstCycleMinutesAfterMidnight'),
          firstOnOffset = firstCycleMinutesAfterMidnight * MILLISECONDS_PER_MINUTE,
          msBetweenCycles = MILLISECONDS_PER_DAY / cyclesPerDay;

      // Compute and cache today's midnight and tomorrow's midnight
      if (!t.lastMidnight || now >= t.nextMidnight) {
        var d = new Date();
        d.setHours(0,0,0,0);
        t.lastMidnight = d.getTime();
        t.firstOnToday = t.lastMidnight + firstOnOffset;
        d.setHours(24,0,0,0);
        t.nextMidnight = d.getTime();
        t.firstOnTomorrow = t.nextMidnight + firstOnOffset;
      }
      var msPastMidnight = now - t.lastMidnight;

      // Exit early if we're before the first on today
      if (now < t.firstOnToday) {
        return {value:0, expires:t.firstOnToday};
      }

      /*
      1) Compute these items:
         a) lastOn
         b) lastOff
         c) nextOn
      2) If now < b, return 1, b
      3) otherwise, return 0, c
      */
      var lastOn, lastOff, nextOn;
      for (lastOn = t.firstOnToday; lastOn < t.nextMidnight; lastOn = nextOn) {
        nextOn = lastOn + msBetweenCycles;
        if (lastOn <= now && now < nextOn) {
          lastOff = lastOn + msPerOnCycle;
          if (nextOn > t.nextMidnight) {
            nextOn = t.firstOnTomorrow;
          }
          break;
        }
      }

      // In the current cycle (on)
      if (now < lastOff) {
        return {value:1, expires: lastOff};
      }

      // Past the current cycle (off)
      return {value:0, expires: nextOn};
    },

    /**
     * Persist the schedule
     *
     * @method persistSchedule()
     */
    persistSchedule: function(callback) {
      var t = this,
          probeName = t.get('probeName'),
          cyclesPerDay = t.get('cyclesPerDay'),
          minutesPerCycle = t.get('minutesPerCycle'),
          firstCycleMinutesAfterMidnight = t.get('firstCycleMinutesAfterMidnight')

      var filename = process.cwd() + '/config/' + local.json;
      fs.readFile(filename, function (error, file) {
        if (error) {
          return callback(error);
        }
        var local;
        file = file || '{}';
        try {
          local = JSON.parse(file);
        }
        catch (e) {
          return callback({msg: "Error parsing " + filename, file: file});
        }

        var monitor = local.Monitor = local.Monitor || {},
            autoStart = monitor.autoStart = monitor.autoStart || {},
            probeConfig = autoStart[probeName] = autoStart[probeName] || {},
            initParams = probeConfig.initParams = probeConfig.initParams || {};
        initParams.cyclesPerDay = cyclesPerDay;
        initParams.minutesPerCycle = minutesPerCycle;
        initParams.firstCycleMinutesAfterMidnight = firstCycleMinutesAfterMidnight;

        fs.writeFile(filename, JSON.stringify(local, null, 2), callback);
      });
    },

    /**
     * Change and persist the schedule parameters
     *
     * @method setSchedule_control
     * @param cyclesPerDay {Integer} Number of drip cycles per day
     * @param minutesPerCycle {Number} Number of minutes per drip cycle
     * @param firstCycleMinutesAfterMidnight {Integer} Number of minutes
     *        after midnight to start the first cycle of the day
     * @param callback {function(error)}
     */
    setSchedule_control: function(cyclesPerDay, minutesPerCycle, firstCycleMinutesAfterMidnight, callback) {
      var t = this;

      // Make sure numbers are reasonable
      if (cyclesPerDay <= 0) {
        cyclesPerDay = 0;
      }
      if (minutesPerCycle < MINIMUM_CYCLE_MINUTES) {
        minutesPerCycle = MINIMUM_CYCLE_MINUTES;
      }
      if (firstCycleMinutesAfterMidnight < 0) {
        firstCycleMinutesAfterMidnight = 0;
      }

      // Make sure there's enough time in the day for the number of cycles requested
      var totalOnMinutes = cyclesPerDay * minutesPerCycle;
      if (totalOnMinutes + firstCycleMinutesAfterMidnight > MINUTES_PER_DAY) {
        return callback({err:'BAD_SCHEDULE', msg:'Not enough time for this many cycles'});
      }

      // Set the new values, compute the new schedule, and run w/new schedule
      t.set({
        cyclesPerDay: cyclesPerDay,
        minutesPerCycle: minutesPerCycle,
        firstCycleMinutesAfterMidnight: firstCycleMinutesAfterMidnight
      });

      // Persist the new schedule and run it
      t.persistSchedule(function(error) {
        if (error) {
          return callback(error);
        }
        t.run_control({}, callback);
      });
    },

    /**
     * Find my rule for the specified attribute.
     *
     * TODO: Make this a static helper method in DeviceProbe.
     *
     * @method findRule
     * @param monitor {Monitor} the monitor to find the rule in
     * @param attrName {String} The attribute name the rule is for
     * @param ruleName {String} The rule name to find (my name for the rule)
     * @return rule {Object} The found rule object, or null if not found
     */
    findRule: function(monitor, attrName, ruleName) {

      var setRules = monitor.get('setRules');
      if (!setRules) {
        return null;
      }

      var attrRules = setRules[attrName];
      if (!attrRules) {
        return null;
      }

      var foundRule = null;
      for (var i = 0; i < attrRules.length; i++) {
        if (ruleName === attrRules[i].name) {
          fondRule = attrRules[i];
          break;
        }
      }
      return foundRule;
    },

    /**
     * Run the recipe
     *
     * This is called:
     *   * If the probe changes (defult for all recipes)
     *   * On the next scheduled change (a setTimeout managed by this recipe)
     *   * On monitor reconnect retry poll
     *
     * @method run_control
     */
    run_control: function(params, callback) {
      var t = this,
          monitor = t.monitors[t.get('waterPumpMonitorName')];

      // Prevent run recursion
      if (t.runningNow) {
        return callback();
      }
      t.runningNow = true;
      var myCallback = function(error) {
        t.runningNow = false;
        callback && callback(error);
      }

      // Cancel any prior timer
      if (t.timer) {
        clearTimeout(t.timer);
      }

      // Start retry polling if the monitor got disconnected
      if (!monitor.isConnected()) {
        monitor.connect();  // this shouldn't be necessary - monitors should auto-reconnect
        setTimeout(function() {
          t.run_control();
        }, DISCONNECT_POLLING_INTERVAL);
        error = {err: 'NOT_CONNECTED', msg: 'Not connected to the water pump monitor'};
        logger.error('run_control', error);
        return myCallback(error);
      }

      // Setup the timer for the next scheduled state change
      var scheduledValue = t.getScheduledValue();
      var hasSchedule = scheduledValue.expires !== null;
      if (hasSchedule) {
        var msUntilExpire = scheduledValue.expires - Date.now();
        t.timer = setTimeout(function() {
          t.run_control();
        }, msUntilExpire);
      }

      // See if we need to control the pump based on the current rule
      var rule = t.findRule(monitor, t.get('pumpOnAttrName'), t.get('probeName'));

      // Both sides clear
      if (!rule && !hasSchedule) {
        return myCallback();
      }

      // Rule needs clearing?
      if (!hasSchedule && rule) {
        return t.clearDeviceRules(myCallback);
      }

      // Rule needs setting?
      if (!rule || (scheduledValue.value != rule.value) || (scheduledValue.expires != rule.until)) {
        return t.setDeviceRules(scheduledValue, myCallback);
      }

      // No changes necessary
      return myCallback();
    }

  });


}(this));
