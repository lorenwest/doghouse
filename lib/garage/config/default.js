module.exports = {
  Monitor: {

    appName: 'bb-garage',
    allowExternalConnections: true,

    // Auto start some monitors
    autoStart: {

      // This beaglebone
      localBB: {probeName: 'bb-garage', probeClass: 'BeagleBone', initParams:{
        emulationMode: false,
        pins: [
          {id:'P9_39', name:'boardThermostat', direction:'in',
            precision:2, pollMs: 5000},
          {id:'P9_30', name:'solarPulse',
              direction:'in', interrupt:true},
          {id:'P9_27', name:'dhwPump',
            direction:'out', value: 0},
          {id:'P9_26', name:'septicPump',
            direction:'out', value: 0}
        ]
      }},

      // Input board
      input1: {probeName: 'input1', probeClass: 'InputBoard', initParams:{
        bbProbeName: 'bb-garage',
        pins: {
          data0:'P9_21',
          data1:'P9_22',
          data2:'P9_23',
          data3:'P9_24',
          input: 'P9_40'
        },
        inputs: [
          {name:'sideDoorClosed', precision:2},
          {name:'garageDoorClosed', precision:2},
          {name:'inverterError', precision:2},
          {name:'apartmentThermostatOn', precision:0},
          {name:'septicFloatUp', precision:2},
          {name:'dhwTemperature', precision:2},
          {name:'radiantInTemperature', precision:2},
          {name:'radiantOutTemperature', precision:2}
        ],
        pollMs: 1000
      }},

      // Output board - Relays
      output1: {probeName: 'relays', probeClass: 'OutputBoard', initParams:{
        bbProbeName: 'bb-garage',
        pins: {
          data:'P9_11',
          clock:'P9_12',
          latch:'P9_13',
          enable:'P9_14'
        },
        outputs: [
          {name:'sideDoorLatch', inverse:true, initialValue: 1},
          {name:'garageDoorButton', inverse:true, initialValue: 0},
          {name:'radiantCallForHeat', inverse:true, initialValue: 0},
          {name:'unused', inverse:true, initialValue: 0}
        ]
      }},

      // Output board - Sprinklers
      output2: {probeName: 'sprinklers', probeClass: 'OutputBoard', initParams:{
        bbProbeName: 'bb-garage',
        pins: {
          data:'P8_11',
          clock:'P8_13',
          latch:'P8_15',
          enable:'P8_17'
        },
        outputs: [
          {name:'vegetableGarden', inverse:true, initialValue: 0},
          {name:'neFenceGarden', inverse:true, initialValue: 0},
          {name:'eEntrywayGarden', inverse:true, initialValue: 0},
          {name:'nwFenceGarden', inverse:true, initialValue: 0},
          {name:'eHouseGarden', inverse:true, initialValue: 0},
          {name:'sLawn', inverse:true, initialValue: 0},
          {name:'wLawnEast', inverse:true, initialValue: 0},
          {name:'wLawnWest', inverse:true, initialValue: 0}
        ]
      }},

      // Recipe probes
      // watering: {probeClass: 'Watering'},
      logging: {probeClass: 'Logging'}
    },

    // Configure the built-in console log output
    consoleLogListener: {
      pattern: "{debug,trace,warn,error,fatal}.*"
      // pattern: "*"
    }
  }
}
