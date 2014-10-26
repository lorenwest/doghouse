// WateringProbe.js (c) 2010-2014 Loren West and other contributors
// May be freely distributed under the MIT license.
// For further details and documentation:
// http://github.com/lorenwest/monitor-dashboard
(function(root){

  // Module loading - this runs server-side only
  var Monitor = root.Monitor || require('monitor'),
      logger = Monitor.getLogger('WateringProbe'),
      _ = Monitor._,
      deepCopy = function(obj) {return JSON.parse(JSON.stringify(obj))},
      fs = require('fs'),
      path = require('path'),
      NOP = function(){},
      Probe = Monitor.Probe;

  // Map of known setRule names to their corresponding rule order
  var RULE_ORDER = {
    failsafeHard: 10,   // Set by failsafe recipes, disregard manual override
    manualOverride: 9,  // Set by the user
    failsafeSoft: 8,    // Set by failsafe recipes, honor manual overrides
    // ... 3-7 are for custom code and/or recipes
    fallback: 2,        // User configured hardware default override
    hardwareDefault: 1  // Hardware default (actually, stored in software)
  };

  /**
  * This probe represents a watering device
  *
  * * One probe represents the device to the component view
  * * One to many probes for each hardware component
  *   (beaglebone direct, InputProbe, OutputProbe, etc)
  *
  * This probe has a default state described in Monitor.autoStart
  * configurations that are overwritten with state stored on the
  * filesystem under ${cwd}/site_db/probes/{probeName}.json
  *
  * @class WateringProbe
  * @extends DeviceProbe
  * @constructor
  * @param [initParams] - Probe initialization parameters
  */
  var WateringProbe = Monitor.WateringProbe = Probe.extend({

    probeClass: 'WateringProbe',
    // probeClass: 'wd-drip210a',

    // Definition for the DeviceProbe
    deviceDef: {
      attributes: {
        pumpOn: {
          probeName: 'bb',      // Required
          probeAttr: 'pumpOn',  // Optional
          settable: true,       // Optional
          hardwareDefault: 0    // Required
        }
      }
    },

    /**
    * Constructor initialization.
    *
    * @method initialize
    */
    initialize: function(attributes, options) {
      var t = this,
          probeName = t.get('probeName');

      // Assume callback responsibility.
      options.asyncInit = true;
      var callback = options.callback;

      if (!probeName) {
        logger.error('initialize.noProbeName', 'Device probes must be instantiated with a name');
        return callback('NoProbeName');
      }
      t.filename = path.join(
        process.cwd(),
        'site_db/probes',
        probeName + '.json'
      );

      t.load(function(error) {
        if (error) {
          return callback(error);
        }
        t.processRules(callback);
      });
    },

    // This creates the initial data model from the definition
    setupModel: function() {
      var t = this,
          model = {},
          setRules = {};

      // Create the initial model attrs and setRules for settable attrs
      for (var attrName in t.deviceDef.attributes) {
        var attrDef = t.deviceDef.attributes[attrName];

        // Create the initial model element
        model[attrName] = attrDef.hardwareDefault;

        // Build the setRules for settable attributes
        if (attrDef.settable) {
          setRules[attrName] = [{
            name: 'hardwareDefault',
            label: 'Hardware default value',
            order: RULE_ORDER['hardwareDefault'],
            value: attrDef.hardwareDefault,
            setAt: Date.now()
          }];
        }
      }

      // Set the initial data model
      model.setRules = setRules;
      model.meta = {};
      t.set(model);
    },

    // This loads the model from disk
    load: function(callback) {
      var t = this;
      fs.readFile(t.filename, function(error, model) {
        if (error && error.code === 'ENOENT') {
          model = t.setupModel();
          return t.save(callback);
        }
        else if (error) {
          return callback(error);
        }
        model = model || {};
        try {
          model = JSON.parse(model);
        } catch(e) {
          var err = {code:'JSONParse', msg: 'Error parsing ' + t.filename};
          logger.error('load.json', err);
          return callback(err);
        }
        t.set(model);
        callback(null);
      });
    },

    save: function(callback) {
      var t = this,
          parentDir = path.dirname(t.filename);

      Monitor.FileProbe.mkdir_r(parentDir, function(error) {
        if (error) {
          var err = {code:error.code, msg: 'Error making dir ' + parentDir};
          logger.error('save.mkdir', err);
          return callback(err);
        }

        var fileContents = JSON.stringify(t, null, 2);
        fs.writeFile(t.filename, fileContents, function (error) {
          if (error) {
            var err = {code:error.code, msg: 'Error writing ' + t.filename};
            logger.error('save.writeFile', err);
            return callback(err);
          }
          callback(null);
        });
      });
    },

    // Move all attributes into manual override
    goManual_control: function(args, callback) {
      var t = this,
          manualOverride = 'manualOverride',
          setRules = t.get('setRules');

      for (var attrName in setRules) {
        var attrRules = setRules[attrName];

        // Remove prior rule for this name
        attrRules = _.reject(attrRules, function(attrRule) {
          return attrRule.name === manualOverride;
        });

        // Set some defaults
        var rule = {
          name: manualOverride,
          label: 'Manual override',
          value: attrRules[0].value,
          order: RULE_ORDER[manualOverride],
          setAt: Date.now()
        };

        // Add to this set, and sort by order number (descending)
        attrRules.push(rule);
        setRules[attrName] = _.sortBy(attrRules, function(rule) {
          return rule.order * -1;
        });
      }

      // Update the probe
      t.set('setRules', deepCopy(setRules));

      // Persist the new rules
      t.save(function(error) {
        if (error) {
          return callback(error);
        }
        t.processRules(callback);
      });
    },

    // Clear all manual overrides
    goAuto_control: function(args, callback) {
      var t = this,
          manualOverride = 'manualOverride',
          setRules = t.get('setRules');

      for (var attrName in setRules) {
        var attrRules = setRules[attrName];

        // Remove prior rule for this name
        setRules[attrName] = _.reject(attrRules, function(attrRule) {
          return attrRule.name === manualOverride;
        });
      }

      // Update the probe
      t.set('setRules', deepCopy(setRules));

      // Persist the new rules
      t.save(function(error) {
        if (error) {
          return callback(error);
        }
        t.processRules(callback);
      });
    },

    /**
    * Add or update a setRule for an attribute
    *
    * @method setRule
    * @param args {object} The following:
    *     @param args.attrName {String} The attribute that this rule applies to
    *     @param args.rule {Object} The rule to set
    *         @param args.rule.name {String} The rule name (used as a unique key) - recipe name or known key
    *         @param args.rule.value {Mixed} Value to set the attribute to
    *         @param args.rule.order {Integer} Higher value = higher precedence
    *         @param args.rule.until {Integer} Timestamp that this rule expires
    *         @param args.rule.label {String} User facing explanation of this rule
    */
    setRule_control: function(args, callback) {
      var t = this,
          callback = callback || NOP,
          attrName = args.attrName,
          rule = args.rule,
          setRules = t.get('setRules'),
          attrRules = setRules[attrName];

      // TODO: Validate the input:
      // Validate that the rule object exists
      // * Order cannot be < 2 or > 10
      // * If order = 1, make sure its name is hardwareDefault
      // * If order = 2, make sure its name is fallback
      // * If order = 3-7 its name can be anyone (usually a recipe name)
      // * If order = 8, make sure its name is failSafeSoft
      // * If order = 9, make sure its name is manualOverride
      // * If order = 10, make sure its name is failSafeHard
      // Make sure a label exists
      // Make sure until is an integer or null

      // Validate the attribute exists
      if (!attrRules) {
        var err = {code:'NOTFOUND', msg:'Unknown attribute: ' + attrName};
        logger.warn('setRule.notfound', err);
        return callback(err);
      }

      // Remove prior rule for this name
      attrRules = _.reject(attrRules, function(attrRule) {
        return attrRule.name === rule.name;
      });

      // Set some defaults
      rule.setAt = Date.now();
      if (RULE_ORDER[rule.name] !== undefined) {
        rule.order = RULE_ORDER[rule.name];
      }

      // Add to this set, and sort by order number (descending)
      attrRules.push(rule);
      setRules[attrName] = _.sortBy(attrRules, function(rule) {
        return rule.order * -1;
      });

      // Update the probe
      t.set('setRules', deepCopy(setRules));

      // Persist the new rules
      t.save(function(error) {
        if (error) {
          return callback(error);
        }
        t.processRules(callback);
      });
    },

    /**
    * Clear the specified rule, by name
    *
    * @method clearRule
    * @param args {object} Calling arguments:
    *     @param args.attrName {String} Name of the attribute
    *     @param args.ruleName {String} Clear the rule with this name
    * @param callback {function(error)}
    */
    clearRule_control: function(args, callback) {
      var t = this,
          callback = callback || NOP,
          attrName = args.attrName,
          ruleName = args.ruleName,
          setRules = t.get('setRules'),
          attrRules = setRules[attrName];

      // Validate the attribute exists
      if (!attrRules) {
        var err = {code:'NOTFOUND', msg:'Unknown attribute: ' + attrName};
        logger.warn('clearRule.notfound', err);
        return callback(err);
      }

      // Clear the rule by name and save
      setRules[attrName] = _.reject(attrRules, function(rule) {
        return rule.name === ruleName;
      });
      t.set('setRules', deepCopy(setRules));

      // Persist the new rules
      t.save(function(error) {
          if (error) {
              return callback(error);
          }
          t.processRules(callback);
      });
    },

    /**
    * Process rules, removing outdated rules and setting probe values
    *
    * @method processRules
    * @param callback {function(error)}
    */
    processRules: function(callback) {
      var t = this,
          setRules = t.get('setRules'),
          now = Date.now(),
          needsSet = false,
          rulesChanged = false,
          newValues = {};

      // Process each attribute
      for (var attrName in setRules) {
        var rules = setRules[attrName];

        // Remove any out of date entries
        setRules[attrName] = _.reject(rules, function(val) {
          if (val.until > 0 && val.until < now) {
            rulesChanged = true;
            return true;
          }
          return false;
        });

        // Make sure the top rule value matches the data model value
        var value = rules[0].value;
        if (value !== t.get(attrName)) {
          needsSet = true;
          newValues[attrName] = rules[0].value;
        }
      }

      // Set new values if changed
      if (needsSet) {
        t.set(newValues);
      }

      // Persist to the FS if rules changed
      if (rulesChanged) {
        return t.save(callback);
      }
      return callback(null);
    },

    /**
    * Associate metadata with the device
    *
    * Metadata is name/value information that monitors and other
    * probes can attach to, and persist with the device.
    *
    * @method setMeta
    * @param args {object}
    *     @param args.metaName {String} Name of the metadata 
    *     @param args.metaValue {Mixed} Any value to associate
    * @param callback {Function(error)}
    */
    setMeta_control: function(metaName, metaValue, callback) {
      var t = this,
          metaName = args.metaName,
          metaValue = args.metaValue;
      
      callback = callback || NOP;
      t.device.meta[metaName] = metaValue;
      return t.save(callback);
    },

    // Called on every polling interval
    poll: function() {
    }

  });

}(this));
