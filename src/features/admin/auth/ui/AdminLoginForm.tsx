'use client';

import { type FormEvent, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui';

import { AdminLoginError, loginAdmin } from '../api/login-admin';

import './AdminLoginForm.scss';

type AdminLoginFormProps = {
    redirectTo?: string;
};

export function AdminLoginForm({ redirectTo = '/admin/requests' }: AdminLoginFormProps) {
    const router = useRouter();

    const [login, setLogin] = useState('');

    const [password, setPassword] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const normalizedLogin = login.trim();

        if (!normalizedLogin || !password) {
            setError('Введите логин и пароль');

            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            await loginAdmin({
                login: normalizedLogin,
                password,
            });

            router.replace(redirectTo);
            router.refresh();
        } catch (submitError) {
            setError(
                submitError instanceof AdminLoginError
                    ? submitError.message
                    : 'Не удалось выполнить вход',
            );

            setIsSubmitting(false);
        }
    };

    return (
        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
            <label className="admin-login-form__field">
                <span className="admin-login-form__label">Логин</span>

                <input
                    name="login"
                    type="text"
                    value={login}
                    autoComplete="username"
                    placeholder="Введите логин"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(error)}
                    onChange={(event) => {
                        setLogin(event.target.value);

                        setError(null);
                    }}
                />
            </label>

            <label className="admin-login-form__field">
                <span className="admin-login-form__label">Пароль</span>

                <input
                    name="password"
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    placeholder="Введите пароль"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(error)}
                    onChange={(event) => {
                        setPassword(event.target.value);

                        setError(null);
                    }}
                />
            </label>

            {error && (
                <p className="admin-login-form__error" role="alert">
                    {error}
                </p>
            )}

            <Button
                type="submit"
                text="Войти"
                variant="mid"
                isLoading={isSubmitting}
                className="admin-login-form__submit"
            />
        </form>
    );
}
