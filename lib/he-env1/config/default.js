module.exports = {
  Monitor: {

    appName: 'he-env1',
    allowExternalConnections: true,

    // Auto start some monitors
    autoStart: {

      // This beaglebone
      localBB: {probeName: 'beaglebone', probeClass: 'BeagleBone', initParams:{
        emulationMode: false,
        pins: [
          {id:'P9_11', name:'waterPump', direction:'out', value:0}
        ]
      }},

      // Recipe probes
      watering: {probeClass: 'Watering'}
    },

    // Configure the built-in console log output
    consoleLogListener: {
      pattern: "{debug,trace,warn,error,fatal}.*"
      // pattern: "*"
    }
  }
}
