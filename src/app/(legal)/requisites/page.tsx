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
    'Реквизиты',
};

export default async function RequisitesPage() {
  const content =
    await getLegalDocument(
      'requisites.md'
    );

  return (
    <LegalDocument
      content={content}
    />
  );
}