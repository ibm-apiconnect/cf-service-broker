'use strict';

var nconf = require('nconf');
var ymlFormat = require('nconf-yaml');
var path = require('path');

var basePath = path.resolve(__dirname, '../configs', 'config-base.yaml');

nconf.argv()
  .env({separator: '__'})
  .file('override', {file: basePath, format: ymlFormat});

nconf.loadFilesSync();

module.exports = nconf;
