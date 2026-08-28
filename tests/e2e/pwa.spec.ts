import { expect, test } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function precacheUrls(): string[] {
  const worker = readFileSync(resolve('dist/sw.js'), 'utf8');
  const match = worker.match(/const SHELL=(\[[^;]+\]);/);
  if (!match) throw new Error('The production service worker does not declare its precache shell.');
  return JSON.parse(match[1]) as string[];
}

test('production service worker precaches emitted files, updates, and serves offline', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The production service worker is covered once in Chromium; mobile uses the same shell.');

  const shell = precacheUrls();
  const staleCandidateUrls = [
    '/assets/privacy-CSUSwM90.js',
    '/assets/terms-CSUSwM90.js',
    '/assets/legal-CYClypZu.js',
    '/assets/legal-CYClypZu.js.map',
  ];
  expect(shell.filter((url) => staleCandidateUrls.includes(url))).toEqual([]);
  expect(shell).not.toContainEqual(expect.stringMatching(/\.map$/));
  expect(new Set(shell).size).toBe(shell.length);
  expect(shell.length).toBeGreaterThan(8);
  for (const url of shell) {
    const outputPath = resolve('dist', url === '/' ? 'index.html' : url.endsWith('/') ? `${url.slice(1)}index.html` : url.slice(1));
    expect(existsSync(outputPath), `${url} must be emitted before it is precached`).toBe(true);
    const response = await page.request.get(url);
    expect(response.status(), `${url} must return 200 before it is precached`).toBe(200);
  }

  await page.goto('/');
  await expect.poll(async () => page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active?.state;
  }), { timeout: 10_000 }).toBe('activated');
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller)), { timeout: 10_000 }).toBe(true);

  const updateToken = `regression-${Date.now()}`;
  await page.evaluate(async (token) => {
    await navigator.serviceWorker.register(`/sw.js?${token}`);
  }, updateToken);
  await expect.poll(() => page.evaluate((token) => navigator.serviceWorker.getRegistration()
    .then((registration) => registration?.active?.scriptURL.includes(token) ?? false), updateToken), { timeout: 10_000 }).toBe(true);
  await expect.poll(() => page.evaluate((token) => navigator.serviceWorker.controller?.scriptURL.includes(token) ?? false, updateToken),
    { timeout: 10_000 }).toBe(true);

  await context.setOffline(true);
  try {
    await page.reload();
    await expect(page).toHaveTitle(/Revision Receipts/);
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  } finally {
    await context.setOffline(false);
  }
});
