type StorageLike =
  | Storage
  | Map<string, string>
  | {
      getItem(key: string): string | null;
      setItem(key: string, value: string): void;
      removeItem(key: string): void;
    };

type StoredRateLimit = {
  count: number;
  firstAttemptAt: number;
};

export type RateLimitState = {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterMs: number;
};

export const ADMIN_LOGIN_RATE_LIMIT = {
  key: 'trp.admin.login.rate-limit',
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000,
} as const;

export function getAdminLoginRateLimitState(storage: StorageLike, now = Date.now()): RateLimitState {
  const current = readRateLimit(storage);

  if (!current || now - current.firstAttemptAt >= ADMIN_LOGIN_RATE_LIMIT.windowMs) {
    clearAdminLoginRateLimit(storage);

    return {
      allowed: true,
      remainingAttempts: ADMIN_LOGIN_RATE_LIMIT.maxAttempts,
      retryAfterMs: 0,
    };
  }

  const remainingAttempts = Math.max(ADMIN_LOGIN_RATE_LIMIT.maxAttempts - current.count, 0);
  const retryAfterMs = Math.max(current.firstAttemptAt + ADMIN_LOGIN_RATE_LIMIT.windowMs - now, 0);

  return {
    allowed: remainingAttempts > 0,
    remainingAttempts,
    retryAfterMs: remainingAttempts > 0 ? 0 : retryAfterMs,
  };
}

export function recordFailedAdminLogin(storage: StorageLike, now = Date.now()): RateLimitState {
  const current = readRateLimit(storage);
  const next =
    current && now - current.firstAttemptAt < ADMIN_LOGIN_RATE_LIMIT.windowMs
      ? { ...current, count: current.count + 1 }
      : { count: 1, firstAttemptAt: now };

  writeRateLimit(storage, next);

  return getAdminLoginRateLimitState(storage, now);
}

export function clearAdminLoginRateLimit(storage: StorageLike) {
  if (storage instanceof Map) {
    storage.delete(ADMIN_LOGIN_RATE_LIMIT.key);
    return;
  }

  storage.removeItem(ADMIN_LOGIN_RATE_LIMIT.key);
}

function readRateLimit(storage: StorageLike): StoredRateLimit | null {
  const raw = storage instanceof Map ? storage.get(ADMIN_LOGIN_RATE_LIMIT.key) : storage.getItem(ADMIN_LOGIN_RATE_LIMIT.key);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredRateLimit>;

    if (typeof parsed.count !== 'number' || typeof parsed.firstAttemptAt !== 'number' || !Number.isFinite(parsed.count) || !Number.isFinite(parsed.firstAttemptAt)) {
      return null;
    }

    const count = parsed.count;
    const firstAttemptAt = parsed.firstAttemptAt;

    return {
      count: Math.max(0, Math.floor(count)),
      firstAttemptAt,
    };
  } catch {
    return null;
  }
}

function writeRateLimit(storage: StorageLike, value: StoredRateLimit) {
  const serialized = JSON.stringify(value);

  if (storage instanceof Map) {
    storage.set(ADMIN_LOGIN_RATE_LIMIT.key, serialized);
    return;
  }

  storage.setItem(ADMIN_LOGIN_RATE_LIMIT.key, serialized);
}
