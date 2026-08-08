import 'server-only';

import {
  readFile,
} from 'node:fs/promises';

import path from 'node:path';

export type LegalDocumentFile =
  | 'privacy.md'
  | 'personal-data-consent.md'
  | 'requisites.md'
  | 'booking-terms.md';

const LEGAL_DOCUMENTS_DIRECTORY =
  path.join(
    process.cwd(),
    'src',
    'content',
    'legal'
  );

export async function getLegalDocument(
  fileName: LegalDocumentFile
) {
  const filePath = path.join(
    LEGAL_DOCUMENTS_DIRECTORY,
    fileName
  );

  return readFile(
    filePath,
    'utf8'
  );
}