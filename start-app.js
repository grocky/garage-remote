const appDir = process.argv[2];
const args = [ 'run', 'start:dev' ];
const opts = { stdio: 'inherit', cwd: appDir, shell: true };
require('child_process').spawn('npm', args, opts);
