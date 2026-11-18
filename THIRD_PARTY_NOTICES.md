# Third-party notices

AIO-AGENT's skills are written for this project. Several are adapted from the open-source work listed below: their structure and guidance were merged, shortened and rewritten, and no file was copied unchanged. Each adapted `SKILL.md` ends with a line naming its sources. Commits are the ones listed in [SOURCES.md](SOURCES.md).

Tools that AIO-AGENT only tells the agent to run (Shannon, Strix, SkillSpector, Context7, Magic, Chrome DevTools MCP, modern-web-guidance, impeccable's detector) are not redistributed. They come under their own licenses when the user installs or runs them.

## MIT License

| Source | Copyright | Adapted into |
| --- | --- | --- |
| [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) | Copyright (c) 2026 Miqdad Badjuber (antislop) | `aio-plain-output`, `aio-frontend-design` |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | Copyright (c) 2026 DietrichGebert | `aio-lean`, `aio-review` |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Copyright (c) 2024 Next Level Builder | `aio-frontend-design` |
| [obra/superpowers](https://github.com/obra/superpowers) | Copyright (c) 2025 Jesse Vincent | `aio-brainstorm`, `aio-plan`, `aio-execute`, `aio-debug`, `aio-tdd`, `aio-verify`, `aio-review` |
| [mattpocock/skills](https://github.com/mattpocock/skills) | Copyright (c) 2026 Matt Pocock | `aio-grill` |
| [upstash/context7](https://github.com/upstash/context7) | Copyright (c) 2021 Upstash, Inc. | `aio-library-docs` |

Each of these sources is distributed under the following terms:

```text
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## ISC License

| Source | Copyright | Adapted into |
| --- | --- | --- |
| [21st-dev/magic-mcp](https://github.com/21st-dev/magic-mcp) | Copyright (c) 2026 21st.dev | `aio-ui-components` |

```text
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

## Apache License 2.0

The full license text is in [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt). The adapted files are modified: each was merged with other sources and rewritten, as its closing line states.

| Source | Notice | Adapted into |
| --- | --- | --- |
| [GoogleChrome/modern-web-guidance](https://github.com/googlechrome/modern-web-guidance) | No NOTICE file | `aio-modern-web` |
| [juliusbrussee/caveman](https://github.com/juliusbrussee/caveman) | "Caveman, Copyright 2026 Julius Brussee". "Caveman" is a trademark of Julius Brussee and is not used as a name in AIO-AGENT. | `aio-terse`, `aio-lean` |
| [anthropics/claude-plugins-official, `claude-code-setup`](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup) | No NOTICE file | `aio-setup` |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Its NOTICE.md covers the iOS and Android reference files, which AIO-AGENT does not use | `aio-frontend-design` |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | No NOTICE file | `aio-browser-debug` |
