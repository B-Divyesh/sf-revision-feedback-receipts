import './styles.css';
import { analyzeDiff, type DiffResult, type PassageChange } from './diff';

type Phase = 'drafts' | 'evidence' | 'receipt';

interface AppState {
  studentName: string;
  assignmentName: string;
  goals: string[];
  originalDraft: string;
  revisedDraft: string;
  selections: string[];
  reflections: string[];
  phase: Phase;
}

const STORAGE_KEY = 'revision-receipts-work-v1';
const MAX_DRAFT_LENGTH = 100_000;
const defaultState: AppState = {
  studentName: '', assignmentName: '', goals: [''], originalDraft: '', revisedDraft: '',
  selections: [], reflections: [], phase: 'drafts',
};

const byId = <T extends HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element as T;
};

function readState(): AppState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '') as Partial<AppState>;
    if (!parsed || !Array.isArray(parsed.goals)) return { ...defaultState };
    return {
      ...defaultState,
      ...parsed,
      goals: parsed.goals.slice(0, 3).map(String),
      selections: Array.isArray(parsed.selections) ? parsed.selections.map(String) : [],
      reflections: Array.isArray(parsed.reflections) ? parsed.reflections.map(String) : [],
    };
  } catch {
    return { ...defaultState };
  }
}

let state = readState();
let diff: DiffResult | null = null;
let saveTimer = 0;

function saveState(): void {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)), 180);
}

function setPhase(phase: Phase): void {
  state.phase = phase;
  byId('step-evidence').hidden = phase === 'drafts';
  byId('receipt-output').hidden = phase !== 'receipt';
  saveState();
}

function invalidateResults(): void {
  if (state.phase !== 'drafts') setPhase('drafts');
}

function wordCount(text: string): number {
  return text.trim().match(/[\p{L}\p{N}’'-]+/gu)?.length ?? 0;
}

function updateCounts(): void {
  byId('original-count').textContent = `${wordCount(state.originalDraft).toLocaleString()} words`;
  byId('revised-count').textContent = `${wordCount(state.revisedDraft).toLocaleString()} words`;
}

function renderGoals(): void {
  const list = byId('goal-list');
  list.replaceChildren();
  state.goals.forEach((goal, index) => {
    const row = document.createElement('div');
    row.className = 'goal-row';
    const badge = document.createElement('span');
    badge.className = 'goal-index';
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = String(index + 1);
    const label = document.createElement('label');
    label.className = 'sr-only';
    label.htmlFor = `goal-${index}`;
    label.textContent = `Feedback goal ${index + 1}`;
    const input = document.createElement('input');
    input.id = `goal-${index}`;
    input.type = 'text';
    input.required = true;
    input.maxLength = 180;
    input.placeholder = index === 0 ? 'Example: Make each claim connect clearly to evidence' : 'Add another feedback goal';
    input.value = goal;
    input.addEventListener('input', () => {
      state.goals[index] = input.value;
      input.classList.remove('invalid');
      invalidateResults();
      saveState();
    });
    row.append(badge, label, input);
    if (state.goals.length > 1) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'icon-button';
      remove.setAttribute('aria-label', `Remove feedback goal ${index + 1}`);
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        state.goals.splice(index, 1);
        state.selections.splice(index, 1);
        state.reflections.splice(index, 1);
        invalidateResults();
        renderGoals();
        saveState();
        (document.querySelector(`#goal-${Math.max(0, index - 1)}`) as HTMLInputElement | null)?.focus();
      });
      row.append(remove);
    } else {
      const spacer = document.createElement('span');
      spacer.setAttribute('aria-hidden', 'true');
      row.append(spacer);
    }
    list.append(row);
  });
  byId<HTMLButtonElement>('add-goal').disabled = state.goals.length >= 3;
}

function showErrors(containerId: string, errors: string[], focusId?: string): void {
  const container = byId(containerId);
  container.replaceChildren();
  if (errors.length === 0) {
    container.hidden = true;
    return;
  }
  const title = document.createElement('strong');
  title.textContent = errors.length === 1 ? 'One thing needs attention:' : `${errors.length} things need attention:`;
  const list = document.createElement('ul');
  errors.forEach((error) => {
    const item = document.createElement('li');
    item.textContent = error;
    list.append(item);
  });
  container.append(title, list);
  container.hidden = false;
  container.focus();
  if (focusId) byId(focusId).classList.add('invalid');
}

