#!/usr/bin/env node
// AIO-AGENT installer engine: install | uninstall | doctor | list.
// The shell and PowerShell scripts in this folder are thin wrappers around it,
// so the merge, backup and restore logic exists exactly once.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOME = os.homedir();
const STATE_DIR = path.join(HOME, '.aio-agent');
const STATE_FILE = path.join(STATE_DIR, 'state.json');
const SKILL_MARK = '.aio-agent';
const MD_BEGIN = '<!-- aio-agent:begin -->';
const MD_END = '<!-- aio-agent:end -->';
const TOML_BEGIN = '# aio-agent:begin';
const TOML_END = '# aio-agent:end';
const MANAGED_NOTE = '<!-- Managed by AIO-AGENT. Reinstalling overwrites this file; uninstalling removes it. -->';
const IS_WINDOWS = process.platform === 'win32';

const log = (msg) => console.log(msg);
const warn = (msg) => console.log(`  ! ${msg}`);
const sha = (text) => crypto.createHash('sha256').update(text).digest('hex');
const tilde = (p) => (p.startsWith(HOME) ? `~${p.slice(HOME.length)}` : p);

function expandHome(p) {
	return p.startsWith('~/') ? path.join(HOME, ...p.slice(2).split('/')) : p;
}

export function loadAdapters() {
	const dir = path.join(ROOT, 'adapters');
	return fs.readdirSync(dir).sort()
		.filter((id) => fs.existsSync(path.join(dir, id, 'adapter.conf')))
		.map((id) => {
			const conf = { id };
			for (const line of fs.readFileSync(path.join(dir, id, 'adapter.conf'), 'utf8').split(/\r?\n/)) {
				const m = line.match(/^([A-Z_]+)=(.*)$/);
				if (m) conf[m[1]] = m[2].trim();
			}
			const base = (conf.BASE_ENV && process.env[conf.BASE_ENV]) || expandHome(conf.BASE);
			const resolve = (v) => (v ? expandHome(v).replaceAll('{BASE}', base) : '');
			return {
				...conf,
				base,
				skillsDir: path.normalize(resolve(conf.SKILLS_DIR)),
				rulesPath: conf.RULES_PATH ? path.normalize(resolve(conf.RULES_PATH)) : '',
				mcpPath: conf.MCP_PATH ? path.normalize(resolve(conf.MCP_PATH)) : '',
				detectCommands: (conf.DETECT_COMMANDS || '').split(/\s+/).filter(Boolean),
				detectDirs: (conf.DETECT_DIRS || '').split(/\s+/).filter(Boolean).map(resolve),
			};
		});
}

export function loadSkills() {
	const base = path.join(ROOT, 'core', 'skills');
	const skills = [];
	for (const group of fs.readdirSync(base).sort()) {
		const groupDir = path.join(base, group);
		if (!fs.statSync(groupDir).isDirectory()) continue;
		for (const name of fs.readdirSync(groupDir).sort()) {
			if (fs.existsSync(path.join(groupDir, name, 'SKILL.md'))) skills.push({ name, dir: path.join(groupDir, name) });
		}
	}
	return skills;
}

// Reads the fixed YAML subset documented at the top of core/mcp/servers.yaml.
export function loadServers(file = path.join(ROOT, 'core', 'mcp', 'servers.yaml')) {
	const servers = [];
	let current = null;
	for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
		const line = raw.replace(/\s+#.*$/, '').replace(/^#.*$/, '');
		let m;
		if ((m = line.match(/^ {2}([a-z0-9-]+):\s*$/))) servers.push((current = { name: m[1] }));
		else if ((m = line.match(/^ {4}([a-z_]+):\s*(.*)$/)) && current) current[m[1]] = m[2].trim();
	}
	for (const s of servers) {
		if (!['http', 'stdio'].includes(s.transport)) throw new Error(`servers.yaml: ${s.name} has no valid transport`);
	}
	return servers;
}

function onPath(cmd) {
	const exts = IS_WINDOWS ? ['.exe', '.cmd', '.bat', ''] : [''];
	return (process.env.PATH || '').split(path.delimiter).filter(Boolean)
		.some((d) => exts.some((e) => fs.existsSync(path.join(d, cmd + e))));
}

