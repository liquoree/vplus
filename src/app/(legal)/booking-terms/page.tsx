import type {
  Metadata,
} from 'next';

import {
  getLegalDocument,
} from '@/shared/lib/legal/get-legal-document';

import {
  LegalDocument,
} from '@/shared/ui/legal-document/LegalDocument';

export const metadata: Metadata = {
  title:
    'Условия бронирования и аренды',
};

export default async function BookingTermsPage() {
  const content =
    await getLegalDocument(
      'booking-terms.md'
    );

  return (
    <LegalDocument
      content={content}
    />
  );
}