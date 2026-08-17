import type { Metadata } from 'next';

import { getLegalDocument } from '@/shared/lib/legal/get-legal-document';

import { LegalDocument } from '@/shared/ui/legal-document/LegalDocument';

export const metadata: Metadata = {
    title: 'Согласие на обработку персональных данных',
};

export default async function PersonalDataConsentPage() {
    const content = await getLegalDocument('personal-data-consent.md');

    return <LegalDocument content={content} />;
}
