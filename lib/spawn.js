'use strict';

const os = require('os');
const Nodeproc = require('nodeproc');

module.exports = function spawn(cmd, pipeTo) {
  const processes = new Nodeproc();

  if (pipeTo) {
    // Can only pipe with a spawned process by invoking sh, which requires *nix
    if (os.platform() === 'win32') {
      throw 'Piping output is not supported on Windows. Sorry.';
    }

    const cmdWithPipe = cmd + pipeTo;
    console.log(`Running command: ${cmdWithPipe}`);

    processes.spawn({
      command: 'sh',
      args: ['-c', cmdWithPipe]
    });
  } else {
    console.log(`Running command: ${cmd}`);
    processes.spawn(cmd);
  }
};
