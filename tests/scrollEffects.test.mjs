import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

function source(path) {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('scroll reveal effects', () => {
  it('keeps revealed sections visible after they enter the viewport', () => {
    const scrollEffects = source('src/components/ScrollEffects.tsx');
    const css = source('src/app/globals.css');

    assert.doesNotMatch(scrollEffects, /classList\.toggle\(CLASS_VISIBLE,\s*entry\.isIntersecting\)/);
    assert.match(scrollEffects, /classList\.add\(CLASS_VISIBLE\)/);
    assert.match(scrollEffects, /observer\?\.unobserve\(element\)/);
    assert.match(scrollEffects, /new MutationObserver/);
    assert.match(css, /\.section-reveal\.is-visible \.reveal-item/);
  });
});
