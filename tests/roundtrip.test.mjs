// Install twice, then uninstall, in a scratch home seeded with the user's own
// config. Checks that the second install changes nothing, that user entries
// survive, and that uninstall restores every file byte for byte.
// Run: node --test tests/roundtrip.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = path.join(ROOT, 'scripts', 'aio.mjs');
// Claude Code is configured through its own CLI and is tested on a real install instead.
const ADAPTERS = 'codex,cursor,antigravity,kimi,pi,omp,agents-md';

function snapshot(dir) {
	const out = {};
	const walk = (d) => {
		for (const name of fs.readdirSync(d).sort()) {
			const full = path.join(d, name);
			if (fs.statSync(full).isDirectory()) walk(full);
			else out[path.relative(dir, full)] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
		}
	};
	walk(dir);
	return out;
}

function engine(home, args, extraEnv = {}) {
	const env = { ...process.env, HOME: home, USERPROFILE: home, ...extraEnv };
	for (const k of ['CODEX_HOME', 'CLAUDE_CONFIG_DIR', 'KIMI_SHARE_DIR', 'PI_CODING_AGENT_DIR', 'CONTEXT7_API_KEY', 'API_KEY_21ST']) {
		if (!(k in extraEnv)) delete env[k];
	}
	const r = spawnSync(process.execPath, [ENGINE, ...args], { env, encoding: 'utf8' });
	assert.equal(r.status, 0, `${args.join(' ')} failed:\n${r.stdout}\n${r.stderr}`);
	return r.stdout;
}

function seed(home) {
	const write = (rel, text) => {
		const file = path.join(home, rel);
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, text);
	};
	write('.codex/AGENTS.md', '# My rules\n\nAlways use tabs.');
	write('.codex/config.toml', 'model = "o4"\n\n[mcp_servers.context7]\ncommand = "my-own-context7"\n');
	write('.cursor/mcp.json', '{\n    "mcpServers": {\n        "mine": { "command": "my-server" }\n    }\n}\n');
	write('.gemini/config/mcp_config.json', '');
	write('.pi/agent/AGENTS.md', 'Pi notes\n');
	write('.agents/skills/aio-tdd/SKILL.md', '---\nname: aio-tdd\ndescription: my own\n---\n');
}

test('install is idempotent and uninstall restores every file', () => {
	const home = fs.mkdtempSync(path.join(os.tmpdir(), 'aio-home-'));
	try {
		seed(home);
		const before = snapshot(home);

		engine(home, ['install', '--only', ADAPTERS], { CONTEXT7_API_KEY: 'test-key' });
		const first = snapshot(home);
		engine(home, ['install', '--only', ADAPTERS], { CONTEXT7_API_KEY: 'test-key' });
		assert.deepEqual(snapshot(home), first, 'second install changed files');

		const read = (rel) => fs.readFileSync(path.join(home, rel), 'utf8');
		assert.match(read('.codex/AGENTS.md'), /^# My rules\n\nAlways use tabs\.\n\n<!-- aio-agent:begin -->/);
		assert.match(read('.codex/config.toml'), /command = "my-own-context7"/, 'user server kept');
		assert.doesNotMatch(read('.codex/config.toml'), /\[mcp_servers\.context7\]\nurl/, 'user server not overwritten');
		assert.match(read('.codex/config.toml'), /\[mcp_servers\.chrome-devtools\]/);

		const cursor = JSON.parse(read('.cursor/mcp.json'));
		assert.deepEqual(cursor.mcpServers.mine, { command: 'my-server' });
		assert.equal(cursor.mcpServers.context7.headers.Authorization, 'Bearer ${env:CONTEXT7_API_KEY}');
		assert.equal(cursor.mcpServers.magic, undefined, 'magic needs API_KEY_21ST');

		const agy = JSON.parse(read('.gemini/config/mcp_config.json'));
		assert.equal(agy.mcpServers.context7.serverUrl, 'https://mcp.context7.com/mcp');
		assert.equal(agy.mcpServers.context7.headers, undefined, 'no key written where env vars are not expanded');
		assert.match(read('.gemini/config/rules/aio-agent.md'), /^---\ntrigger: always_on\n/);

		assert.equal(read('.agents/skills/aio-tdd/SKILL.md'), '---\nname: aio-tdd\ndescription: my own\n---\n', 'user skill kept');
		assert.ok(fs.existsSync(path.join(home, '.agents/skills/aio-debug/SKILL.md')));
		assert.ok(fs.existsSync(path.join(home, '.kimi/skills/aio-debug/SKILL.md')));
		for (const value of Object.values(first)) assert.ok(value);
		const all = Object.keys(first).map((rel) => read(rel)).join('\n');
		assert.ok(!all.includes('test-key'), 'API key value written to disk');

		engine(home, ['uninstall']);
		assert.deepEqual(snapshot(home), before, 'uninstall did not restore the original files');
	} finally {
		fs.rmSync(home, { recursive: true, force: true });
	}
});

test('uninstall keeps user edits made after install', () => {
	const home = fs.mkdtempSync(path.join(os.tmpdir(), 'aio-home-'));
	try {
		seed(home);
		engine(home, ['install', '--only', 'codex']);
		const file = path.join(home, '.codex/AGENTS.md');
		fs.appendFileSync(file, '\nAdded later by the user.\n');
		engine(home, ['uninstall']);
		const text = fs.readFileSync(file, 'utf8');
		assert.match(text, /Added later by the user\./);
		assert.doesNotMatch(text, /aio-agent:begin/);
		assert.ok(fs.readdirSync(path.join(home, '.codex')).some((f) => f.startsWith('AGENTS.md.bak-')), 'backup kept');
	} finally {
		fs.rmSync(home, { recursive: true, force: true });
	}
});
