import type {
  ReactNode,
} from 'react';

import {
  redirect,
} from 'next/navigation';

import {
  getCurrentAdmin,
} from '@/features/admin/auth/api/get-current-admin';

import {
  AdminShell,
} from '@/views/admin/admin-shell/AdminShell';

type AdminPanelLayoutProps = {
  children: ReactNode;
};

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const admin =
    await getCurrentAdmin();

  if (!admin) {
    redirect('/admin');
  }

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}