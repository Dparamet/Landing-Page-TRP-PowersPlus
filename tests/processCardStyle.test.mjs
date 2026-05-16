import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('process card style', () => {
  it('keeps process step cards white with orange borders', () => {
    const process = source('src/components/Process.tsx');

    assert.match(process, /border-2 border-\[#f08a24\] bg-white/);
    assert.match(process, /font-black !text-white/);
    assert.doesNotMatch(process, /glass-card group rounded-lg border border-\[#f08a24\] bg-\[#f8fafc\]/);
  });
});
