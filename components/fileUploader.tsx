import * as DocumentPicker from 'expo-document-picker';
import { uploadFileToDrive } from '@services';

export const uploadLocalFile = async () => {
  const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
  if (result.type === 'success') {
    const file = {
      uri: result.uri,
      name: result.name,
      type: result.mimeType || 'application/octet-stream',
    } as File;

    return uploadFileToDrive(file);
  }
};