const isDetected = (a) => a.detectCommands.some(onPath) || fs.existsSync(a.base) || a.detectDirs.some((d) => fs.existsSync(d));

function selectAdapters(only) {
	const all = loadAdapters();
	if (!only) return all.filter(isDetected);
	const ids = only.split(',').map((s) => s.trim());
	const unknown = ids.filter((id) => !all.some((a) => a.id === id));
	if (unknown.length) throw new Error(`unknown adapter: ${unknown.join(', ')}`);
	return all.filter((a) => ids.includes(a.id));
}

function loadState() {
	if (!fs.existsSync(STATE_FILE)) return { version: 1, files: {}, skills: [], createdDirs: [], mcp: {}, claude: {} };
	return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveState(state) {
	const text = `${JSON.stringify(state, null, 2)}\n`;
	if (fs.existsSync(STATE_FILE) && fs.readFileSync(STATE_FILE, 'utf8') === text) return;
	fs.mkdirSync(STATE_DIR, { recursive: true });
	fs.writeFileSync(STATE_FILE, text);
}

function timestamp() {
	const d = new Date();
	const p = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function makeDir(dir, state) {
	const first = fs.mkdirSync(dir, { recursive: true });
	if (first && !state.createdDirs.includes(first)) state.createdDirs.push(first);
}

// Writes content only when it differs. The first time AIO-AGENT changes a file
// that already existed, the original is saved as <file>.bak-<timestamp>.
function writeManaged(file, content, state) {
	const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
	if (current === content) return false;
	let entry = state.files[file];
	if (!entry) {
		entry = { created: current === null, backup: null, hash: null };
		if (current !== null) {
			entry.backup = `${file}.bak-${timestamp()}`;
			fs.copyFileSync(file, entry.backup);
		}
		state.files[file] = entry;
	}
	makeDir(path.dirname(file), state);
	fs.writeFileSync(file, content);
	entry.hash = sha(content);
	return true;
}

function treeDigest(dir) {
	const parts = [];
	const walk = (d, rel) => {
		for (const name of fs.readdirSync(d).sort()) {
			if (name === SKILL_MARK) continue;
			const full = path.join(d, name);
			if (fs.statSync(full).isDirectory()) walk(full, `${rel}${name}/`);
			else parts.push(`${rel}${name}\0${sha(fs.readFileSync(full))}`);
		}
	};
	walk(dir, '');
	return sha(parts.join('\n'));
}

function installSkills(adapter, state) {
	let changed = 0;
	for (const skill of loadSkills()) {
		const dest = path.join(adapter.skillsDir, skill.name);
		if (fs.existsSync(dest) && !fs.existsSync(path.join(dest, SKILL_MARK))) {
			warn(`${tilde(dest)} exists and is not managed by AIO-AGENT; left alone`);
			continue;
		}
		if (fs.existsSync(dest) && treeDigest(dest) === treeDigest(skill.dir)) continue;
		fs.rmSync(dest, { recursive: true, force: true });
		makeDir(adapter.skillsDir, state);
		fs.cpSync(skill.dir, dest, { recursive: true });
		fs.writeFileSync(path.join(dest, SKILL_MARK), 'Installed by AIO-AGENT. Uninstall removes this folder.\n');
		if (!state.skills.includes(dest)) state.skills.push(dest);
		changed++;
	}
	return changed;
}

function routerText(adapter) {
	return fs.readFileSync(path.join(ROOT, 'core', 'rules', 'router.md'), 'utf8')
		.replaceAll('{{SKILLS_DIR}}', adapter.skillsDir.split(path.sep).join('/'));
}

export function stripBlock(text, begin, end) {
	const start = text.indexOf(begin);
	if (start === -1) return text;
	const stop = text.indexOf(end, start);
	if (stop === -1) return text;
	let before = text.slice(0, start);
	const after = text.slice(stop + end.length).replace(/^\r?\n/, '');
	// The installer adds one blank line before the block; take it back out.
	if (before.endsWith('\n\n')) before = before.slice(0, -1);
	return before + after;
}

export function appendBlock(text, begin, body, end) {
	const base = stripBlock(text, begin, end);
	const sep = base === '' ? '' : base.endsWith('\n') ? '\n' : '\n\n';
	return `${base}${sep}${begin}\n${body.endsWith('\n') ? body : `${body}\n`}${end}\n`;
}

function installRules(adapter, state) {
	if (adapter.RULES_MODE === 'none' || !adapter.RULES_MODE) return false;
	const body = routerText(adapter);
	if (adapter.RULES_MODE === 'file') {
		const fm = adapter.RULES_FRONTMATTER ? `---\n${adapter.RULES_FRONTMATTER.replaceAll('\\n', '\n')}\n---\n\n` : '';
		return writeManaged(adapter.rulesPath, `${fm}${MANAGED_NOTE}\n\n${body}`, state);
	}
	const current = fs.existsSync(adapter.rulesPath) ? fs.readFileSync(adapter.rulesPath, 'utf8') : '';
	return writeManaged(adapter.rulesPath, appendBlock(current, MD_BEGIN, body, MD_END), state);
}

const envRef = (style, name) => (style === 'cursor' ? `\${env:${name}}` : `\${${name}}`);

// Decides, per server, whether and how it is written for one adapter.
export function planServers(adapter, servers, env = process.env) {
	const style = adapter.MCP_ENV_STYLE || 'none';
	const plan = [];
	const skipped = [];
	for (const s of servers) {
		const hasKey = Boolean(s.key_env && env[s.key_env]);
		if (s.requires_key === 'true' && !hasKey) { skipped.push(`${s.name} (${s.key_env} not set)`); continue; }
		if (s.requires_key === 'true' && style === 'none') { skipped.push(`${s.name} (this agent cannot read keys from the environment)`); continue; }
		const entry = {};
		if (s.transport === 'http') {
			if (adapter.MCP_TYPE_FIELD === 'yes' || adapter.MCP_MODE === 'claude-cli') entry.type = 'http';
			entry[adapter.MCP_URL_KEY || 'url'] = s.url;
			if (hasKey && style !== 'none') {
				const value = [s.key_prefix, envRef(style, s.key_env)].filter(Boolean).join(' ');
				entry.headers = { [s.key_header]: value };
			}
		} else {
			if (adapter.MCP_TYPE_FIELD === 'yes' || adapter.MCP_MODE === 'claude-cli') entry.type = 'stdio';
			entry.command = s.command;
			entry.args = s.args.split(/\s+/).filter(Boolean);
		}
		plan.push({ server: s, name: s.name, entry, hasKey });
	}
	return { plan, skipped };
}

function installJsonMcp(adapter, plan, state) {
	const file = adapter.mcpPath;
	const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
	let config;
	try {
		config = text.trim() ? JSON.parse(text) : {};
	} catch {
		warn(`${tilde(file)} is not valid JSON; MCP servers not added`);
		return false;
	}
	const before = JSON.stringify(config);
	config.mcpServers ??= {};
	const owned = state.mcp[file] ?? [];
	if (plan.length === 0 && owned.length === 0) return false;
	const nowOwned = [];
	for (const p of plan) {
		if (p.name in config.mcpServers && !owned.includes(p.name)) {
			warn(`MCP server "${p.name}" already exists in ${tilde(file)}; left alone`);
			continue;
		}
		config.mcpServers[p.name] = p.entry;
		nowOwned.push(p.name);
	}
	for (const name of owned) if (!nowOwned.includes(name)) delete config.mcpServers[name];
	state.mcp[file] = nowOwned;
	if (JSON.stringify(config) === before) return false;
	return writeManaged(file, `${JSON.stringify(config, null, 2)}\n`, state);
}

const tomlString = (s) => JSON.stringify(s);

export function codexToml(plan) {
	const out = [];
	for (const { name, server: s, entry, hasKey } of plan) {
		out.push(`[mcp_servers.${name}]`);
		if (s.transport === 'http') {
			out.push(`url = ${tomlString(s.url)}`);
			if (hasKey && s.key_header === 'Authorization' && s.key_prefix === 'Bearer') out.push(`bearer_token_env_var = ${tomlString(s.key_env)}`);
			else if (hasKey) out.push(`env_http_headers = { ${tomlString(s.key_header)} = ${tomlString(s.key_env)} }`);
		} else {
			out.push(`command = ${tomlString(entry.command)}`);
			out.push(`args = [${entry.args.map(tomlString).join(', ')}]`);
		}
		out.push('');
	}
	return out.join('\n').trimEnd();
}

function installTomlMcp(adapter, plan, state) {
	const file = adapter.mcpPath;
	const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
	const outside = stripBlock(current, TOML_BEGIN, TOML_END);
	const mine = plan.filter((p) => {
		const taken = new RegExp(`^\\[mcp_servers\\.${p.name}\\]`, 'm').test(outside);
		if (taken) warn(`MCP server "${p.name}" already exists in ${tilde(file)}; left alone`);
		return !taken;
	});
	state.mcp[file] = mine.map((p) => p.name);
	if (mine.length === 0) return current === outside ? false : writeManaged(file, outside, state);
	return writeManaged(file, appendBlock(current, TOML_BEGIN, codexToml(mine), TOML_END), state);
}

function run(cmd, args, opts = {}) {
	let r = spawnSync(cmd, args, { encoding: 'utf8', cwd: HOME, ...opts });
	if (r.error && r.error.code === 'ENOENT' && IS_WINDOWS) {
		// npm-installed CLIs are .cmd shims on Windows and need a shell.
		const quoted = args.map((a) => `"${a.replaceAll('"', '\\"')}"`).join(' ');
		r = spawnSync(`${cmd}.cmd ${quoted}`, { encoding: 'utf8', cwd: HOME, shell: true, ...opts });
	}
	return r;
}

function installClaudeMcp(plan, state) {
	if (!onPath('claude')) { warn('claude command not found; MCP servers not added'); return false; }
	let changed = false;
	const owned = state.claude ?? {};
	const wanted = new Set(plan.map((p) => p.name));
	for (const p of plan) {
		const json = JSON.stringify(p.entry);
		if (owned[p.name] === json) continue;
		const exists = run('claude', ['mcp', 'get', p.name]).status === 0;
		if (exists && !(p.name in owned)) { warn(`Claude Code already has an MCP server named "${p.name}"; left alone`); continue; }
		if (exists) run('claude', ['mcp', 'remove', p.name, '--scope', 'user']);
		const r = run('claude', ['mcp', 'add-json', '--scope', 'user', p.name, json]);
		if (r.status !== 0) { warn(`claude mcp add-json ${p.name} failed: ${(r.stderr || r.stdout || '').trim()}`); continue; }
		owned[p.name] = json;
		changed = true;
	}
	for (const name of Object.keys(owned)) {
		if (wanted.has(name)) continue;
		run('claude', ['mcp', 'remove', name, '--scope', 'user']);
		delete owned[name];
		changed = true;
	}
	state.claude = owned;
	return changed;
}

function installMcp(adapter, state) {
	if (!adapter.MCP_MODE || adapter.MCP_MODE === 'none') return { changed: false, skipped: [] };
	const { plan, skipped } = planServers(adapter, loadServers());
	const changed = adapter.MCP_MODE === 'claude-cli' ? installClaudeMcp(plan, state)
		: adapter.MCP_MODE === 'codex-toml' ? installTomlMcp(adapter, plan, state)
			: installJsonMcp(adapter, plan, state);
	return { changed, skipped };
}

function install(only) {
	const adapters = selectAdapters(only);
	if (adapters.length === 0) { log('No supported agent found. Run with --only <id> to install anyway; see --list.'); return 0; }
	const state = loadState();
	for (const a of adapters) {
		log(`${a.NAME}`);
		const skills = installSkills(a, state);
		log(`  skills  ${skills ? `${skills} updated` : 'unchanged'} in ${tilde(a.skillsDir)}`);
		if (a.RULES_MODE === 'none') log('  rules   none: this agent has no user-level rules file (see docs/platforms.md)');
		else log(`  rules   ${installRules(a, state) ? 'written' : 'unchanged'} in ${tilde(a.rulesPath)}`);
		const mcp = installMcp(a, state);
		if (a.MCP_MODE && a.MCP_MODE !== 'none') log(`  mcp     ${mcp.changed ? 'updated' : 'unchanged'}${a.mcpPath ? ` in ${tilde(a.mcpPath)}` : ''}`);
		for (const s of mcp.skipped) log(`          skipped ${s}`);
	}
	saveState(state);
	return 0;
}

function removeEmptyDirs(dirs) {
	for (const dir of [...dirs].sort((x, y) => y.length - x.length)) {
		const prune = (d) => {
			if (!fs.existsSync(d) || !fs.statSync(d).isDirectory()) return;
			for (const child of fs.readdirSync(d)) prune(path.join(d, child));
			if (fs.readdirSync(d).length === 0) fs.rmdirSync(d);
		};
		prune(dir);
	}
}

function uninstall() {
	if (!fs.existsSync(STATE_FILE)) { log('AIO-AGENT is not installed for this user (no ~/.aio-agent/state.json).'); return 0; }
	const state = loadState();
	for (const name of Object.keys(state.claude ?? {})) {
		const r = run('claude', ['mcp', 'remove', name, '--scope', 'user']);
		log(`Claude Code MCP server ${name}: ${r.status === 0 ? 'removed' : 'not found'}`);
	}
	for (const dir of state.skills) {
		if (fs.existsSync(path.join(dir, SKILL_MARK))) fs.rmSync(dir, { recursive: true, force: true });
	}
	log(`Skills: removed ${state.skills.length} folders`);
	for (const [file, entry] of Object.entries(state.files)) {
		const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
		if (current === null) { log(`${tilde(file)}: already gone`); continue; }
		if (sha(current) === entry.hash) {
			if (entry.created) fs.unlinkSync(file);
			else { fs.copyFileSync(entry.backup, file); fs.unlinkSync(entry.backup); }
			log(`${tilde(file)}: ${entry.created ? 'removed' : 'restored from backup'}`);
			continue;
		}
		// Edited since install: remove only what AIO-AGENT added and keep the backup.
		let text = stripBlock(stripBlock(current, MD_BEGIN, MD_END), TOML_BEGIN, TOML_END);
		if (file.endsWith('.json') && state.mcp[file]) {
			try {
				const config = JSON.parse(current);
				for (const name of state.mcp[file]) delete config.mcpServers?.[name];
				text = `${JSON.stringify(config, null, 2)}\n`;
			} catch { warn(`${tilde(file)} is not valid JSON; edit it by hand`); }
		}
		if (current.includes(MANAGED_NOTE) || (entry.created && text.trim() === '')) fs.unlinkSync(file);
		else fs.writeFileSync(file, text);
		log(`${tilde(file)}: edited since install; removed AIO-AGENT entries${entry.backup ? `, original kept at ${tilde(entry.backup)}` : ''}`);
	}
	removeEmptyDirs(state.createdDirs);
	fs.rmSync(STATE_DIR, { recursive: true, force: true });
	return 0;
}

// Sends an MCP initialize request; resolves true when the server answers.
async function reachable(server) {
	const init = { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'aio-agent-doctor', version: '0' } } };
	if (server.transport === 'http') {
		const headers = { 'content-type': 'application/json', accept: 'application/json, text/event-stream' };
		const key = server.key_env && process.env[server.key_env];
		if (key) headers[server.key_header] = [server.key_prefix, key].filter(Boolean).join(' ');
		try {
			const res = await fetch(server.url, { method: 'POST', headers, body: JSON.stringify(init), signal: AbortSignal.timeout(20000) });
			return res.ok;
		} catch { return false; }
	}
	return new Promise((resolve) => {
		const child = spawn(server.command, server.args.split(/\s+/), { stdio: ['pipe', 'pipe', 'ignore'], shell: IS_WINDOWS });
		const done = (ok) => { clearTimeout(timer); child.kill(); resolve(ok); };
		const timer = setTimeout(() => done(false), 120000);
		let out = '';
		child.stdout.on('data', (d) => { out += d; if (out.includes('"result"')) done(true); });
		child.on('error', () => done(false));
		child.on('exit', () => done(out.includes('"result"')));
		child.stdin.write(`${JSON.stringify(init)}\n`);
	});
}

