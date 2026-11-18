#!/usr/bin/env node
// Entry point for the npm package (`npx aio-agent ...`). Dispatches to scripts/aio.mjs.
'use strict';
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const ROOT = path.resolve(__dirname, '..');
const { version } = require(path.join(ROOT, 'package.json'));

const HELP = `aio-agent ${version}

Usage: aio-agent <command> [--only id[,id...]]

  install    Detect installed agents and install skills, rules and MCP servers.
  uninstall  Remove everything AIO-AGENT installed and restore backed-up files.
  update     Update AIO-AGENT, then reinstall.
  doctor     Check rules, skills and MCP servers for each detected agent.
  list       Show adapters and whether each agent was detected.

Options:
  --only     Limit to these adapter ids, even if the agent is not detected.
  --help     Show this help.
  --version  Show the version.`;

function run(cmd, args) {
	const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
	return r.status ?? 1;
}

// A git checkout pulls; a global npm install upgrades itself; an npx run cannot update itself.
function update(rest) {
	if (spawnSync('git', ['-C', ROOT, 'rev-parse', '--git-dir'], { stdio: 'ignore' }).status === 0) {
		const code = run('git', ['-C', ROOT, 'pull', '--ff-only']);
		return code || run(process.execPath, [path.join(__dirname, 'aio.mjs'), 'install', ...rest]);
	}
	if (ROOT.split(path.sep).includes('_npx')) {
		console.log('This copy was run through npx. To update, run: npx aio-agent@latest install');
		return 0;
	}
	const code = run('npm', ['install', '--global', 'aio-agent@latest']);
	return code || run('aio-agent', ['install', ...rest]);
}

async function cli(argv) {
	const [cmd, ...rest] = argv;
	if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') { console.log(HELP); return 0; }
	if (cmd === '--version' || cmd === '-v') { console.log(version); return 0; }
	if (cmd === 'update') return update(rest);
	if (!['install', 'uninstall', 'doctor', 'list'].includes(cmd)) {
		console.error(`aio-agent: unknown command "${cmd}"\n\n${HELP}`);
		return 2;
	}
	const { main } = await import(pathToFileURL(path.join(__dirname, 'aio.mjs')).href);
	return main(argv);
}

cli(process.argv.slice(2)).then(
	(code) => { process.exitCode = code; },
	(err) => { console.error(`aio-agent: ${err.message}`); process.exitCode = 1; },
);
