import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateAdminLoginInput } from '../src/lib/admin/authValidation.ts';

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
});
