export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminLoginValidationResult =
  | { ok: true; value: AdminLoginInput }
  | { ok: false; message: string };

export function validateAdminLoginInput(input: AdminLoginInput): AdminLoginValidationResult {
  const email = input.email.trim();
  const password = input.password;

  if (!email || !password) {
    return { ok: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' };
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
  }

  if (password.length < 6) {
    return { ok: false, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };
  }

  return { ok: true, value: { email, password } };
}
