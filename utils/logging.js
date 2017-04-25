'use strict';

var bunyan = require('bunyan');
var assign = require('lodash/assign');
var nconf = require('./conf');
var loggerConfig = nconf.get('logger');

function getLogger(name, opts) {
  return bunyan.createLogger(assign({
    name: name,
    level: loggerConfig.level,
    stream: process.stdout,
  }, opts));
}

module.exports.getLogger = getLogger;
