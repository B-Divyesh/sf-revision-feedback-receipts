import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('repairs the verifier landing, demo, metadata, and 404 findings', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Revision Receipts — Compare draft changes');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Create receipts from draft changes.');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toHaveAttribute('href', '/?demo=1');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://revision-feedback-receipts.sociobot.in/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /receipt-social\.jpg$/);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  await expect(page.getByText('Built by Param Factory · Build 2026.08.30.')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Revision Receipts');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://revision-feedback-receipts.sociobot.in/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved', { exact: false })).toBeVisible();
  await expect(page.locator('.hero')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1, name: 'Try a completed revision receipt' })).toBeVisible();
  await expect(page.locator('h1:visible')).toHaveCount(1);
  const visibleHeadingLevels = await page.locator('h1:visible, h2:visible, h3:visible, h4:visible').evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))));
  visibleHeadingLevels.reduce((previous, current) => {
    expect(current, `heading level after h${previous}`).toBeLessThanOrEqual(previous + 1);
    return current;
  }, 1);
  await expect(page.getByLabel('Student name')).toHaveValue('Jordan K.');

  for (const [path, title, canonical] of [
    ['/privacy/', 'Privacy — Revision Receipts', 'https://revision-feedback-receipts.sociobot.in/privacy/'],
    ['/terms/', 'Terms — Revision Receipts', 'https://revision-feedback-receipts.sociobot.in/terms/'],
  ]) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  }

  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Revision Receipts');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://revision-feedback-receipts.sociobot.in/404');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page does not exist');
  await expect(page.getByRole('link', { name: 'Start a blank receipt' })).toBeVisible();

  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8')) as {
    responseOverrides?: Record<string, { rewrite?: string; statusCode?: number }>;
    routes?: Array<{ route?: string; rewrite?: string }>;
  };
  expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  expect(config.routes).toContainEqual({ route: '/demo', rewrite: '/demo/index.html' });
  expect(config).not.toHaveProperty('navigationFallback');

  if (testInfo.project.name === 'chromium') {
    for (const path of ['/', '/demo', '/privacy/', '/terms/', '/404.html']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations, `axe violations at ${path}`).toEqual([]);
    }
  }
});

test('keeps one usable mobile header on every route', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'This checks the shared 390px header treatment.');
  const expectedLabels = ['Try the demo', 'Make a receipt', 'Privacy'];

  for (const path of ['/', '/demo', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    const header = page.locator('body > header');
    await expect(header.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveText(expectedLabels);
    for (const control of await header.getByRole('link').all()) {
      const label = (await control.getAttribute('aria-label')) ?? (await control.textContent()) ?? 'header link';
      const box = await control.boundingBox();
      expect(box, `${label} at ${path}`).not.toBeNull();
      expect(box!.width, `${label} width at ${path}`).toBeGreaterThanOrEqual(44);
      expect(box!.height, `${label} height at ${path}`).toBeGreaterThanOrEqual(44);
    }
    await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
  }
});

test('keeps the full first-screen promise visible at 390 by 844', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'This is the required 390×844 first-screen regression.');
  await page.goto('/');
  const required = [
    page.getByRole('heading', { level: 1, name: 'Create receipts from draft changes.' }),
    page.getByText('For writing teachers who need a quick record of how students used feedback.'),
    page.getByRole('link', { name: 'Try it with sample data' }),
    page.getByText('Loads a completed sample; your real browser work stays separate.'),
    page.getByText('Drafts are compared in this browser.'),
    page.getByText('No account needed.'),
    page.getByText('No automatic score.'),
  ];
  for (const locator of required) {
    const label = (await locator.textContent()) ?? 'required first-screen content';
    const box = await locator.boundingBox();
    expect(box, label).not.toBeNull();
    expect(box!.y + box!.height, label).toBeLessThanOrEqual(844);
  }
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
});

test('moves focus to page headings across links and browser history', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Focus navigation behavior is viewport independent.');
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('#route-status')).toHaveText('How Revision Receipts handles your data');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('keeps reviewed copy and documentation precise', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Drafts stay in this browser', { exact: true })).toBeVisible();
  await expect(page.getByText('Private by default', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Keep one to three feedback goals beside the drafts.', { exact: true })).toBeVisible();
  await expect(page.getByText('Compare two drafts and save a revision receipt.', { exact: true })).toBeVisible();

  const readme = await readFile('README.md', 'utf8');
  const demo = await readFile('.factory/demo.md', 'utf8');
  const packageJson = JSON.parse(await readFile('package.json', 'utf8')) as { engines?: { node?: string } };
  for (const document of [readme, demo]) {
    expect(document).toContain('Start for real** deletes the demo copy and opens your saved browser work.');
    expect(document).toContain('If none exists, it opens a blank receipt.');
    expect(document).not.toContain('returns to the empty tool');
    expect(document).not.toContain('opens the empty real workspace');
  }
  expect(readme).toContain('The sample is stored separately from your own work.');
  expect(readme).toContain('The build caches the site files needed for offline use.');
  expect(readme).toContain('Requires Node.js 20.19+ or 22.12+.');
  expect(packageJson.engines?.node).toBe('^20.19.0 || >=22.12.0');
});
