import { getFolderClippings } from '@/content/queries';
import { CaseFilesView } from './case-files-view';

export function CaseFiles() {
  return <CaseFilesView folders={getFolderClippings()} />;
}
