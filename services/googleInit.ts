const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const CLIENT_ID = '208114229627-v55ldp9518g7dj0fvt8deiq5uibreqmg.apps.googleusercontent.com';
const API_KEY = 'AIzaSyABfpHDt9a4f-nOV1MAJ9H6nFQqfWWC1D8';

export const initGoogleDrive = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    console.warn('initGoogleDrive called on server — skipped.');
    return;
  }

  const { gapi } = await import('gapi-script');

  return new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
          scope: SCOPES,
        })
        .then(() => {
          const auth = gapi.auth2.getAuthInstance();
          if (!auth.isSignedIn.get()) {
            return auth.signIn({
                scope: SCOPES,
                prompt: 'consent',
              }).then(resolve).catch(reject);
          }
          resolve();
        })
        .catch((err) => {
          console.error('GAPI init error:', err);
          reject(err);
        });
    });
  });
};
