// Default configurations.
module.exports = {
  Monitor: {
    appName: 'Benchtest',
    allowExternalConnections: true,
    consoleLogListener: {
      pattern: "{info,debug,trace,warn,error,fatal}.*"
    }
  },
  BeagleBone: {
    pins: [
      {name:'userLED0', bbName:'USR0', type:'gpio', direction:'out', value:1},
      {name:'userLED1', bbName:'USR1', type:'gpio', direction:'out', value:0},
      {name:'userLED2', bbName:'USR2', type:'gpio', direction:'out', value:0},
      {name:'userLED3', bbName:'USR3', type:'gpio', direction:'out', value:1}
    ]
  }
}
