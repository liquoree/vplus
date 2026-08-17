import { redirect } from 'next/navigation';

import { getCurrentAdmin } from '@/features/admin/auth/api/get-current-admin';

import { AdminLoginPage } from '@/views/';

type AdminPageProps = {
    searchParams: Promise<{
        next?: string | string[];
    }>;
};

function getSafeRedirectPath(value?: string | string[]) {
    const path = typeof value === 'string' ? value : undefined;

    if (!path || !path.startsWith('/admin/') || path.startsWith('//')) {
        return '/admin/requests';
    }

    return path;
}

export default async function Page({ searchParams }: AdminPageProps) {
    const admin = await getCurrentAdmin();

    if (admin) {
        redirect('/admin/requests');
    }

    const params = await searchParams;

    return <AdminLoginPage redirectTo={getSafeRedirectPath(params.next)} />;
}
