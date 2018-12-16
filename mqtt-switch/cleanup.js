const log = (msg) => console.log(`CLEANUP: ${msg}`);

/**
 * @param {function(): Promise} customCleanup
 * @constructor
 */
const Cleanup = (customCleanup) => {
  process.on('cleanup', async () => {
    try {
      await customCleanup();
      process.exit();
    } catch (e) {
      log(e.message);
      process.exit(3);
    }
  });

  process.on('exit', () => log('Done.'));

// catching signals and do something before exit
  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
  ].forEach((sig) => {
    process.on(sig, () => {
      log(`signal: ${sig}`);
      process.emit('cleanup');
    });
  });

//catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', (e) => {
    log('Uncaught Exception...');
    log(e.stack);
    process.exit(99);
  });
};

module.exports = Cleanup;