function configured(adapter, name) {
	if (adapter.MCP_MODE === 'claude-cli') return onPath('claude') && run('claude', ['mcp', 'get', name]).status === 0;
	if (!fs.existsSync(adapter.mcpPath)) return false;
	const text = fs.readFileSync(adapter.mcpPath, 'utf8');
	if (adapter.MCP_MODE === 'codex-toml') return new RegExp(`^\\[mcp_servers\\.${name}\\]`, 'm').test(text);
	try { return Boolean(JSON.parse(text).mcpServers?.[name]); } catch { return false; }
}

async function doctor(only) {
	const adapters = selectAdapters(only);
	if (adapters.length === 0) { log('No supported agent found.'); return 1; }
	const servers = loadServers();
	const health = {};
	const isReachable = async (s) => (health[s.name] ??= await reachable(s));
	const skills = loadSkills();
	let ok = true;
	const mark = (good) => { if (!good) ok = false; return good ? '✅' : '❌'; };
	for (const a of adapters) {
		log(a.NAME);
		if (a.RULES_MODE === 'none') log('  rules    n/a  no user-level rules file for this agent');
		else {
			const text = fs.existsSync(a.rulesPath) ? fs.readFileSync(a.rulesPath, 'utf8') : '';
			log(`  rules    ${mark(text.includes(a.RULES_MODE === 'file' ? MANAGED_NOTE : MD_BEGIN))}   ${tilde(a.rulesPath)}`);
		}
		const found = skills.filter((s) => fs.existsSync(path.join(a.skillsDir, s.name, 'SKILL.md'))).length;
		log(`  skills   ${mark(found === skills.length)}   ${found}/${skills.length} in ${tilde(a.skillsDir)}`);
		if (!a.MCP_MODE || a.MCP_MODE === 'none') { log('  mcp      n/a  not configured by AIO-AGENT for this agent'); continue; }
		const { plan, skipped } = planServers(a, servers);
		for (const p of plan) {
			const isConfigured = configured(a, p.name);
			const up = await isReachable(p.server);
			log(`  mcp      ${mark(isConfigured && up)}   ${p.name}: ${isConfigured ? 'configured' : 'not configured'}, ${up ? 'reachable' : 'not reachable'}`);
		}
		for (const s of skipped) log(`  mcp      –    skipped ${s}`);
	}
	return ok ? 0 : 1;
}

