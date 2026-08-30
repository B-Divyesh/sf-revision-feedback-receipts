import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const REAL_STORAGE_KEY = 'revision-receipts-work-v1';
const DEMO_STORAGE_KEY = 'demo:revision-receipts-work-v1';

async function openCleanDemo(page: Page): Promise<void> {
  await page.goto('/demo');
  await page.evaluate(([realKey, demoKey]) => {
    localStorage.removeItem(realKey);
    localStorage.removeItem(demoKey);
  }, [REAL_STORAGE_KEY, DEMO_STORAGE_KEY]);
  await page.reload();
  await expect(page).toHaveTitle('Demo — Revision Receipts');
  await expect(page.getByRole('heading', { name: 'Connect change to intention' })).toBeVisible();
}

async function finishSampleReceipt(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Finish the receipt' }).click();
  await expect(page.getByRole('heading', { name: 'Ready for review' })).toBeVisible();
}

test('@claim:demo-sandbox Try the sample without changing real browser work', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({
    studentName: 'Real student', assignmentName: 'Real assignment', goals: ['Real goal'],
    originalDraft: 'First.', revisedDraft: 'Second.', selections: [], reflections: [], phase: 'drafts',
  })), REAL_STORAGE_KEY);

  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Revision Receipts');
  await expect(page.getByText('Demo — sample data, nothing is saved', { exact: false })).toBeVisible();
  await expect(page.getByLabel('Student name')).toHaveValue('Jordan K.');
  await expect(page.getByLabel('Feedback goal 1', { exact: true })).toHaveValue('Use specific evidence to support the claim');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' })).toBeVisible();

  await page.getByLabel('Student name').fill('Changed sample');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Student name')).toHaveValue('Jordan K.');

  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveTitle('Revision Receipts — Compare draft changes');
  await expect(page.getByLabel('Student name')).toHaveValue('Real student');
  const realAndDemoStorage = page.evaluate(({ realKey, demoKey }) => ({ real: localStorage.getItem(realKey), demo: localStorage.getItem(demoKey) }), {
    realKey: REAL_STORAGE_KEY,
    demoKey: DEMO_STORAGE_KEY,
  });
  await expect(realAndDemoStorage).resolves.toMatchObject({ real: expect.stringContaining('Real student'), demo: null });
});

test('@claim:no-account A sample receipt needs no account', async ({ page }) => {
  await openCleanDemo(page);
  await expect(page.getByRole('link', { name: /sign in|log in|create account/i })).toHaveCount(0);
  await finishSampleReceipt(page);
  await expect(page.locator('.receipt-goal')).toHaveCount(2);
});

test('@claim:revision-workflow The sample compares drafts against feedback goals and records reflections', async ({ page }) => {
  await openCleanDemo(page);
  await expect(page.locator('.change-card')).toHaveCount(2);
  await expect(page.getByLabel('Strongest changed passage *')).toHaveCount(2);
  await expect(page.getByLabel('What did you change, and why? *')).toHaveCount(2);
  await finishSampleReceipt(page);
  await expect(page.locator('.receipt-goal')).toHaveCount(2);
});

test('@claim:browser-only Demo draft text stays on this site', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await openCleanDemo(page);
  await finishSampleReceipt(page);

  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  const realAndDemoStorage = page.evaluate(({ realKey, demoKey }) => ({ real: localStorage.getItem(realKey), demo: localStorage.getItem(demoKey) }), {
    realKey: REAL_STORAGE_KEY,
    demoKey: DEMO_STORAGE_KEY,
  });
  await expect(realAndDemoStorage).resolves.toMatchObject({ real: null, demo: expect.stringContaining('Jordan K.') });
});

test('@claim:local-autosave Unfinished demo work is saved in browser storage', async ({ page }) => {
  await openCleanDemo(page);
  await page.getByLabel('Student name').fill('Saved demo learner');
  await page.waitForTimeout(250);
  await page.reload();
  await expect(page.getByLabel('Student name')).toHaveValue('Saved demo learner');
  await expect(page.evaluate((key) => localStorage.getItem(key), DEMO_STORAGE_KEY)).resolves.toContain('Saved demo learner');
});

test('@claim:receipt-export The sample exports a portable HTML receipt', async ({ page }) => {
  await openCleanDemo(page);
  await finishSampleReceipt(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download receipt' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('jordan-k-community-park-argument-receipt.html');
  const file = await readFile((await download.path())!, 'utf8');
  expect(file).toContain('A 2025 survey found that 68 percent of residents lack a nearby green space.');
  expect(file).toContain('I added a sentence that explains why the survey matters to the town.');
  expect(file).not.toMatch(/<script|https?:\/\//i);
});

test('@claim:evidence-not-score The receipt shows evidence and reflection, not a score', async ({ page }) => {
  await openCleanDemo(page);
  await finishSampleReceipt(page);
  const receipt = page.locator('#receipt');
  await expect(receipt).toContainText('Before');
  await expect(receipt).toContainText('After');
  await expect(receipt).toContainText('Student reflection');
  await expect(receipt).not.toContainText(/score|grade/i);
});

test('@claim:human-review-limit The sample receipt states its limits for human review', async ({ page }) => {
  await openCleanDemo(page);
  await finishSampleReceipt(page);
  await expect(page.locator('.receipt-caveat')).toContainText('not proof of learning, authorship, or quality');
  await expect(page.locator('.receipt-caveat')).toContainText('evidence for a conversation');
});

test('@claim:no-writing-generation The receipt only quotes supplied draft passages and reflections', async ({ page }) => {
  await openCleanDemo(page);
  await finishSampleReceipt(page);
  const receipt = page.locator('#receipt');
  await expect(receipt).toContainText('Parks are good.');
  await expect(receipt).toContainText('A 2025 survey found that 68 percent of residents lack a nearby green space.');
  await expect(receipt).toContainText('I replaced a vague statement with survey evidence so the claim uses a specific fact.');
});
