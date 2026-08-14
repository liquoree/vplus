import type { ReactNode } from 'react';
import type {
  Metadata,
} from 'next';

type AdminLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return children;
}