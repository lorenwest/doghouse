module.exports = {
  Monitor: {

    appName: 'he-env',
    allowExternalConnections: true,

    // Auto start some monitors
    autoStart: {

      // This beaglebone
      localBB: {probeName: 'beaglebone', probeClass: 'BeagleBone', initParams:{
        emulationMode: true,
        pins: [
          {id:'P9_11', name:'waterPump', direction:'out', value:0}
        ]
      }},

      wateringProbe: {
        probeName: 'wateringProbe',
        probeClass: 'WateringProbe'
      },
      dripWateringRecipe: {
        probeName: 'dripWateringRecipe',
        probeClass: 'DripWateringRecipe',
        initParams: {
          monitors: {
            waterPump: {
              probeName: 'wateringProbe'
            }
          },
          setRuleOrder: 3,
          cyclesPerDay: 4,
          minutesPerCycle: 6,
          firstCycleMinutesAfterMidnight: 60
        }
      }
    },

    // Configure the built-in console log output
    consoleLogListener: {
      // pattern: "{debug,trace,warn,error,fatal}.*"
      pattern: "*"
    }
  }
}
