import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from '@/shared/lib/auth/admin-session';

import {
  AdminLoginPage,
} from '@/views/';

type AdminPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

function getSafeRedirectPath(
  value?: string | string[]
) {
  const path =
    typeof value === 'string'
      ? value
      : undefined;

  if (
    !path ||
    !path.startsWith('/admin/') ||
    path.startsWith('//')
  ) {
    return '/admin/requests';
  }

  return path;
}

export default async function Page({
  searchParams,
}: AdminPageProps) {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    ADMIN_SESSION_COOKIE
  )?.value;

  const session =
    verifyAdminSessionToken(sessionToken);

  if (session) {
    redirect('/admin/requests');
  }

  const params = await searchParams;

  return (
    <AdminLoginPage
      redirectTo={getSafeRedirectPath(
        params.next
      )}
    />
  );
}