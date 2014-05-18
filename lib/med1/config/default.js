module.exports = {
  Monitor: {

    appName: 'med1',
    allowExternalConnections: true,

    // Auto start some monitors
    autoStart: {

      // This beaglebone
      localBB: {probeName: 'bb-med1', probeClass: 'BeagleBone', initParams:{
        pins: [
          {id:'P9_39', name:'boardThermostat', direction:'in',
           precision:2, pollMs: 1000},
          {id:'P9_17', name:'med2Reset', direction:'out', value:0}
        ]
      }},

      /*
      // Rescue board (secondary BB)
      rescueBB: {hostName: 'bb-med2', probeName: 'bb-med2'},
      */

      /*
      // Input board 1 - close to the BB
      input1: {probeName: 'input1', probeClass: 'InputBoard', initParams:{
        bbProbeName: 'bb-med1',
        pins: {
          data0:'P9_11',
          data1:'P9_12',
          data2:'P9_13',
          data3:'P9_14',
          input: 'P9_40'
        },
        inputs: [
          // Switches
          {name:'lights1_1_switch', precision:2},
          {name:'lights1_2_switch', precision:2},
          {name:'circFan1_switch', precision:2},
          {name:'exhFan1_switch', precision:2},
          {name:'lights2_1_switch', precision:2},
          {name:'lights2_2_switch', precision:2},
          {name:'circFan2_switch', precision:2},
          {name:'exhFan2_switch', precision:2},
          {name:'lightFan_switch', precision:2},
          {name:'co2_switch', precision:2},
          {name:'waterPump_switch', precision:2},
          {name:'freshWater_switch', precision:2},

          // Security
          {name:'entryDoorOpen', precision:0},
          {name:'outsidePeopleMonitor', precision:2},
          {name:'insidePeopleMonitor', precision:2},
        ],
        pollMs: 1000
      }},
      */

      /*
      // Input 2 - Middle board
      input2: {probeName: 'input2', probeClass: 'InputBoard', initParams:{
        bbProbeName: 'bb-med1',
        pins: {
          data0:'P9_21',
          data1:'P9_22',
          data2:'P9_23',
          data3:'P9_24',
          input: 'P9_37'
        },
        inputs: [
          // Room 1
          {name:'room1Thermostat', precision:2},
          {name:'room1Humidity', precision:2},
          {name:'room1Co2Sensor', precision:2},
          {name:'lights1_1Sensor', precision:2},
          {name:'lights1_2Sensor', precision:2},

          // Room 2
          {name:'room2Thermostat', precision:2},
          {name:'room2Humidity', precision:2},
          {name:'room2Co2Sensor', precision:2},
          {name:'lights2_1Sensor', precision:2},
          {name:'lights2_2Sensor', precision:2},

          // Water
          {name:'waterAtLevel1', precision:2},
          {name:'waterAtLevel2', precision:2},
          {name:'waterAtLevel3', precision:2},
          {name:'waterPhValue', precision:2},
        ],
        pollMs: 1000
      }},
*/

      // Output board - far left
      output1: {probeName: 'output1', probeClass: 'OutputBoard', initParams:{
        bbProbeName: 'bb-med1',
        pins: {
          data:'P8_10',
          clock:'P8_12',
          latch:'P8_14',
          enable:'P8_16'
        },
        outputs: [
          {name:'lights1_1'},
          {name:'lights1_2'},
          {name:'circFan1'},
          {name:'exhFan1'},
          {name:'lights2_1'},
          {name:'lights2_2'},
          {name:'circFan2'},
          {name:'exhFan2'},
          {name:'lightFan'},
          {name:'co2'},
          {name:'waterPump'},
          {name:'freshWater'}
        ]
      }},

      // Recipe probes
      //boardTemp: {probeClass: 'BoardTemp'},
      lighting: {probeClass: 'Lighting'}
    },

    // Configure the built-in console log output
    consoleLogListener: {
      pattern: "{debug,trace,warn,error,fatal}.*"
    }
  }
}
