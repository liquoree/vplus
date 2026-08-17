import Image from 'next/image';
import Link from 'next/link';

import { AdminLoginForm } from '@/features/admin/auth';

import './AdminLoginPage.scss';

type AdminLoginPageProps = {
    redirectTo?: string;
};

export function AdminLoginPage({ redirectTo }: AdminLoginPageProps) {
    return (
        <main className="admin-login-page">
            <section className="admin-login-page__card">
                <Link className="admin-login-page__logo" href="/" aria-label="На главную">
                    <Image
                        src="/images/logo.svg"
                        alt="ВЕЗДЕХОД+ Карелия"
                        width={72}
                        height={48}
                        priority
                    />
                </Link>

                <div className="admin-login-page__heading">
                    <h1>Вход в админ-панель</h1>

                    <p>Введите данные администратора</p>
                </div>

                <AdminLoginForm redirectTo={redirectTo} />
            </section>
        </main>
    );
}
