import { Record } from 'immutable';

const ApiTokenState = Record({
  restored: false,
  value: null,
});

export default (state = new ApiTokenState(), action) => {
  switch (action.type) {
    case 'apiTokenRestored':
      return new ApiTokenState({
        restored: true,
        value: action.value,
      });
    case 'apiTokenSet':
      return state.set('value', action.value);
    case 'apiTokenReset':
      return new ApiTokenState();
    default:
      return state;
  }
};
