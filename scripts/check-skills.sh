#!/bin/sh
# Validate core/: skill frontmatter (Agent Skills spec limits), relative links,
# obvious secrets, and that the router and the skill folders agree.
# Usage: scripts/check-skills.sh   (exit 1 on any failure)
set -eu

root=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
cd "$root"

fail=0
err() { printf 'FAIL %s\n' "$*"; fail=1; }

# Print the value of a single-line frontmatter key.
fm_value() {
	awk -v key="$2" '
		NR == 1 { if ($0 != "---") exit; next }
		$0 == "---" { exit }
		index($0, key ": ") == 1 { print substr($0, length(key) + 3); exit }
	' "$1"
}

skills=$(find core/skills -name SKILL.md | sort)
[ -n "$skills" ] || err "no skills found under core/skills"

for f in $skills; do
	dir=$(basename "$(dirname "$f")")
	[ "$(head -n 1 "$f")" = "---" ] || { err "$f: missing frontmatter"; continue; }
	[ "$(awk 'NR > 1 && $0 == "---" { print "closed"; exit }' "$f")" = closed ] || err "$f: frontmatter not closed"

	name=$(fm_value "$f" name)
	desc=$(fm_value "$f" description)

	[ "$name" = "$dir" ] || err "$f: name '$name' does not match folder '$dir'"
	printf '%s' "$name" | grep -Eq '^[a-z0-9]+(-[a-z0-9]+)*$' || err "$f: invalid name '$name'"
	[ "${#name}" -le 64 ] || err "$f: name longer than 64 characters"
	[ -n "$desc" ] || err "$f: empty description"
	[ "${#desc}" -le 1024 ] || err "$f: description longer than 1024 characters"
done

# Relative links in core/ must resolve. Fenced code is skipped.
for f in $(find core -name '*.md' | sort); do
	links=$(awk '/^```/ { fence = !fence; next } !fence' "$f" |
		grep -oE '\]\([^)[:space:]]+\)' | sed -e 's/^](//' -e 's/)$//' || true)
	for link in $links; do
		case "$link" in http:* | https:* | mailto:* | '#'*) continue ;; esac
		[ -e "$(dirname "$f")/${link%%#*}" ] || err "$f: broken link $link"
	done
done

# Key-shaped strings that should never be committed.
scan_dirs=core
[ -d adapters ] && scan_dirs="core adapters"
# shellcheck disable=SC2086 # scan_dirs is a space-separated list of fixed names
if grep -rnE '(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY)' $scan_dirs; then
	err "possible secret in core/ or adapters/"
fi

# The router stays small and lists exactly the installed skills.
router=core/rules/router.md
lines=$(wc -l < "$router" | tr -d ' ')
[ "$lines" -le 150 ] || err "$router: $lines lines, budget is 150"
for f in $skills; do
	name=$(basename "$(dirname "$f")")
	grep -q "\`$name\`" "$router" || err "$router: skill $name is not listed"
done
bt='`'
for name in $(grep -oE "${bt}aio-[a-z0-9-]+${bt}" "$router" | tr -d "$bt" | sort -u); do
	printf '%s\n' "$skills" | grep -q "/$name/SKILL.md" || err "$router: lists unknown skill $name"
done

count=$(printf '%s\n' "$skills" | wc -l | tr -d ' ')
if [ "$fail" -eq 0 ]; then
	printf 'OK %s skills, router %s lines\n' "$count" "$lines"
fi
exit "$fail"
