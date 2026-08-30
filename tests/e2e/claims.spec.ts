import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const REAL_STORAGE_KEY = 'revision-receipts-work-v1';
const DEMO_STORAGE_KEY = 'demo:revision-receipts-work-v1';

async function openCleanDemo(page: Page): Promise<void> {
  await page.goto('/?demo=1');
  await page.evaluate(([realKey, demoKey]) => {
    localStorage.removeItem(realKey);
    localStorage.removeItem(demoKey);
  }, [REAL_STORAGE_KEY, DEMO_STORAGE_KEY]);
  await page.reload();
  await expect(page).toHaveTitle('Demo — Revision Receipts');
  await expect(page.getByRole('heading', { level: 1, name: 'Review a sample revision receipt' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Explain why each passage changed' })).toBeVisible();
}

async function finishSampleReceipt(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Finish the receipt' }).click();
  await expect(page.getByRole('heading', { name: 'Review the finished revision receipt' })).toBeVisible();
}

test('@claim:demo-sandbox Try the sample without changing real browser work', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({
    studentName: 'Real student', assignmentName: 'Real assignment', goals: ['Real goal'],
    originalDraft: 'First.', revisedDraft: 'Second.', selections: [], reflections: [], phase: 'drafts',
  })), REAL_STORAGE_KEY);

  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page).toHaveTitle('Demo — Revision Receipts');
  await expect(page.getByText('Demo — sample data, nothing is saved', { exact: false })).toBeVisible();
  await expect(page.locator('#demo-evidence-preview')).toBeVisible();
  await expect(page.locator('#receipt-output')).toBeVisible();
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

test('@claim:free-use The sample can be completed and exported without payment', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await openCleanDemo(page);
  await expect(page.getByRole('link', { name: /buy|subscribe|pay|upgrade/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /buy|subscribe|pay|upgrade/i })).toHaveCount(0);
  await finishSampleReceipt(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download receipt' }).click();
  await downloadPromise;
  expect(requests.some((url) => /billing|checkout|payment/i.test(url))).toBe(false);
});

test('@claim:revision-workflow The sample compares drafts against feedback goals and records reflections', async ({ page }) => {
  await openCleanDemo(page);
  await expect(page.locator('#demo-evidence-preview')).toContainText('Use specific evidence to support the claim');
  await expect(page.locator('#demo-evidence-preview')).toContainText('A 2025 survey found that 68 percent of residents lack a nearby green space.');
  await expect(page.locator('#demo-evidence-preview')).toContainText('I replaced a vague statement with survey evidence');
  await expect(page.locator('#receipt-output')).toBeVisible();
  await expect(page.locator('.change-card')).toHaveCount(2);
  await expect(page.getByLabel('Strongest changed passage *')).toHaveCount(2);
  await expect(page.getByLabel('What did you change, and why? *')).toHaveCount(2);
  await finishSampleReceipt(page);
  await expect(page.locator('.receipt-goal')).toHaveCount(2);
});

test('@claim:browser-only Demo drafts stay in the demo browser storage namespace', async ({ page }) => {
  await openCleanDemo(page);
  const realAndDemoStorage = page.evaluate(({ realKey, demoKey }) => ({ real: localStorage.getItem(realKey), demo: localStorage.getItem(demoKey) }), {
    realKey: REAL_STORAGE_KEY,
    demoKey: DEMO_STORAGE_KEY,
  });
  await expect(realAndDemoStorage).resolves.toMatchObject({ real: null, demo: expect.stringContaining('Jordan K.') });
});

type RequestRecord = {
  url: string;
  method: string;
  resourceType: string;
  headers: Record<string, string>;
  body: string;
};

function recordNetwork(page: Page): { requests: RequestRecord[]; webSockets: string[] } {
  const requests: RequestRecord[] = [];
  const webSockets: string[] = [];
  page.on('request', (request) => {
    requests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      headers: request.headers(),
      body: request.postData() ?? '',
    });
  });
  page.on('websocket', (socket) => webSockets.push(socket.url()));
  return { requests, webSockets };
}

async function openAndExportSample(page: Page): Promise<void> {
  await openCleanDemo(page);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download sample receipt' }).click();
  await downloadPromise;
  await page.waitForTimeout(150);
}

