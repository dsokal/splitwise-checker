import { AuthSession } from 'expo';

import config from '../config';
import Client from './client';

const CONSUMER_KEY = config.splitwise.consumerKey;

const apiClient = new Client();

const REDIRECT_URL = AuthSession.getRedirectUrl();
const AUTH_URL =
  'https://secure.splitwise.com/oauth/authorize' +
  `?client_id=${CONSUMER_KEY}` +
  `&response_type=code` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}`;

export default async function authenticateAsync() {
  try {
    const authResult = await AuthSession.startAsync({
      authUrl: AUTH_URL,
    });

    if (authResult.type !== 'success') {
      return;
    }

    const { code } = authResult.params;
    const { token } = await _createApiTokenWithCode(code);
    return token;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function _createApiTokenWithCode(code) {
  return await apiClient.post('/auth/application-token', { code });
}
