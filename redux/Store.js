import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import ApiTokenReducer from './ApiTokenReducer';
import GroupsReducer from './GroupsReducer';

const reduce = combineReducers({
  apiToken: ApiTokenReducer,
  groups: GroupsReducer,
});

export default createStore(reduce, applyMiddleware(thunk));
