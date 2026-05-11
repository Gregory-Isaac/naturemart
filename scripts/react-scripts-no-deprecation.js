process.noDeprecation = true;

const script = process.argv[2];
const allowedScripts = new Set(['start', 'build', 'test', 'eject']);

if (!allowedScripts.has(script)) {
  console.error(`Unknown react-scripts command: ${script || '(missing)'}`);
  process.exit(1);
}

process.argv.splice(2, 1);
require(`react-scripts/scripts/${script}`);
