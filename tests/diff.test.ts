import { describe, expect, it } from 'vitest';
import { analyzeDiff, splitIntoPassages } from '../src/diff';

describe('splitIntoPassages', () => {
  it('splits prose into useful sentence-sized evidence', () => {
    expect(splitIntoPassages('One sentence. A second sentence!')).toEqual(['One sentence.', 'A second sentence!']);
  });

  it('preserves markdown lines without punctuation', () => {
    expect(splitIntoPassages('- first point\n- second point')).toEqual(['- first point', '- second point']);
  });
});

describe('analyzeDiff', () => {
  it('returns no evidence for identical drafts', () => {
    expect(analyzeDiff('Keep this sentence.', 'Keep this sentence.')).toEqual({ changes: [], wordsAdded: 0, wordsRemoved: 0 });
  });

  it('pairs nearby removed and added passages as a revision', () => {
    const result = analyzeDiff(
      'The claim is clear. Parks are good. The final sentence stays.',
      'The claim is clear. Parks improve health by creating space to exercise. The final sentence stays.',
    );
    expect(result.changes).toHaveLength(1);
    expect(result.changes[0]).toMatchObject({
      kind: 'revised',
      before: 'Parks are good.',
      after: 'Parks improve health by creating space to exercise.',
    });
    expect(result.wordsAdded).toBeGreaterThan(0);
    expect(result.wordsRemoved).toBeGreaterThan(0);
  });

  it('labels a newly appended passage as added', () => {
    const result = analyzeDiff('First.', 'First. New evidence appears here.');
    expect(result.changes[0]).toMatchObject({ kind: 'added', before: '', after: 'New evidence appears here.' });
  });

  it('handles multilingual words in transparent word counts', () => {
    const result = analyzeDiff('Café ideas.', 'Café ideas improve.');
    expect(result.wordsAdded).toBe(1);
  });
});
