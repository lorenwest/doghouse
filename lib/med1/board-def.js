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
        data0: 'P9_18',
        data1: 'P9_22',
        data2: 'P9_23',
        data3: 'P9_24',
        input: 'P9_40'
      },
      inputs: [
        // NOTE: I don't know why, but the chip seems to be off by 1 position,
        // where position #15 is first, followed by position 0, then 1, ...
        {name: 'input15', precision:0},
        {name: 'craftRoomThermistor', precision:0},
        {name: 'upstairsThermistor', precision:0},
        {name: 'homeThermostat', precision:0},
        {name: 'dhwWaterFlow', precision:0},
        {name: 'aptBoilerCalling', precision:0},
        {name: 'waterLeakDetector', precision:0},
        {name: 'dhwRadiantValve', precision:0}
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
