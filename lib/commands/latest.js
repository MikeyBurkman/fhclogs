'use strict';

const R = require('ramda');

const spawn = require('../spawn');
const config = require('../config');
const logFiles = require('../logfiles');

exports.command = 'latest <appName> <env> [index]';
exports.desc =
  'Gets the latest stdout log file. Optional index is a 1-based integer used to get previous files';

exports.builder = yargs =>
  yargs.completion('completion', (current, argv) => {
    switch (argv._.length) {
      case 3:
        return config.getAllAppNames();
      case 4:
        return config.getAllEnvs();
      default:
        return [];
    }
  });

exports.handler = function(argv) {
  const appName = argv.appName;
  const env = argv.env;
  const index = parseInt(argv.index) || 1;

  const service = config.getMatchingApp(appName);

  logFiles
    .getStdOutFiles(service.appID, env)
    .then(R.nth(index - 1))
    .then(logName => {
      if (!logName) {
        throw `Invalid index specified: ${index}`;
      }

      const cmd = `fhc app logs get --app=${service.appID} --env=${env} --logname=${logName}`;
      spawn(cmd, config.getPipeTo());
    })
    .catch(err => console.error(err));
};
