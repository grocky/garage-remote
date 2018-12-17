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
      console.log(e.stack);
      process.exit(3);
    }
  });

  process.on('exit', () => console.log('Done.'));

// catching signals and do something before exit
  ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGTERM'
  ].forEach((sig) => {
    process.on(sig, () => {
      console.log(`signal: ${sig}`);
      process.emit('cleanup');
    });
  });

//catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', (e) => {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
  });
};

module.exports = Cleanup;
