'use strict';

const spawn = require('../spawn');
const config = require('../config');

exports.command = 'get <appName> <env> <logName>';
exports.desc = 'Get a log file';

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
  const logName = argv.logName;

  const service = config.getMatchingApp(appName);

  const cmd = `fhc app logs get --app=${service.appID} --env=${env} --logname=${logName}`;
  spawn(cmd, config.getPipeTo());
};