function changeLabel(change: PassageChange): string {
  if (change.kind === 'added') return 'Added passage';
  if (change.kind === 'removed') return 'Removed passage';
  return 'Revised passage';
}

function renderPassage(change: PassageChange, side: 'before' | 'after'): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = `passage ${side}`;
  const label = document.createElement('span');
  label.className = 'passage-label';
  label.textContent = side === 'before' ? 'Before' : 'After';
  const quote = document.createElement('blockquote');
  const text = side === 'before' ? change.before : change.after;
  quote.textContent = text || (side === 'before' ? 'No earlier passage' : 'Removed from the revision');
  if (!text) quote.className = 'empty-passage';
  wrapper.append(label, quote);
  return wrapper;
}

function renderComparison(): void {
  if (!diff) return;
  const summary = byId('comparison-summary');
  summary.replaceChildren();
  const stats: [number, string][] = [
    [diff.changes.length, diff.changes.length === 1 ? 'changed passage' : 'changed passages'],
    [diff.wordsAdded, 'words added'],
    [diff.wordsRemoved, 'words removed'],
  ];
  stats.forEach(([value, label]) => {
    const card = document.createElement('div');
    card.className = 'stat';
    const number = document.createElement('strong');
    number.textContent = value.toLocaleString();
    card.append(number, label);
    summary.append(card);
  });

  const list = byId('change-list');
  list.replaceChildren();
  diff.changes.forEach((change) => {
    const card = document.createElement('article');
    card.className = 'change-card';
    card.id = change.id;
    const header = document.createElement('header');
    const heading = document.createElement('h4');
    heading.textContent = changeLabel(change);
    const count = document.createElement('span');
    count.className = 'change-kind';
    count.textContent = `+${change.wordsAdded} / −${change.wordsRemoved} words`;
    header.append(heading, count);
    const grid = document.createElement('div');
    grid.className = 'passage-grid';
    grid.append(renderPassage(change, 'before'), renderPassage(change, 'after'));
    card.append(header, grid);
    list.append(card);
  });
  renderEvidenceForm();
}

function renderEvidenceForm(): void {
  if (!diff) return;
  const comparison = diff;
  const list = byId('goal-evidence-list');
  list.replaceChildren();
  state.goals.forEach((goal, index) => {
    const card = document.createElement('section');
    card.className = 'goal-evidence';
    const heading = document.createElement('h4');
    const badge = document.createElement('span');
    badge.textContent = String(index + 1);
    heading.append(badge, document.createTextNode(goal));

    const selectField = document.createElement('div');
    selectField.className = 'field';
    const selectLabel = document.createElement('label');
    selectLabel.htmlFor = `evidence-${index}`;
    selectLabel.textContent = 'Strongest changed passage *';
    const select = document.createElement('select');
    select.id = `evidence-${index}`;
    select.required = true;
    const empty = document.createElement('option');
    empty.value = '';
    empty.textContent = 'Choose a passage…';
    select.append(empty);
    comparison.changes.forEach((change, changeIndex) => {
      const option = document.createElement('option');
      option.value = change.id;
      option.textContent = `Passage ${changeIndex + 1} — ${changeLabel(change)}`;
      select.append(option);
    });
    select.value = state.selections[index] ?? '';
    select.addEventListener('change', () => {
      state.selections[index] = select.value;
      select.classList.remove('invalid');
      saveState();
    });
    selectField.append(selectLabel, select);

    const reflectionField = document.createElement('div');
    reflectionField.className = 'field';
    const reflectionLabel = document.createElement('label');
    reflectionLabel.htmlFor = `reflection-${index}`;
    reflectionLabel.textContent = 'What did you change, and why? *';
    const reflection = document.createElement('textarea');
    reflection.id = `reflection-${index}`;
    reflection.required = true;
    reflection.maxLength = 800;
    reflection.placeholder = 'In 1–3 sentences, explain the decision you made. The explanation should be your own.';
    reflection.value = state.reflections[index] ?? '';
    reflection.addEventListener('input', () => {
      state.reflections[index] = reflection.value;
      reflection.classList.remove('invalid');
      saveState();
    });
    const hint = document.createElement('p');
    hint.className = 'field-hint';
    hint.textContent = 'This reflection is included verbatim on the receipt.';
    reflectionField.append(reflectionLabel, reflection, hint);
    card.append(heading, selectField, reflectionField);
    list.append(card);
  });
}

