export type ChangeKind = 'revised' | 'added' | 'removed';

export interface PassageChange {
  id: string;
  before: string;
  after: string;
  kind: ChangeKind;
  wordsAdded: number;
  wordsRemoved: number;
}

export interface DiffResult {
  changes: PassageChange[];
  wordsAdded: number;
  wordsRemoved: number;
}

type Operation = { type: 'same' | 'add' | 'remove'; text: string };

function clean(text: string): string {
  return text.replace(/\r\n?/g, '\n').replace(/[ \t]+/g, ' ').trim();
}

export function splitIntoPassages(text: string): string[] {
  const paragraphs = clean(text).split(/\n\s*\n+/).filter(Boolean);
  const units = paragraphs.flatMap((paragraph) => {
    const lines = paragraph.split('\n').map((line) => line.trim()).filter(Boolean);
    return lines.flatMap((line) => {
      const sentences = line.match(/[^.!?]+(?:[.!?]+["'’”)]*|$)/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
      return sentences.length > 1 ? sentences : [line];
    });
  });

  if (units.length <= 500) return units;
  const groupSize = Math.ceil(units.length / 500);
  const grouped: string[] = [];
  for (let index = 0; index < units.length; index += groupSize) {
    grouped.push(units.slice(index, index + groupSize).join(' '));
  }
  return grouped;
}

function wordDelta(before: string, after: string): { added: number; removed: number } {
  const tokenize = (value: string) => value.toLocaleLowerCase().match(/[\p{L}\p{N}’'-]+/gu) ?? [];
  const beforeWords = tokenize(before);
  const afterWords = tokenize(after);
  const remaining = new Map<string, number>();
  for (const word of beforeWords) remaining.set(word, (remaining.get(word) ?? 0) + 1);
  let common = 0;
  for (const word of afterWords) {
    const count = remaining.get(word) ?? 0;
    if (count > 0) {
      common += 1;
      remaining.set(word, count - 1);
    }
  }
  return { added: afterWords.length - common, removed: beforeWords.length - common };
}

export function analyzeDiff(original: string, revised: string): DiffResult {
  const before = splitIntoPassages(original);
  const after = splitIntoPassages(revised);
  const width = after.length + 1;
  const table = new Uint16Array((before.length + 1) * width);

  for (let row = 1; row <= before.length; row += 1) {
    for (let column = 1; column <= after.length; column += 1) {
      const cell = row * width + column;
      table[cell] = before[row - 1] === after[column - 1]
        ? table[(row - 1) * width + column - 1] + 1
        : Math.max(table[(row - 1) * width + column], table[row * width + column - 1]);
    }
  }

  const reversed: Operation[] = [];
  let row = before.length;
  let column = after.length;
  while (row > 0 || column > 0) {
    if (row > 0 && column > 0 && before[row - 1] === after[column - 1]) {
      reversed.push({ type: 'same', text: before[row - 1] });
      row -= 1;
      column -= 1;
    } else if (column > 0 && (row === 0 || table[row * width + column - 1] >= table[(row - 1) * width + column])) {
      reversed.push({ type: 'add', text: after[column - 1] });
      column -= 1;
    } else {
      reversed.push({ type: 'remove', text: before[row - 1] });
      row -= 1;
    }
  }

  const operations = reversed.reverse();
  const changes: PassageChange[] = [];
  let removed: string[] = [];
  let added: string[] = [];

  const flush = () => {
    if (removed.length === 0 && added.length === 0) return;
    const beforeText = removed.join(' ');
    const afterText = added.join(' ');
    const delta = wordDelta(beforeText, afterText);
    changes.push({
      id: `change-${changes.length + 1}`,
      before: beforeText,
      after: afterText,
      kind: beforeText && afterText ? 'revised' : beforeText ? 'removed' : 'added',
      wordsAdded: delta.added,
      wordsRemoved: delta.removed,
    });
    removed = [];
    added = [];
  };

  for (const operation of operations) {
    if (operation.type === 'same') {
      flush();
    } else if (operation.type === 'remove') {
      removed.push(operation.text);
    } else {
      added.push(operation.text);
    }
  }
  flush();

  return {
    changes,
    wordsAdded: changes.reduce((sum, change) => sum + change.wordsAdded, 0),
    wordsRemoved: changes.reduce((sum, change) => sum + change.wordsRemoved, 0),
  };
}
