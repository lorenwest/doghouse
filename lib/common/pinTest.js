#! /usr/bin/node

var b = require('bonescript');
var bb = require('../common/bb');

// Try all pins
var pins = [
  {name: 'P9_11', direction: b.OUTPUT},
  {name: 'P9_12', direction: b.OUTPUT},
  {name: 'P9_13', direction: b.OUTPUT},
  {name: 'P9_14', direction: b.OUTPUT},
  {name: 'P9_15', direction: b.OUTPUT},
  {name: 'P9_16', direction: b.OUTPUT},
  {name: 'P9_17', direction: b.OUTPUT},
  {name: 'P9_18', direction: b.OUTPUT},
  // {name: 'P9_19', direction: b.OUTPUT}, // Output doesn't work
  // {name: 'P9_20', direction: b.OUTPUT}, // Output doesn't work
  {name: 'P9_21', direction: b.OUTPUT},
  {name: 'P9_22', direction: b.OUTPUT},
  {name: 'P9_23', direction: b.OUTPUT},
  {name: 'P9_24', direction: b.OUTPUT},
  // {name: 'P9_25', direction: b.OUTPUT},
  {name: 'P9_26', direction: b.OUTPUT},
  {name: 'P9_27', direction: b.OUTPUT},
  // {name: 'P9_28', direction: b.OUTPUT},
  // {name: 'P9_29', direction: b.OUTPUT},
  {name: 'P9_30', direction: b.OUTPUT},
  // {name: 'P9_31', direction: b.OUTPUT}
];

pins = [
  // {name: 'P8_3', direction: b.OUTPUT},
  // {name: 'P8_4', direction: b.OUTPUT},
  // {name: 'P8_5', direction: b.OUTPUT},
  // {name: 'P8_6', direction: b.OUTPUT},
  // {name: 'P8_7', direction: b.OUTPUT},
  // {name: 'P8_8', direction: b.OUTPUT},
  {name: 'P8_9', direction: b.OUTPUT},
  {name: 'P8_10', direction: b.OUTPUT},
  {name: 'P8_11', direction: b.OUTPUT},  // Used by eMMC flash memory card
  {name: 'P8_12', direction: b.OUTPUT},  // Used by eMMC flash memory card
  {name: 'P8_13', direction: b.OUTPUT},  // Used by eMMC flash memory card
  {name: 'P8_14', direction: b.OUTPUT},  // Used by eMMC flash memory card
  {name: 'P8_15', direction: b.OUTPUT},  // Used by eMMC flash memory card
  {name: 'P8_16', direction: b.OUTPUT},  // Used by eMMC flash memory card
  {name: 'P8_17', direction: b.OUTPUT},  // Used by eMMC flash memory card
  {name: 'P8_18', direction: b.OUTPUT},  // Used by eMMC flash memory card
  {name: 'P8_19', direction: b.OUTPUT},  // Used by eMMC flash memory card
  // {name: 'P8_20', direction: b.OUTPUT},  // Used by eMMC flash memory card
  // {name: 'P8_21', direction: b.OUTPUT},  // Used by eMMC flash memory card
  // {name: 'P8_22', direction: b.OUTPUT},
  // {name: 'P8_23', direction: b.OUTPUT},
  // {name: 'P8_24', direction: b.OUTPUT},
  // {name: 'P8_25', direction: b.OUTPUT},
  {name: 'P8_26', direction: b.OUTPUT},
  // {name: 'P8_27', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_28', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_29', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_30', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_31', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_32', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_33', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_34', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_35', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_36', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_37', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_38', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_39', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_40', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_41', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_42', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_43', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_44', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_45', direction: b.OUTPUT},  // Used by HDMI
  // {name: 'P8_46', direction: b.OUTPUT}   // Used by HDMI
];

/*
bspm_P8_3_17: Error: EEXIST, file already exists
bspm_P8_4_17: Error: EEXIST, file already exists
bspm_P8_5_17: Error: EEXIST, file already exists
bspm_P8_6_17: Error: EEXIST, file already exists
bspm_P8_20_17: Error: EEXIST, file already exists
bspm_P8_21_17: Error: EEXIST, file already exists
bspm_P8_22_17: Error: EEXIST, file already exists
bspm_P8_23_17: Error: EEXIST, file already exists
bspm_P8_24_17: Error: EEXIST, file already exists
bspm_P8_25_17: Error: EEXIST, file already exists
bspm_P8_27_17: Error: EEXIST, file already exists
bspm_P8_28_17: Error: EEXIST, file already exists
bspm_P8_29_17: Error: EEXIST, file already exists
bspm_P8_30_17: Error: EEXIST, file already exists
bspm_P8_31_17: Error: EEXIST, file already exists
bspm_P8_32_17: Error: EEXIST, file already exists
bspm_P8_33_17: Error: EEXIST, file already exists
bspm_P8_34_17: Error: EEXIST, file already exists
bspm_P8_35_17: Error: EEXIST, file already exists
bspm_P8_36_17: Error: EEXIST, file already exists
bspm_P8_37_17: Error: EEXIST, file already exists
bspm_P8_38_17: Error: EEXIST, file already exists
bspm_P8_39_17: Error: EEXIST, file already exists
bspm_P8_40_17: Error: EEXIST, file already exists
bspm_P8_41_17: Error: EEXIST, file already exists
bspm_P8_42_17: Error: EEXIST, file already exists
bspm_P8_43_17: Error: EEXIST, file already exists
bspm_P8_44_17: Error: EEXIST, file already exists
bspm_P8_45_17: Error: EEXIST, file already exists
bspm_P8_46_17: Error: EEXIST, file already exists
*/

// Initialize all of 'em
bb.initGPIO(pins, function(err) {

  if(err) {
    return console.error('Init ERROR: ', err);
  }

  console.log("Initialized pins");

  var isOn = false;
  setInterval(function(){
    isOn = !isOn;
    for (var i = 0; i < pins.length; i++) {
      b.digitalWrite(pins[i].name, isOn ? b.HIGH : b.LOW);
    }
  }, 1000);

});
