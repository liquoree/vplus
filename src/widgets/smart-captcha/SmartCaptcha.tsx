'use client';

import {
  SmartCaptcha as Captcha,
} from '@yandex/smart-captcha';

interface YandexCaptchaProps {
  resetKey: number;

  onSuccess: (
    token: string
  ) => void;

  onTokenExpired: () => void;
}

const siteKey =
  process.env
    .NEXT_PUBLIC_CAPTCHA_SITE_KEY;

if (!siteKey) {
  throw new Error(
    'NEXT_PUBLIC_CAPTCHA_SITE_KEY is not defined'
  );
}

export const SmartCaptcha = ({
  resetKey,
  onSuccess,
  onTokenExpired,
}: YandexCaptchaProps) => {
  return (
    <Captcha
      key={resetKey}
      sitekey={siteKey}
      onSuccess={onSuccess}
      onTokenExpired={
        onTokenExpired
      }
    />
  );
};