'use strict';

const config = require('../config');

exports.command = 'apps';
exports.desc = 'List all apps found in the config file';
exports.handler = function() {
  console.log(config.getAllAppNames().join('\n'));
};
