import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import en from '../src/locales/en.json' with { type: 'json' };
import th from '../src/locales/th.json' with { type: 'json' };

function collectShape(value, prefix = '') {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectShape(item, `${prefix}[${index}]`));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      collectShape(child, prefix ? `${prefix}.${key}` : key),
    );
  }

  return [prefix];
}

describe('locale files', () => {
  it('keep Thai and English translation keys in sync', () => {
    assert.deepEqual(collectShape(th).sort(), collectShape(en).sort());
  });

  it('keep translated service and FAQ lists aligned by item count', () => {
    assert.equal(th.services.items.length, en.services.items.length);
    assert.equal(th.faq.questions.length, en.faq.questions.length);
  });
});
