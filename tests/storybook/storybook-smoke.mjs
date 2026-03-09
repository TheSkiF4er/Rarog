import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const baseUrl = process.env.STORYBOOK_URL || 'http://127.0.0.1:6006';
const outputDir = process.env.STORYBOOK_SMOKE_DIR || path.resolve('test-results/storybook-smoke');
const maxStories = Number(process.env.STORYBOOK_SMOKE_MAX || '50');

async function readIndex() {
  const response = await fetch(`${baseUrl}/index.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Storybook index: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function normalizeEntries(index) {
  const entries = index.entries || index.stories || {};
  return Object.entries(entries)
    .filter(([, entry]) => entry?.type === 'story')
    .slice(0, maxStories)
    .map(([id, entry]) => ({
      id,
      title: entry.title || entry.name || id,
      name: entry.name || id
    }));
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

const index = await readIndex();
const stories = normalizeEntries(index);
if (!stories.length) {
  throw new Error('No stories found in Storybook index.json');
}

await ensureDir(outputDir);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const manifest = [];

for (const story of stories) {
  const url = `${baseUrl}/iframe.html?id=${story.id}&viewMode=story`;
  const pageErrors = [];
  page.removeAllListeners('pageerror');
  page.on('pageerror', (error) => {
    pageErrors.push(error.message || String(error));
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);

  const bodyText = await page.locator('body').innerText();
  if (!bodyText.trim()) {
    throw new Error(`Story rendered empty body: ${story.id}`);
  }
  if (pageErrors.length) {
    throw new Error(`Story raised pageerror (${story.id}): ${pageErrors.join(' | ')}`);
  }

  const fileSafeId = story.id.replace(/[^a-z0-9_-]+/gi, '_');
  const screenshotPath = path.join(outputDir, `${fileSafeId}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  manifest.push({
    id: story.id,
    title: story.title,
    name: story.name,
    url,
    screenshot: path.relative(process.cwd(), screenshotPath)
  });
}

await fs.writeFile(
  path.join(outputDir, 'manifest.json'),
  JSON.stringify({ baseUrl, stories: manifest }, null, 2),
  'utf8'
);

await browser.close();
console.log(`Storybook smoke passed for ${stories.length} stories. Artifacts: ${outputDir}`);
