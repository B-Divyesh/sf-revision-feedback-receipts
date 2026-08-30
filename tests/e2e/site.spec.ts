import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('repairs the verifier landing, demo, metadata, and 404 findings', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Revision Receipts — Compare draft changes');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Create receipts from draft changes.');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://revision-feedback-receipts.sociobot.in/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /receipt-social\.jpg$/);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
  await expect(page.getByText('Built by Param Factory · Build 2026.08.30.')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Revision Receipts');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://revision-feedback-receipts.sociobot.in/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved', { exact: false })).toBeVisible();
  await expect(page.locator('.hero')).toBeHidden();
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
    for (const path of ['/', '/demo', '/404.html']) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
    }
  }
});
