import {
  timingSafeEqual,
} from 'node:crypto';

import { NextResponse } from 'next/server';

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
} from '@/shared/lib/auth/admin-session';

type LoginRequestBody = {
  login?: unknown;
  password?: unknown;
};

function safeCompare(
  firstValue: string,
  secondValue: string
) {
  const firstBuffer =
    Buffer.from(firstValue);

  const secondBuffer =
    Buffer.from(secondValue);

  if (
    firstBuffer.length !==
    secondBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    firstBuffer,
    secondBuffer
  );
}

export async function POST(
  request: Request
) {
  let body: LoginRequestBody;

  try {
    body =
      (await request.json()) as LoginRequestBody;
  } catch {
    return NextResponse.json(
      {
        message:
          'Некорректное тело запроса',
      },
      {
        status: 400,
      }
    );
  }

  const login =
    typeof body.login === 'string'
      ? body.login.trim()
      : '';

  const password =
    typeof body.password === 'string'
      ? body.password
      : '';

  if (!login || !password) {
    return NextResponse.json(
      {
        message:
          'Введите логин и пароль',
      },
      {
        status: 400,
      }
    );
  }

  const adminLogin =
    process.env.ADMIN_LOGIN;

  const adminPassword =
    process.env.ADMIN_PASSWORD;

  if (
    !adminLogin ||
    !adminPassword
  ) {
    console.error(
      'Не настроены ADMIN_LOGIN или ADMIN_PASSWORD'
    );

    return NextResponse.json(
      {
        message:
          'Авторизация временно недоступна',
      },
      {
        status: 500,
      }
    );
  }

  const isValidLogin = safeCompare(
    login,
    adminLogin
  );

  const isValidPassword =
    safeCompare(
      password,
      adminPassword
    );

  if (
    !isValidLogin ||
    !isValidPassword
  ) {
    return NextResponse.json(
      {
        message:
          'Неверный логин или пароль',
      },
      {
        status: 401,
      }
    );
  }

  const sessionToken =
    createAdminSessionToken(login);

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    secure:
      process.env.NODE_ENV ===
      'production',
    sameSite: 'lax',
    path: '/',
    maxAge:
      ADMIN_SESSION_MAX_AGE,
  });

  response.headers.set(
    'Cache-Control',
    'no-store'
  );

  return response;
}