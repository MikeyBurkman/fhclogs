#!/usr/bin/env node

'use strict';

const yargs = require('yargs');

yargs
  .commandDir('lib/commands')
  .demandCommand()
  .completion('completion', (current, argv) => {
    if (argv._.length === 2) {
      return ['apps', 'get', 'tail'];
    } else {
      return [];
    }
  })
  .help().argv;
