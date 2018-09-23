import Store from './Store';
import ApiClient from '../api/client';

const DEBUG = true;

export default {
  fetchGroups() {
    return async dispatch => {
      const { apiToken } = Store.getState();
      const apiClient = new ApiClient(apiToken.value);
      const groups = DEBUG ? require('./fakeGroups.json') : await apiClient.get('/user/groups');
      return dispatch({
        type: 'groupsFetched',
        groups,
      });
    };
  },
};
