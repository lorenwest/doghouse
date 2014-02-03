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
        {name: 'craftRoomThermistor', precision:.01},
        {name: 'upstairsThermistor', precision:.01},
        {name: 'homeThermostat', precision:1},
        {name: 'dhwWaterFlow', precision:1},
        {name: 'aptBoilerCalling', precision:1},
        {name: 'waterLeakDetector', precision:.01},
        {name: 'dhwRadiantValve', precision:1}
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
        {name: 'unused2', inverse:true},
        {name: 'unused1', inverse:true},
        {name: 'callForDhwOn', inverse:true},
        {name: 'callForRadiantOn', inverse:true},
        {name: 'dhwRadiantValveRadiant', inverse:true},
        {name: 'homeRadiantPumpOn', inverse:true},
        {name: 'homeRadiantValveOff', inverse:true},
        {name: 'aptRadiantValveOn', inverse:true},
        // {name: 'dhwCirculationPumpOn'}
      ]
    }
  })

}
