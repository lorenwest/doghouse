var b = require('bonescript');
var pin = 'P9_36';

// b.pinMode(pin, b.INPUT);

setInterval(function(){
  var a = Date.now();
  b.analogRead(pin, function(){
    console.log('Write time: ' + (Date.now() - a) + 'ms.');
  });
},50);
