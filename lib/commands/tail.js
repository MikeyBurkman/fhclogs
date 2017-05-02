'use strict';

const spawn = require('../spawn');
const config = require('../config');

exports.command = 'tail <appName> <env>';
exports.desc = 'Tail the current log file';

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

  const service = config.getMatchingApp(appName);

  const cmd = `fhc app logs tail --app=${service.appID} --env=${env}`;
  spawn(cmd, config.getPipeTo());
};
