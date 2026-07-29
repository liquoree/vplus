import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from '@/shared/lib/auth/admin-session';

import { AdminShell } from '@/views/admin/admin-shell/AdminShell';

type AdminPanelLayoutProps = {
  children: ReactNode;
};

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(
    ADMIN_SESSION_COOKIE
  )?.value;

  const session =
    verifyAdminSessionToken(sessionToken);

  if (!session) {
    redirect('/admin');
  }

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}