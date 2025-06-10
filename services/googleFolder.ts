import { storageUtil } from '@utils';

const FOLDER_KEY = 'googleFolderId';
const FOLDER_NAME = 'dhdt-med';

export const useGoogleFolder = async (): Promise<string> => {
  const cachedId = await storageUtil.getItem(FOLDER_KEY);
  if (cachedId) return cachedId;

  const gapi = window.gapi;

  const searchRes = await gapi.client.drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${FOLDER_NAME}' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  const files = searchRes.result.files;
  if (files.length > 0) {
    const id = files[0].id;
    await storageUtil.setItem(FOLDER_KEY, id);
    return id;
  }

  const createRes = await gapi.client.drive.files.create({
    resource: {
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    },
    fields: 'id',
  });

  const newId = createRes.result.id;
  await storageUtil.setItem(FOLDER_KEY, newId);
  return newId;
};
