// Default configurations.
module.exports = {
  Monitor: {
    appName: 'Benchtest',
    allowExternalConnections: true,
    consoleLogListener: {
      pattern: "{info,trace,warn,error,fatal}.*"
    }
  },
  BeagleBone: {
    pins: [
      {name:'userLED0', id:'USR0', type:'gpio', direction:'out', value:0},
      {name:'userLED1', id:'USR1', type:'gpio', direction:'out', value:1},
      {name:'userLED2', id:'USR2', type:'gpio', direction:'out', value:0},
      {name:'userLED3', id:'USR3', type:'gpio', direction:'out', value:1}
    ]
  }
}
