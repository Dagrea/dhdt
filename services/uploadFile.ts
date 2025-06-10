import { useGoogleFolder } from '@services';

export const uploadFileToDrive = async ({ uri, name, mimeType }: { uri: string; name: string; mimeType: string }) => {
	if (typeof window === 'undefined') return null;

	const gapi = window.gapi;
	if (!gapi?.auth?.getToken) {
		console.warn('GAPI auth not initialized. Did you call gapiInit()?');
		return null;
	}

	const token = gapi.auth.getToken();
	if (!token) {
		console.warn('No GAPI auth token available.');
		return null;
	}

	try {
        const folderId = await useGoogleFolder();
		const blobRes = await fetch(uri);
		const blob = await blobRes.blob();

		const metadata = {
			name,
			parents: [folderId],
		};

		const form = new FormData();
		form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
		form.append('file', blob);

		const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
			method: 'POST',
			headers: new Headers({
				Authorization: `Bearer ${token.access_token}`,
			}),
			body: form,
		});

		if (!response.ok) {
			console.error('Google Drive upload failed', await response.text());
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error('Upload error:', error);
		return null;
	}
};
