// Define the board
var board = module.exports = {

  /*
  beagleBone: new Monitor({
    probeClass:'BeagleBone', 
    initParams:{}
  }),
  */

  inputBoard: new Monitor({
    probeClass:'InputBoard', 
    initParams:{
      pins: {
        data0: 'P9_21',
        data1: 'P9_22',
        data2: 'P9_23',
        data3: 'P9_24',
        input: 'P9_40'
      },
      inputs: [
        {name: 'craftRoomThermistor', precision:.001},
        {name: 'upstairsThermistor', precision:.001},
        {name: 'homeThermostat', precision:.001},
        {name: 'dhwWaterFlow', precision:.001},
        {name: 'aptBoilerCalling', precision:.001},
        {name: 'waterLeakDetector', precision:.001},
        {name: 'dhwRadiantValve', precision:.001}
      ]
    }
  }),

  outputBoard: new Monitor({
    probeClass:'OutputBoard', 
    initParams:{
      pins: {
        data:  'P8_10',
        clock: 'P8_12',
        latch: 'P8_14',
        enable:'P8_16'
      },
      outputs: [
        {name: 'unused2', inverse:true, initialValue:0},
        {name: 'unused1', inverse:true, initialValue:0},
        {name: 'callForDhwOn', inverse:true, initialValue:0},
        {name: 'callForRadiantOn', inverse:true, initialValue:0},
        {name: 'dhwRadiantValveRadiant', inverse:true, initialValue:0},
        {name: 'homeRadiantPumpOn', inverse:true, initialValue:0},
        {name: 'homeRadiantValveOff', inverse:true, initialValue:0},
        {name: 'aptRadiantValveOn', inverse:true, initialValue:0},
        // {name: 'dhwCirculationPumpOn'}
      ]
    }
  })

}
