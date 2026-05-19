import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateAdminLoginInput } from '../src/lib/admin/authValidation.ts';
import {
  ADMIN_LOGIN_RATE_LIMIT,
  clearAdminLoginRateLimit,
  getAdminLoginRateLimitState,
  recordFailedAdminLogin,
} from '../src/lib/admin/rateLimit.ts';

describe('admin login validation', () => {
  it('requires both email and password', () => {
    assert.deepEqual(validateAdminLoginInput({ email: '', password: '' }), {
      ok: false,
      message: 'กรุณากรอกอีเมลและรหัสผ่าน',
    });
  });

  it('rejects invalid email addresses', () => {
    assert.equal(validateAdminLoginInput({ email: 'owner', password: '123456' }).ok, false);
  });

  it('trims email and keeps password unchanged', () => {
    assert.deepEqual(validateAdminLoginInput({ email: ' owner@example.com ', password: '123456' }), {
      ok: true,
      value: {
        email: 'owner@example.com',
        password: '123456',
      },
    });
  });

  it('locks admin login after repeated failed attempts and resets after the window', () => {
    const storage = new Map();
    const now = Date.parse('2026-05-19T00:00:00.000Z');

    for (let attempt = 1; attempt <= ADMIN_LOGIN_RATE_LIMIT.maxAttempts; attempt += 1) {
      recordFailedAdminLogin(storage, now + attempt);
    }

    const locked = getAdminLoginRateLimitState(storage, now + 10);

    assert.equal(locked.allowed, false);
    assert.equal(locked.remainingAttempts, 0);
    assert.equal(locked.retryAfterMs > 0, true);

    const reset = getAdminLoginRateLimitState(storage, now + ADMIN_LOGIN_RATE_LIMIT.windowMs + 1);

    assert.equal(reset.allowed, true);
    assert.equal(reset.remainingAttempts, ADMIN_LOGIN_RATE_LIMIT.maxAttempts);
  });

  it('clears admin login throttling after successful login', () => {
    const storage = new Map();
    const now = Date.parse('2026-05-19T00:00:00.000Z');

    recordFailedAdminLogin(storage, now);
    clearAdminLoginRateLimit(storage);

    assert.deepEqual(getAdminLoginRateLimitState(storage, now + 1), {
      allowed: true,
      remainingAttempts: ADMIN_LOGIN_RATE_LIMIT.maxAttempts,
      retryAfterMs: 0,
    });
  });
});