function appendDefinition(list: HTMLElement, term: string, value: string): void {
  const wrapper = document.createElement('div');
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.textContent = term;
  dd.textContent = value;
  wrapper.append(dt, dd);
  list.append(wrapper);
}

function findChange(id: string): PassageChange {
  const change = diff?.changes.find((candidate) => candidate.id === id);
  if (!change) throw new Error('Selected evidence is no longer available.');
  return change;
}

function renderReceipt(): void {
  const meta = byId('receipt-meta');
  meta.replaceChildren();
  appendDefinition(meta, 'Student', state.studentName);
  appendDefinition(meta, 'Assignment', state.assignmentName);
  appendDefinition(meta, 'Created', new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date()));

  const goals = byId('receipt-goals');
  goals.replaceChildren();
  state.goals.forEach((goal, index) => {
    const change = findChange(state.selections[index]);
    const section = document.createElement('section');
    section.className = 'receipt-goal';
    const label = document.createElement('p');
    label.className = 'goal-label';
    label.textContent = `Feedback goal ${index + 1}`;
    const heading = document.createElement('h3');
    heading.textContent = goal;
    const evidence = document.createElement('div');
    evidence.className = 'receipt-evidence';
    (['before', 'after'] as const).forEach((side) => {
      const box = document.createElement('div');
      box.className = `quote-box ${side}`;
      const sideLabel = document.createElement('strong');
      sideLabel.textContent = side === 'before' ? 'Before' : 'After';
      const quote = document.createElement('blockquote');
      const content = side === 'before' ? change.before : change.after;
      quote.textContent = content || (side === 'before' ? 'No earlier passage' : 'Removed from the revision');
      box.append(sideLabel, quote);
      evidence.append(box);
    });
    const reflection = document.createElement('p');
    reflection.className = 'reflection';
    const strong = document.createElement('strong');
    strong.textContent = 'Student reflection: ';
    reflection.append(strong, document.createTextNode(state.reflections[index]));
    section.append(label, heading, evidence, reflection);
    goals.append(section);
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function receiptHtml(): string {
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date());
  const sections = state.goals.map((goal, index) => {
    const change = findChange(state.selections[index]);
    return `<section><small>FEEDBACK GOAL ${index + 1}</small><h2>${escapeHtml(goal)}</h2><div class="evidence"><blockquote><b>BEFORE</b>${escapeHtml(change.before || 'No earlier passage')}</blockquote><blockquote class="after"><b>AFTER</b>${escapeHtml(change.after || 'Removed from the revision')}</blockquote></div><p><mark>Student reflection:</mark> ${escapeHtml(state.reflections[index])}</p></section>`;
  }).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revision receipt — ${escapeHtml(state.studentName)}</title><style>body{max-width:850px;margin:40px auto;padding:0 20px;background:#f4f0e6;color:#171713;font:16px/1.5 Arial,sans-serif}main{background:#fffdf7;border:3px solid;padding:36px;box-shadow:8px 8px #171713}h1,h2{font-family:Arial Black,Arial,sans-serif;line-height:1.05}header{border-bottom:4px solid}.meta{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:20px 0}.meta div{border-bottom:1px solid}small,b{display:block;font-weight:900}section{padding:24px 0;border-bottom:2px dashed}.evidence{display:grid;grid-template-columns:1fr 1fr;gap:16px}blockquote{margin:8px 0;padding:14px;border-left:5px solid #e63b2e;background:#faf4e7;font-family:Georgia,serif;white-space:pre-wrap}.after{border-color:#18754a;background:#f3f9e5}mark{background:#d9ff57;font-weight:700}.note{margin-top:28px;padding:14px;border:2px solid;background:#bde7f2}@media(max-width:600px){.meta,.evidence{grid-template-columns:1fr}main{padding:20px}}@media print{body{margin:0;background:#fff}main{border:0;box-shadow:none}}</style></head><body><main><header><small>REVISION RECEIPT</small><h1>Ready for review</h1></header><div class="meta"><div><small>STUDENT</small>${escapeHtml(state.studentName)}</div><div><small>ASSIGNMENT</small>${escapeHtml(state.assignmentName)}</div><div><small>CREATED</small>${escapeHtml(date)}</div></div>${sections}<p class="note"><b>WHAT THIS PROVES</b> Text changed and the student explained why. It is evidence for a conversation—not proof of learning, authorship, or quality.</p></main></body></html>`;
}

function downloadReceipt(): void {
  const blob = new Blob([receiptHtml()], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const safeName = `${state.studentName}-${state.assignmentName}`.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'revision';
  anchor.href = url;
  anchor.download = `${safeName}-receipt.html`;
  anchor.click();
  URL.revokeObjectURL(url);
  byId('action-status').textContent = 'Receipt downloaded as a portable HTML file.';
}

function summaryText(): string {
  const lines = [`Revision receipt — ${state.studentName}`, state.assignmentName, ''];
  state.goals.forEach((goal, index) => {
    const change = findChange(state.selections[index]);
    lines.push(`Goal ${index + 1}: ${goal}`, `Before: ${change.before || 'No earlier passage'}`, `After: ${change.after || 'Removed from the revision'}`, `Reflection: ${state.reflections[index]}`, '');
  });
  lines.push('Textual change is evidence for a conversation, not proof of learning or quality.');
  return lines.join('\n');
}

function bindDraft(id: 'original-draft' | 'revised-draft', property: 'originalDraft' | 'revisedDraft'): void {
  const textarea = byId<HTMLTextAreaElement>(id);
  textarea.maxLength = MAX_DRAFT_LENGTH;
  textarea.value = state[property];
  textarea.addEventListener('input', () => {
    state[property] = textarea.value;
    textarea.classList.remove('invalid');
    invalidateResults();
    updateCounts();
    saveState();
  });
}

function validateDraftForm(): string[] {
  document.querySelectorAll('.invalid').forEach((element) => element.classList.remove('invalid'));
  const errors: string[] = [];
  if (!state.studentName.trim()) errors.push('Add the student name or initials.');
  if (!state.assignmentName.trim()) errors.push('Add the assignment name.');
  state.goals.forEach((goal, index) => { if (!goal.trim()) errors.push(`Write feedback goal ${index + 1}.`); });
  if (!state.originalDraft.trim()) errors.push('Paste or choose the first draft.');
  if (!state.revisedDraft.trim()) errors.push('Paste or choose the revised draft.');
  if (state.originalDraft.trim() && state.revisedDraft.trim() && state.originalDraft.trim() === state.revisedDraft.trim()) errors.push('The two drafts are identical. Add the revised version before comparing.');
  if (errors.length) {
    const firstId = !state.studentName.trim() ? 'student-name' : !state.assignmentName.trim() ? 'assignment-name' : state.goals.some((goal) => !goal.trim()) ? `goal-${state.goals.findIndex((goal) => !goal.trim())}` : !state.originalDraft.trim() ? 'original-draft' : 'revised-draft';
    showErrors('form-errors', errors, firstId);
  } else showErrors('form-errors', []);
  return errors;
}

function restorePhase(): void {
  if (state.phase === 'drafts') return;
  diff = analyzeDiff(state.originalDraft, state.revisedDraft);
  if (diff.changes.length === 0) {
    setPhase('drafts');
    return;
  }
  renderComparison();
  byId('step-evidence').hidden = false;
  if (state.phase === 'receipt' && state.goals.every((_, index) => state.selections[index] && state.reflections[index])) {
    renderReceipt();
    byId('receipt-output').hidden = false;
  }
}

byId<HTMLInputElement>('student-name').value = state.studentName;
byId<HTMLInputElement>('assignment-name').value = state.assignmentName;
bindDraft('original-draft', 'originalDraft');
bindDraft('revised-draft', 'revisedDraft');
renderGoals();
updateCounts();

(['student-name', 'assignment-name'] as const).forEach((id) => {
  const input = byId<HTMLInputElement>(id);
  input.addEventListener('input', () => {
    if (id === 'student-name') state.studentName = input.value;
    else state.assignmentName = input.value;
    input.classList.remove('invalid');
    invalidateResults();
    saveState();
  });
});

byId('add-goal').addEventListener('click', () => {
  if (state.goals.length >= 3) return;
  state.goals.push('');
  invalidateResults();
  renderGoals();
  saveState();
  byId<HTMLInputElement>(`goal-${state.goals.length - 1}`).focus();
});

document.querySelectorAll<HTMLInputElement>('.file-input').forEach((input) => {
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      showErrors('form-errors', [`${file.name} is larger than 1 MB. Choose a plain-text classroom draft under 1 MB.`]);
      input.value = '';
      return;
    }
    const allowed = /\.(txt|md)$/i.test(file.name) || ['text/plain', 'text/markdown', ''].includes(file.type);
    if (!allowed) {
      showErrors('form-errors', [`${file.name} is not a .txt or .md file. Export the draft as plain text and try again.`]);
      input.value = '';
      return;
    }
    const text = await file.text();
    if (text.length > MAX_DRAFT_LENGTH) {
      showErrors('form-errors', [`${file.name} contains more than ${MAX_DRAFT_LENGTH.toLocaleString()} characters. Shorten it before comparing.`]);
      input.value = '';
      return;
    }
    const target = byId<HTMLTextAreaElement>(input.dataset.target ?? '');
    target.value = text;
    target.dispatchEvent(new Event('input', { bubbles: true }));
    const labelText = document.querySelector<HTMLSpanElement>(`label[for="${input.id}"] span`);
    if (labelText) labelText.textContent = file.name;
    showErrors('form-errors', []);
  });
});

