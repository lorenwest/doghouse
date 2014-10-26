$(document).ready(function() {

  var manualOverride = false;

  var waterPump = new Monitor({probeName:'wateringProbe'});
  waterPump.connect(function(error) {
    if (error) {
      setMessage("Server connection error: x339");
      return;
    }

    // Show on/off on change
    waterPump.on('change', setFormValues);
  });
  
  // Set the form values based on probe values
  function setFormValues() {
    var pumpOn = waterPump.get('pumpOn'),
        topRule = waterPump.get('setRules').pumpOn[0],
        pumpClass = ('.pump' + (pumpOn ? 'On' : 'Off'));

    // Module level
    manualOverride = topRule.name === 'manualOverride';

    // Show the pump on/off
    showPumpOn(pumpOn);
    setMessage(topRule.label);

    // Show manual/auto
    showAutoManual();
  }

  function setMessage(message) {
    $('.txtMessage').text(message);
  }

  function showAutoManual() {
    var isAuto = !manualOverride;
    $('.autoManual label').removeClass('active');
    $('.opt-' + (isAuto ? 'auto' : 'manual')).addClass('active');

    // Enable/disable on/off buttons, signal override in text box
    if (isAuto) {
      $('.pumpOnOff li').addClass('disabled');
      $('.txtMessage').removeClass('override');
    }
    else {
      $('.pumpOnOff li').removeClass('disabled');
      $('.txtMessage').addClass('override');
    }
  }

  function showPumpOn(isOn) {
    $('.pumpOnOff li').removeClass('active');
    $('.pump' + (isOn ? 'On' : 'Off')).addClass('active');
  }

  // Auto / Manual position
  $('.opt-auto').click(function() {
    waterPump.control('goAuto');
  });
  $('.opt-manual').click(function() {
    waterPump.control('goManual');
  });
  $(".pumpOn,.pumpOff").click(function(e) {
    if (manualOverride) {
      var args = {
        attrName: 'pumpOn',
        rule: {
          name: 'manualOverride',
          label: 'Manually overridden at ' + (new Date()),
          value: $(e.currentTarget).hasClass('pumpOn') ? 1 : 0
        }
      };
      waterPump.control('setRule', args);
    }
  });


});
