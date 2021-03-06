'use strict';

const rc = require('rc');
const ld = require('fast-levenshtein');

const config = rc('fhclogs');

const configApps = config.apps;
if (!configApps) {
  throw new Error('No "apps" object found in any .fhclogsrc files!');
}

const envs = config.envs || [];
const pipeTo = config.pipeTo;

const ldDist = 3; // levenshtein distance for matches

const appNames = Object.keys(configApps);
const apps = appNames.map(name => ({
  name: name,
  normalized: name.toLowerCase(),
  appID: configApps[name]
}));

exports.getAllAppNames = () => appNames;
exports.getAllEnvs = () => envs;
exports.getPipeTo = () => (pipeTo ? ` | ${pipeTo}` : undefined);

exports.getMatchingApp = appName => {
  const normalized = appName.toLowerCase();

  const isExactMatch = app => app.normalized === normalized;
  const isCloseEnough = app => ld.get(normalized, app.normalized) < ldDist;

  const exactMatch = apps.find(isExactMatch);
  if (exactMatch) {
    return exactMatch;
  }

  // If no exact match, maybe we're just close enough
  const matches = R.filter(isCloseEnough, apps);

  if (matches.length === 0) {
    throw `Could not find any app matching '${appName}'`;
  }

  if (matches.length > 1) {
    throw `Found multiple app names similar to '${appName}': [${R.pluck('name', matches).join(', ')}]`;
  }

  return matches[0];
};