byId<HTMLFormElement>('receipt-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (validateDraftForm().length) return;
  diff = analyzeDiff(state.originalDraft, state.revisedDraft);
  if (diff.changes.length === 0) {
    showErrors('form-errors', ['No changed passages were found. Check that the revised draft is different from the first draft.'], 'revised-draft');
    return;
  }
  state.selections = state.goals.map((_, index) => state.selections[index] ?? '');
  state.reflections = state.goals.map((_, index) => state.reflections[index] ?? '');
  renderComparison();
  setPhase('evidence');
  byId('step-evidence').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});

byId<HTMLFormElement>('evidence-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const errors: string[] = [];
  state.goals.forEach((_, index) => {
    const select = byId<HTMLSelectElement>(`evidence-${index}`);
    const reflection = byId<HTMLTextAreaElement>(`reflection-${index}`);
    if (!select.value) { errors.push(`Choose evidence for feedback goal ${index + 1}.`); select.classList.add('invalid'); }
    if (!reflection.value.trim()) { errors.push(`Write a reflection for feedback goal ${index + 1}.`); reflection.classList.add('invalid'); }
  });
  if (errors.length) {
    showErrors('evidence-errors', errors);
    return;
  }
  showErrors('evidence-errors', []);
  renderReceipt();
  setPhase('receipt');
  byId('receipt-output').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});

byId('download-receipt').addEventListener('click', downloadReceipt);
byId('print-receipt').addEventListener('click', () => window.print());
byId('copy-summary').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(summaryText());
    byId('action-status').textContent = 'Receipt summary copied to the clipboard.';
  } catch {
    byId('action-status').textContent = 'Clipboard access was blocked. Download the receipt instead.';
  }
});
byId('start-over').addEventListener('click', () => {
  if (!window.confirm(`Clear ${state.studentName || 'this student'}’s drafts, goals, and receipt from this device? This cannot be undone.`)) return;
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});

function updateOnlineStatus(): void {
  byId('offline-banner').hidden = navigator.onLine;
}
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();
restorePhase();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
