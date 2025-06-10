/* eslint-disable max-len */
import { storageUtil } from '@utils';

/**
 * Retrieves an access token for authentication.
 * If a valid token is stored in the device's secure storage and has not expired, it is returned.
 * Otherwise, a new access token is fetched from the server using the provided credentials.
 * The fetched access token is then stored in the secure storage along with its expiration time.
 *
 * @returns {Promise<string>} A promise that resolves to an access token.
 */
export async function getToken() {
  const tokenExpiration = await storageUtil.getItem('token_expiration');
  if (tokenExpiration && Date.now() < JSON.parse(tokenExpiration)) {
    const accessToken = await storageUtil.getItem('access_token');
    return accessToken;
  }
  const res = await fetch(`https://xpc-dev.canvasmedical.com/auth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=${process.env.EXPO_PUBLIC_AUTH_GRANT_TYPE}&client_id=${process.env.EXPO_PUBLIC_CLIENT_ID}&client_secret=${process.env.EXPO_PUBLIC_CLIENT_SECRET}`,
  });
  const json = await res.json();
  await storageUtil.setItem('access_token', json.access_token);
  await storageUtil.setItem('token_expiration', JSON.stringify(Date.now() + json.expires_in - 1000));
  return json.access_token;
}
