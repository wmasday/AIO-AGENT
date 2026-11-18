# Security policy

## Reporting a vulnerability

Report vulnerabilities privately through GitHub's private vulnerability reporting:

1. Open the [Security tab](https://github.com/wmasday/AIO-AGENT/security) of this repository.
2. Choose **Report a vulnerability**.

Do not open a public issue for a security problem.

Include the affected file or script, the platform and agent you used, steps to reproduce, and the impact you expect.

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x | Yes |

The latest release is listed on the [releases page](https://github.com/wmasday/AIO-AGENT/releases) and on [npm](https://www.npmjs.com/package/aio-agent). Fixes land on `main` and in the next patch release.

## Intentionally vulnerable sample

`examples/vulnerable/` contains a SQL injection and a reflected XSS on purpose, for the security review and pentest demos. It binds to 127.0.0.1 and is not part of the npm package. Reports about those two seeded flaws are not vulnerabilities in AIO-AGENT; anything else in that sample, such as it listening on another address, is.
