import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import './LegalDocument.scss';

type LegalDocumentProps = {
  content: string;
};

export function LegalDocument({
  content,
}: LegalDocumentProps) {
  return (
    <article className="legal-document">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}