import {
  createHmac,
  timingSafeEqual,
} from 'node:crypto';

export const ADMIN_SESSION_COOKIE =
  'admin_session';

export const ADMIN_SESSION_MAX_AGE =
    7 * 24 * 60 * 60;

type AdminSessionPayload = {
  sub: string;
  role: 'admin';
  issuedAt: number;
  expiresAt: number;
};

function getSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      'Переменная ADMIN_SESSION_SECRET должна содержать не менее 32 символов'
    );
  }

  return secret;
}

function createSignature(payload: string) {
  return createHmac(
    'sha256',
    getSessionSecret()
  )
    .update(payload)
    .digest();
}

export function createAdminSessionToken(
  login: string
) {
  const currentTime = Math.floor(
    Date.now() / 1000
  );

  const payload: AdminSessionPayload = {
    sub: login,
    role: 'admin',
    issuedAt: currentTime,
    expiresAt:
      currentTime +
      ADMIN_SESSION_MAX_AGE,
  };

  const encodedPayload = Buffer.from(
    JSON.stringify(payload),
    'utf8'
  ).toString('base64url');

  const signature = createSignature(
    encodedPayload
  ).toString('base64url');

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(
  token?: string
): AdminSessionPayload | null {
  if (!token) {
    return null;
  }

  try {
    const [encodedPayload, encodedSignature] =
      token.split('.');

    if (
      !encodedPayload ||
      !encodedSignature
    ) {
      return null;
    }

    const receivedSignature =
      Buffer.from(
        encodedSignature,
        'base64url'
      );

    const expectedSignature =
      createSignature(encodedPayload);

    if (
      receivedSignature.length !==
      expectedSignature.length
    ) {
      return null;
    }

    if (
      !timingSafeEqual(
        receivedSignature,
        expectedSignature
      )
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(
        encodedPayload,
        'base64url'
      ).toString('utf8')
    ) as Partial<AdminSessionPayload>;

    const currentTime = Math.floor(
      Date.now() / 1000
    );

    if (
      typeof payload.sub !== 'string' ||
      payload.role !== 'admin' ||
      typeof payload.expiresAt !==
        'number' ||
      payload.expiresAt <= currentTime
    ) {
      return null;
    }

    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}