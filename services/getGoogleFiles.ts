import { useGoogleFolder } from '@services';

export const listFilesInFolder = async () => {
    if (typeof window === 'undefined') return [];
    const gapi = window.gapi;
  
    if (!gapi?.client?.getToken) {
      console.warn('GAPI client not initialized. Did you call gapiInit()?');
      return [];
    }
  
    const folderId = await useGoogleFolder();
  
    try {
      const response = await gapi.client.drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, webViewLink, webContentLink, createdTime, size, thumbnailLink)',
      });
  
      return response.result.files;
    } catch (error) {
      console.error('Failed to list files from Google Drive:', error);
      return [];
    }
  };
  
  