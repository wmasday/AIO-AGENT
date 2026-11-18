#!/usr/bin/env bash
# Runs one real Claude Code turn for a demo and saves its stream-json log.
# Usage: run.sh <demo> <sample: app|vulnerable> <turn> "<prompt>" [extra claude args...]
# Turn 1 copies the sample into a fresh work directory; later turns continue that session.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
demo="$1" sample="$2" turn="$3" prompt="$4"
shift 4
work_root="${DEMO_WORK:?set DEMO_WORK to a scratch directory outside the repository}"
work="$work_root/$demo"
logs="$here/sessions"
mkdir -p "$logs"

if [ "$turn" = 1 ]; then
  [ -e "$work" ] && { echo "$work exists; remove it first" >&2; exit 1; }
  cp -R "$here/../$sample" "$work"
  git -C "$work" init -q
  git -C "$work" add -A
  git -C "$work" -c user.name=demo -c user.email=demo@example.invalid commit -qm "Sample as shipped"
  continue_flag=()
else
  continue_flag=(--continue)
fi

cd "$work"
# Plugins outside AIO-AGENT are switched off so the recording shows only its skills.
claude -p "$prompt" "${continue_flag[@]}" \
  --output-format stream-json --verbose \
  --settings '{"enabledPlugins":{"ponytail@ponytail":false}}' \
  "$@" < /dev/null > "$logs/$demo.$turn.jsonl"

echo "$(date -u +%FT%TZ) $demo turn $turn: $(tail -1 "$logs/$demo.$turn.jsonl" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const r=JSON.parse(s);console.log(r.subtype, r.num_turns+" turns", Math.round(r.duration_ms/1000)+"s")})')" | tee -a "$logs/runs.log"
