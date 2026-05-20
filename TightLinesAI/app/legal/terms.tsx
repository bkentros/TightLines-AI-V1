import { LegalDocumentScreen } from '../../components/legal/LegalDocumentScreen';
import { LEGAL_DOCUMENTS } from '../../lib/legalDocuments';

export default function TermsOfServiceScreen() {
  return <LegalDocumentScreen document={LEGAL_DOCUMENTS.terms} />;
}
