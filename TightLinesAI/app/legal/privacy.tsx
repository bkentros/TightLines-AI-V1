import { LegalDocumentScreen } from '../../components/legal/LegalDocumentScreen';
import { LEGAL_DOCUMENTS } from '../../lib/legalDocuments';

export default function PrivacyPolicyScreen() {
  return <LegalDocumentScreen document={LEGAL_DOCUMENTS.privacy} />;
}
