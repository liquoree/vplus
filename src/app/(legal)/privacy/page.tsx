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
    'Политика обработки персональных данных',
};

export default async function PrivacyPage() {
  const content =
    await getLegalDocument(
      'privacy.md'
    );

  return (
    <LegalDocument
      content={content}
    />
  );
}