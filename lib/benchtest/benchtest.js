#! /usr/bin/node
var Monitor = require('monitor');
var logger = Monitor.getLogger('Benchtest');
var BBM = require('beaglebone-monitor');

Monitor.start(function(error) {
  if (error) {
    logger.error('start', 'Monitor error', error);
    process.exit(1);
  }
  logger.info('start', 'Monitor started');
  var bbm = new Monitor({probeName:'BeagleBone'});
  bbm.connect(function(error) {
    if (error) {
      logger.error('connect', 'BeagleBone probe connection error', error);
      process.exit(1);
    }
    logger.info('connect', 'BeagleBone monitor connected.');
  });
});
