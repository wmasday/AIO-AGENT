# Updating and uninstalling

## Update

```sh
AIO-AGENT/scripts/update.sh
```

This runs `git pull --ff-only` in the checkout, then the installer. Only files whose content changed are rewritten.

On Windows: `.\AIO-AGENT\scripts\update.ps1`.

## Pin a version

Check out a release tag, then install:

```sh
git -C AIO-AGENT fetch --tags
git -C AIO-AGENT checkout v0.1.0
AIO-AGENT/scripts/install.sh
```

`update.sh` will not pull while a tag is checked out. To follow `main` again: `git -C AIO-AGENT checkout main`.

The upstream tools AIO-AGENT runs are pinned in the skills and in `core/mcp/servers.yaml`, for example `chrome-devtools-mcp@1.13.0`. Their versions change only with an AIO-AGENT release.

## Roll back

Check out the earlier tag and run the installer. It replaces the skill folders and rule blocks it manages with the older content.

## Uninstall

```sh
AIO-AGENT/scripts/uninstall.sh
```

Uninstall reads `~/.aio-agent/state.json` and:

1. removes the MCP servers AIO-AGENT added to Claude Code (`claude mcp remove`);
2. deletes the skill folders it installed. Each carries a `.aio-agent` marker file, and folders without one are never touched;
3. for each config file it changed:
   - unchanged since the install: restores the original from `<file>.bak-<timestamp>` byte for byte and deletes the backup, or deletes the file if AIO-AGENT created it;
   - edited since the install: removes only the AIO-AGENT block or MCP entries, keeps your edits, and keeps the backup;
4. removes folders it created that are now empty, and `~/.aio-agent`.
