#!/usr/bin/env bash
# Renders saved demo sessions to docs/media/<demo>.mp4 and .gif with VHS.
# Usage: record.sh <demo> <shown dir> <seconds per turn> "<prompt turn 1>" ["<prompt turn 2>" ...]
# A prompt that starts with "--continue " is shown as a follow-up turn.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
demo="$1" shown="$2" seconds="$3"
shift 3
media="${MEDIA:-$here/../../docs/media}"
tape="$here/sessions/$demo.tape"
mkdir -p "$media" "$here/sessions"

{
  cat <<EOF
Output "$media/$demo.mp4"
Set Shell bash
Set Width 1280
Set Height 720
Set FontSize 17
Set Padding 28
Set Framerate 24
Set TypingSpeed 18ms
Set Theme { "name": "aio", "background": "#0B0B0C", "foreground": "#F7F6F2", "cursor": "#E5532D", "selection": "#3A3A38", "black": "#0B0B0C", "red": "#E5532D", "green": "#8FBF7F", "yellow": "#E0B060", "blue": "#7FA7D9", "magenta": "#C793C7", "cyan": "#7FC7C7", "white": "#F7F6F2", "brightBlack": "#6E6D68", "brightRed": "#F07050", "brightGreen": "#A8D898", "brightYellow": "#F0C878", "brightBlue": "#98BFF0", "brightMagenta": "#DDA8DD", "brightCyan": "#98DDDD", "brightWhite": "#FFFFFF" }
Hide
Type \`cd '$here' && export PS1='$shown \$ ' && n=0 && claude() { n=\$((n+1)); node replay.mjs "sessions/$demo.\$n.jsonl" --seconds $seconds --root "\$DEMO_WORK/$demo"; } && clear\`
Enter
Sleep 500ms
Show
EOF
  for prompt in "$@"; do
    if [[ $prompt == --continue\ * ]]; then
      shown_cmd="claude -p --continue \"${prompt#--continue }\""
    else
      shown_cmd="claude -p \"$prompt\""
    fi
    # VHS strings cannot hold a backtick inside backticks; prompts avoid them.
    # shellcheck disable=SC2016 # the backticks and $ are VHS syntax, not shell
    printf 'Type `%s`\nSleep 400ms\nEnter\nWait@%ss /\\$$/\nSleep 2500ms\n' "$shown_cmd" "$((seconds + 30))"
  done
  printf 'Sleep 1500ms\n'
} > "$tape"

DEMO_WORK="${DEMO_WORK:?set DEMO_WORK}" vhs "$tape"

# GIF for the README: 960 px wide, 12 fps, palette tuned for text.
ffmpeg -loglevel error -y -i "$media/$demo.mp4" \
  -vf "fps=12,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle" \
  "$media/$demo.gif"
wc -c "$media/$demo.mp4" "$media/$demo.gif"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$media/$demo.mp4"
