import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('process typography', () => {
  it('adds safe Thai break points without splitting installation wording', () => {
    const process = source('src/components/Process.tsx');

    assert.match(process, /ลดความเสี่ยงจากการคาดเดา <wbr \/>/);
    assert.match(process, /ด้วยขั้นตอนสั้น ชัดเจน <wbr \/>/);
    assert.match(process, /และตรวจสอบได้ก่อนตัดสินใจติดตั้งจริง/);
    assert.match(process, /mb-10 grid gap-6 lg:grid-cols/);
    assert.match(process, /max-w-2xl text-balance text-left/);
  });
});
