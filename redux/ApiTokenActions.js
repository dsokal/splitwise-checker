import { SecureStore } from 'expo';

const API_TOKEN_KEY = 'api_token_dupa1231';

export default {
  setApiToken(apiToken) {
    return async dispatch => {
      await SecureStore.setItemAsync(API_TOKEN_KEY, apiToken);
      return dispatch({
        type: 'apiTokenSet',
        value: apiToken,
      });
    };
  },

  restoreApiToken() {
    return async dispatch => {
      const apiToken = await SecureStore.getItemAsync(API_TOKEN_KEY);
      return dispatch({
        type: 'apiTokenRestored',
        value: apiToken,
      });
    };
  },

  signOut() {
    return async dispatch => {
      return dispatch({
        type: 'apiTokenReset',
      });
    };
  },
};
