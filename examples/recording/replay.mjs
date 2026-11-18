#!/usr/bin/env node
// Replays a Claude Code stream-json session log as a readable terminal transcript.
// The content is printed unedited; only the time spent waiting on the model is removed.
// Usage: node replay.mjs <session.jsonl> [--seconds 30] [--root <dir shown as .>]
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';

const args = process.argv.slice(2);
const file = args[0];
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const seconds = Number(opt('seconds', 30));
const root = opt('root', '');
const width = Math.min(process.stdout.columns || 100, 110);

const ACCENT = '\x1b[38;2;229;83;45m';
const DIM = '\x1b[38;2;150;150;145m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const clean = (s) => {
  let out = String(s);
  if (root) out = out.split(`${root}/`).join('').split(root).join('.');
  return out.split(homedir()).join('~');
};

function wrap(text, indent = '') {
  const lines = [];
  for (const raw of clean(text).split('\n')) {
    let line = raw.replace(/\*\*(.+?)\*\*/g, `${BOLD}$1${RESET}`);
    while (line.replace(/\x1b\[[0-9;]*m/g, '').length > width - indent.length) {
      const cut = line.lastIndexOf(' ', width - indent.length);
      const at = cut > 20 ? cut : width - indent.length;
      lines.push(indent + line.slice(0, at));
      line = line.slice(at).trimStart();
    }
    lines.push(indent + line);
  }
  return lines;
}

function describeTool(name, input = {}) {
  if (name === 'Skill') return ['Skill', input.skill + (input.args ? `  ${input.args}` : '')];
  if (name === 'Bash') return ['Bash', input.command.split('\n')[0]];
  if (['Read', 'Edit', 'Write', 'NotebookEdit'].includes(name)) return [name, input.file_path];
  if (name === 'Grep' || name === 'Glob') return [name, input.pattern];
  if (name === 'TodoWrite') return ['Plan', (input.todos || []).map((t) => t.content).join(' · ')];
  if (name === 'WebFetch') return ['WebFetch', input.url];
  if (name.startsWith('mcp__')) {
    const [, server, tool] = name.split('__');
    const detail = Object.values(input).filter((v) => typeof v === 'string').join(' ');
    return [server, `${tool}  ${detail}`];
  }
  return [name, JSON.stringify(input)];
}

// Builds the transcript as a list of [delayWeight, line] steps.
const steps = [];
const toolNames = new Map();
let summary = '';
for (const raw of readFileSync(file, 'utf8').split('\n')) {
  if (!raw.startsWith('{')) continue;
  const event = JSON.parse(raw);
  if (event.type === 'assistant') {
    for (const block of event.message.content) {
      if (block.type === 'text' && block.text.trim()) {
        steps.push([4, '']);
        for (const line of wrap(block.text)) steps.push([1, line]);
      } else if (block.type === 'tool_use') {
        toolNames.set(block.id, block.name);
        const [label, detail] = describeTool(block.name, block.input);
        const line = `${ACCENT}●${RESET} ${BOLD}${label}${RESET}  ${clean(detail)}`;
        steps.push([12, line.length > width + 30 ? `${line.slice(0, width + 27)}…` : line]);
      }
    }
  } else if (event.type === 'user' && Array.isArray(event.message.content)) {
    for (const block of event.message.content) {
      if (block.type !== 'tool_result') continue;
      const tool = toolNames.get(block.tool_use_id) || '';
      const body = Array.isArray(block.content)
        ? block.content.filter((c) => c.type === 'text').map((c) => c.text).join('\n')
        : String(block.content ?? '');
      if (block.is_error) {
        steps.push([3, `  ${ACCENT}└ ${clean(body.split('\n')[0]).slice(0, width - 4)}${RESET}`]);
      } else if (['Read', 'Edit', 'Write', 'Skill', 'TodoWrite'].includes(tool)) {
        continue;
      } else {
        const lines = body.split('\n').filter((l) => l.trim());
        for (const l of lines.slice(0, 4)) steps.push([1, `  ${DIM}│ ${clean(l).slice(0, width - 4)}${RESET}`]);
        if (lines.length > 4) steps.push([1, `  ${DIM}│ … ${lines.length - 4} more lines${RESET}`]);
      }
    }
  } else if (event.type === 'result') {
    summary = `${DIM}${event.subtype} · ${event.num_turns} turns · ${Math.round(event.duration_ms / 1000)} s of agent time${RESET}`;
  }
}
if (summary) steps.push([4, ''], [1, summary]);

const totalWeight = steps.reduce((sum, [w]) => sum + w, 0);
const unit = Math.min(60, (seconds * 1000) / Math.max(totalWeight, 1));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [weight, line] of steps) {
  await sleep(weight * unit);
  process.stdout.write(`${line}\n`);
}
