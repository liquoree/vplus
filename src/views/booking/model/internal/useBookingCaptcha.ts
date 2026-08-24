import { useState } from 'react';

export function useBookingCaptcha() {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const [captchaResetKey, setCaptchaResetKey] = useState(0);

    const [captchaError, setCaptchaError] = useState('');

    const handleCaptchaSuccess = (token: string) => {
        setCaptchaToken(token);
        setCaptchaError('');
    };

    const handleCaptchaExpired = () => {
        setCaptchaToken(null);

        setCaptchaError('Проверка CAPTCHA истекла. Пройдите её ещё раз');
    };

    const validate = () => {
        if (captchaToken) {
            return captchaToken;
        }

        setCaptchaError('Подтвердите, что вы не робот');

        return null;
    };

    const resetCaptcha = () => {
        setCaptchaToken(null);

        setCaptchaResetKey((currentKey) => currentKey + 1);
    };

    return {
        captchaToken,
        captchaResetKey,
        captchaError,

        handleCaptchaSuccess,
        handleCaptchaExpired,

        validate,
        resetCaptcha,
    };
}
