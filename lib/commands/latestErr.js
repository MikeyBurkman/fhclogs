'use strict';

const R = require('ramda');
const Nodeproc = require('nodeproc');

const config = require('../config');
const logFiles = require('../logfiles');

exports.command = 'latestErr <appName> <env> [index]';
exports.desc =
  'Get the latest stderr log file. Optional index is a 1-based integer used to get previous files';

exports.builder = yargs =>
  yargs.completion('completion', (current, argv) => {
    switch (argv._.length) {
      case 4:
        return config.getAllAppNames();
      case 5:
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
    .getStdErrFiles(service.appID, env)
    .then(R.nth(index - 1))
    .then(logName => {
      if (!logName) {
        throw `Invalid index specified: ${index}`;
      }

      var processes = new Nodeproc();
      processes.spawn(
        `fhc app logs get --app=${service.appID} --env=${env} --logname=${logName}`
      );
    })
    .catch(err => console.error(err));
};
