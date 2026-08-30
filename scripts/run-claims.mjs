/* global process */

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8'));
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

for (const claim of claims) {
  const tag = `@claim:${claim.id}`;
  process.stdout.write(`\nRunning ${tag}\n`);
  const result = spawnSync(npx, ['playwright', 'test', '--grep', tag], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
