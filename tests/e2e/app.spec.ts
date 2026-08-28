import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('creates a complete student revision receipt', async ({ page }, testInfo) => {
  await expect(page).toHaveTitle(/Revision Receipts/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

  await page.getByLabel('Student name').fill('Jordan K.');
  await page.getByLabel('Assignment').fill('Community park argument');
  await page.getByLabel('Feedback goal 1').fill('Use specific evidence to support the claim');
  await page.getByRole('button', { name: 'Add another goal' }).click();
  await page.getByLabel('Feedback goal 2', { exact: true }).fill('Explain how the evidence connects to the claim');
  await page.getByLabel('First draft text').fill('Our town needs a park. Parks are good. This would help everyone.');
  await page.locator('#revised-file').setInputFiles({
    name: 'revision.md',
    mimeType: 'text/markdown',
    buffer: Buffer.from('Our town needs a park. A 2025 survey found that 68 percent of residents lack a nearby green space. This would help everyone. The evidence makes the need concrete.'),
  });
  await page.getByRole('button', { name: 'Find changed passages' }).click();

  await expect(page.getByRole('heading', { name: 'Connect change to intention' })).toBeVisible();
  await expect(page.locator('.change-card')).toHaveCount(2);
  await page.getByLabel('Strongest changed passage').nth(0).selectOption('change-1');
  await page.getByLabel('Strongest changed passage').nth(1).selectOption('change-2');
  await page.getByLabel('What did you change, and why?').nth(0).fill('I replaced a vague statement with survey evidence so the claim is supported by a specific fact.');
  await page.getByLabel('What did you change, and why?').nth(1).fill('I added a final sentence that explains why the evidence matters to the town.');
  await page.getByRole('button', { name: 'Finish the receipt' }).click();

  await expect(page.getByRole('heading', { name: 'Ready for review' })).toBeVisible();
  await expect(page.locator('.receipt-goal')).toHaveCount(2);
  await expect(page.locator('.receipt-goal').first()).toContainText('survey evidence');
  await expect(page.getByRole('button', { name: 'Download receipt' })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download receipt' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('jordan-k-community-park-argument-receipt.html');

  if (testInfo.project.name === 'chromium') {
    const results = await new AxeBuilder({ page }).exclude('.hero-art').analyze();
    expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
  }
});

test('explains validation errors and keeps work locally', async ({ page }) => {
  await page.getByRole('button', { name: 'Find changed passages' }).click();
  await expect(page.getByRole('alert')).toContainText('Add the student name');
  await page.getByLabel('Student name').fill('A. Student');
  await page.waitForTimeout(250);
  await page.reload();
  await expect(page.getByLabel('Student name')).toHaveValue('A. Student');
});

test('keeps maximum-length unbroken content usable at 390px and in the export', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'This regression exercises the 390px mobile boundary.');

  await expect(page.evaluate(() => window.innerWidth)).resolves.toBe(390);
  const homeTarget = await page.getByRole('link', { name: 'Revision Receipts home' }).boundingBox();
  expect(homeTarget?.height).toBeGreaterThanOrEqual(44);
  expect(homeTarget?.width).toBeGreaterThanOrEqual(44);

  await page.getByLabel('Student name').fill('S'.repeat(80));
  await page.getByLabel('Assignment').fill('A'.repeat(120));
  await page.getByLabel('Feedback goal 1').fill('G'.repeat(180));
  await page.getByLabel('First draft text').fill('Before sentence.');
  await page.getByLabel('Revised draft text').fill('After sentence.');
  await page.getByRole('button', { name: 'Find changed passages' }).click();
  await page.getByLabel('Strongest changed passage').selectOption({ index: 1 });
  await page.getByLabel('What did you change, and why?').fill('R'.repeat(800));

  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
  await page.getByRole('button', { name: 'Finish the receipt' }).click();

  await expect(page.getByRole('heading', { name: 'Ready for review' })).toBeVisible();
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download receipt' }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const receiptPage = await context.newPage();
  await receiptPage.setContent(await readFile(downloadPath!, 'utf8'));
  await expect(receiptPage.evaluate(() => window.innerWidth)).resolves.toBe(390);
  await expect(receiptPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
});

test('legal pages have required landmarks and no serious accessibility issues', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Covered once; responsive legal layout is static CSS.');
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? ''))).toEqual([]);
  }
});
