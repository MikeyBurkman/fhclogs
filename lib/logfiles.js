'use strict';

//const moment = require('moment');
const R = require('ramda');
const Nodeproc = require('nodeproc');

const sortLogs = R.sortBy(R.prop('modifiedTs'));
const isStdOut = R.test(/^stdout\.log/);
const isStdErr = R.test(/^stderr\.log/);

exports.getStdOutFiles = function(appID, env) {
  return getLogFileNames(appID, env).then(R.filter(isStdOut));
};

exports.getStdErrFiles = function(appID, env) {
  return getLogFileNames(appID, env).then(R.filter(isStdErr));
};

exports.getAllLogs = getLogFileNames;

function getLogFileNames(appID, env) {
  var processes = new Nodeproc();

  let stdout = [];
  return processes
    .spawn({
      command: 'fhc',
      args: `app logs list --app=${appID} --env=${env} --table=false`,
      stdout: {
        write: (data, encoding) => stdout.push(data.toString(encoding))
      }
    })
    .then(() => {
      const json = JSON.parse(stdout.join(''));
      const sorted = sortLogs(json.logs);
      return R.pluck('name', sorted);
    });
}
