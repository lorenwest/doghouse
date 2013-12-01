// This is run when the app is loaded from monitor-dashboard
(function(root){

  // Create a server, and expose this directory
  var Monitor = require('monitor'),
      Connect = require('connect'),
      FS = require('fs'),
      Path = require('path'),
      Static = Connect['static'](__dirname);

  // Load all probes found in the ./probe directory
  // This is synchronous because require() is synchronous
  FS.readdirSync(Path.join(__dirname, 'probe')).forEach(function(fileName) {
    if (fileName.substr(-3) === '.js') {
      require('./probe/' + fileName);
    }
  });

  // Export a middleware component
  var app = module.exports = function(request, response, next) {

    // Process dynamic app endpoints here
    if (request.url === '/status') {
      response.writeHead(200, {'Content-Type': 'text/plan'});
      return response.end('ok');
    }

    // Forward to the static endpoint, then to the next step
    // if the file isn't there.  The next step is a monitor page.
    return Static(request, response, next);
  }

  // Testing - create a test IO board
  global.testBoard = new Monitor({probeClass:'RemoteIOBoard', initParams:{
    sleepMs: 1000,
    pins: {
      data: 'P9_11',
      clock: 'P9_12',
      latch: 'P9_13',
      input: 'P9_14'
    },
    inputs: [
      {name: 'i0'},
      {name: 'i1'},
      {name: 'i2'},
      {name: 'i3'},
      {name: 'i4'},
      {name: 'i5'},
      {name: 'i6'},
      {name: 'i7'},
      {name: 'i8'},
      {name: 'i9'},
      {name: 'i10'},
      {name: 'i11'},
      {name: 'i12'},
      {name: 'i13'},
      {name: 'i14'},
      {name: 'i15'}
    ],
    inputSwitchPosition: 8,
    outputs: [
      {name: 'i0'},
      {name: 'i1', initialValue: 1},
      {name: 'i2'},
      {name: 'i3', initialValue: 1},
      {name: 'i4'},
      {name: 'i5', initialValue: 1},
      {name: 'i6'},
      {name: 'i7', initialValue: 1},
      {name: 'i8'},
      {name: 'i9', initialValue: 1},
      {name: 'i10'},
      {name: 'i11', initialValue: 1},
      {name: 'i12'},
      {name: 'i13', initialValue: 1},
      {name: 'i14'},
      {name: 'i15', initialValue: 1}
    ]
  }});

}(this));