function list() {
	for (const a of loadAdapters()) log(`${a.id.padEnd(12)} ${isDetected(a) ? 'detected    ' : 'not detected'} ${a.NAME}`);
	return 0;
}

const USAGE = `Usage: aio.mjs <install|uninstall|doctor|list> [--only id[,id...]]

  install    Detect installed agents and install skills, rules and MCP servers.
  uninstall  Remove everything AIO-AGENT installed and restore backed-up files.
  doctor     Check rules, skills and MCP servers for each detected agent.
  list       Show adapters and whether each agent was detected.
  --only     Limit to these adapter ids, even if the agent is not detected.`;

async function main(argv) {
	const [cmd, ...rest] = argv;
	if (['-h', '--help', 'help'].includes(cmd) || rest.includes('--help') || rest.includes('-h')) { log(USAGE); return 0; }
	const onlyAt = rest.indexOf('--only');
	const only = onlyAt === -1 ? null : rest[onlyAt + 1];
	if (onlyAt !== -1 && !only) { console.error(USAGE); return 2; }
	switch (cmd) {
		case 'install': return install(only);
		case 'uninstall': return uninstall();
		case 'doctor': return doctor(only);
		case 'list': return list();
		default: console.error(USAGE); return cmd ? 2 : 0;
	}
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main(process.argv.slice(2)).then((code) => { process.exitCode = code; }, (err) => { console.error(`aio-agent: ${err.message}`); process.exitCode = 1; });
}