test('@claim:no-classroom-content-transmission The completed sample sends no classroom content', async ({ page }) => {
  const audit = recordNetwork(page);
  await openAndExportSample(page);

  expect(audit.requests.length).toBeGreaterThan(0);
  expect(audit.webSockets).toEqual([]);
  const classroomStrings = [
    'Jordan K.',
    'Community park argument',
    'Use specific evidence to support the claim',
    'Parks are good.',
    'A 2025 survey found that 68 percent of residents lack a nearby green space.',
    'I replaced a vague statement with survey evidence so the claim uses a specific fact.',
  ];
  for (const request of audit.requests) {
    expect(new URL(request.url).origin).toBe('http://127.0.0.1:4173');
    expect(request.resourceType).not.toMatch(/^(fetch|xhr|ping|websocket)$/);
    expect(request.method).toBe('GET');
    expect(request.body).toBe('');
    const requestText = `${request.url}\n${JSON.stringify(request.headers)}\n${request.body}`;
    for (const classroomString of classroomStrings) expect(requestText).not.toContain(classroomString);
  }
});

test('@claim:no-analytics-tracking The completed sample adds no analytics or tracking', async ({ page, context }) => {
  const audit = recordNetwork(page);
  await openAndExportSample(page);
  const pageState = await page.evaluate(() => ({
    cookie: document.cookie,
    localStorageKeys: Object.keys(localStorage),
    sessionStorageKeys: Object.keys(sessionStorage),
    scriptSources: [...document.scripts].map((script) => script.src).filter(Boolean),
    resourceUrls: performance.getEntriesByType('resource').map((entry) => entry.name),
  }));
  const trackingPattern = /analytics|tracking|telemetry|metric|segment|amplitude|mixpanel|sentry|hotjar|clarity|pixel/i;

  expect(audit.webSockets).toEqual([]);
  for (const request of audit.requests) {
    expect(new URL(request.url).origin).toBe('http://127.0.0.1:4173');
    expect(request.resourceType).not.toMatch(/^(fetch|xhr|ping|websocket)$/);
    expect(request.url).not.toMatch(trackingPattern);
  }
  expect(pageState.cookie).toBe('');
  expect(pageState.localStorageKeys).toEqual([DEMO_STORAGE_KEY]);
  expect(pageState.sessionStorageKeys).toEqual([]);
  expect(pageState.scriptSources.every((source) => new URL(source).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(pageState.resourceUrls.every((url) => !trackingPattern.test(url))).toBe(true);
  expect(await context.cookies()).toEqual([]);
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
  expect(file).toContain('<h1>Revision receipt for Jordan K.</h1>');
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

test('@claim:no-plagiarism-detection The workflow produces no plagiarism check or result', async ({ page }) => {
  await openCleanDemo(page);
  await expect(page.getByRole('button', { name: /plagiarism/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /plagiarism/i })).toHaveCount(0);
  await finishSampleReceipt(page);
  await expect(page.locator('#receipt')).not.toContainText(/plagiarism/i);
});

test('@claim:clear-real-work Clearing real work preserves the demo namespace', async ({ page }) => {
  const completeRealState = {
    studentName: 'Real student', assignmentName: 'Real assignment', goals: ['Use evidence'],
    originalDraft: 'The claim needs proof.', revisedDraft: 'The claim uses survey proof.',
    selections: ['change-1'], reflections: ['I added survey proof.'], phase: 'receipt',
  };
  await page.goto('/');
  await page.evaluate(({ realKey, demoKey, realState }) => {
    localStorage.setItem(realKey, JSON.stringify(realState));
    localStorage.setItem(demoKey, 'preserve-this-demo');
  }, { realKey: REAL_STORAGE_KEY, demoKey: DEMO_STORAGE_KEY, realState: completeRealState });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Review the finished revision receipt' })).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Clear this device and start over' }).click();
  await expect(page.getByLabel('Student name')).toHaveValue('');
  await expect(page.evaluate(({ realKey, demoKey }) => ({
    real: localStorage.getItem(realKey), demo: localStorage.getItem(demoKey),
  }), { realKey: REAL_STORAGE_KEY, demoKey: DEMO_STORAGE_KEY })).resolves.toEqual({ real: null, demo: 'preserve-this-demo' });
});
