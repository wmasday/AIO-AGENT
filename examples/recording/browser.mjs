#!/usr/bin/env node
// Records a browser clip of one or more pages, captioned, with keyboard focus moved through each.
// Usage: node browser.mjs <demo> "<caption>=<url>" ["<caption>=<url>" ...]
// Writes docs/media/<demo>.mp4, <demo>.gif and a 2x still per page (<demo>-1.png, ...).
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const [demo, ...pages] = process.argv.slice(2);
const media = resolve(process.env.MEDIA || new URL('../../docs/media', import.meta.url).pathname);
const videoDir = mkdtempSync(join(tmpdir(), 'aio-demo-'));
const size = { width: 1280, height: 720 };

const browser = await chromium.launch({ channel: 'chrome' });

// Stills at 2x for the docs.
const stills = await browser.newContext({ viewport: size, deviceScaleFactor: 2 });
for (const [i, spec] of pages.entries()) {
  const page = await stills.newPage();
  await page.goto(spec.slice(spec.indexOf('=') + 1), { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(media, `${demo}-${i + 1}.png`), fullPage: true });
  await page.close();
}
await stills.close();

// Playwright's own video recorder needs a downloaded ffmpeg, so frames come from Chrome's screencast instead.
const context = await browser.newContext({ viewport: size });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
const frames = [];
cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
  const file = join(videoDir, `f${String(frames.length).padStart(5, '0')}.jpg`);
  writeFileSync(file, Buffer.from(data, 'base64'));
  frames.push({ file, t: metadata.timestamp });
  cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: size.width, maxHeight: size.height });
for (const spec of pages) {
  const caption = spec.slice(0, spec.indexOf('='));
  await page.goto(spec.slice(spec.indexOf('=') + 1), { waitUntil: 'networkidle' });
  await page.evaluate((text) => {
    const tag = document.createElement('div');
    tag.textContent = text;
    tag.setAttribute('style', 'position:fixed;top:16px;right:16px;z-index:99999;padding:6px 12px;font:600 14px system-ui;background:#0B0B0C;color:#F7F6F2;border-left:4px solid #E5532D');
    document.body.append(tag);
  }, caption);
  await page.waitForTimeout(1800);
  // Keyboard pass: shows whether fields are labelled and focus is visible.
  for (let i = 0; i < 5; i += 1) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(2000);
}
await cdp.send('Page.stopScreencast');
frames.push({ file: frames.at(-1).file, t: frames.at(-1).t + 1 });
await context.close();
await browser.close();

// Chrome only sends a frame when the page changes, so each frame is held until the next one.
const list = frames.slice(0, -1).map((f, i) => `file '${f.file}'\nduration ${(frames[i + 1].t - f.t).toFixed(3)}`);
const src = join(videoDir, 'frames.txt');
writeFileSync(src, `${list.join('\n')}\nfile '${frames.at(-1).file}'\n`);
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', src, '-r', '24', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=white', '-movflags', '+faststart', join(media, `${demo}.mp4`)]);
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', src, '-vf', 'fps=8,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle', join(media, `${demo}.gif`)]);
console.log(`wrote ${demo}.mp4, ${demo}.gif and ${pages.length} still(s) to ${media}`);
