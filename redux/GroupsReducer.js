import { Record } from 'immutable';

const GroupsState = Record({
  list: null,
  byId: null,
});

export default (state = new GroupsState(), action) => {
  switch (action.type) {
    case 'groupsFetched': {
      const { groups } = action;
      const filteredGroups = groups.filter(({ id }) => id !== 0);
      const ids = filteredGroups.map(({ id }) => id);
      const byId = filteredGroups.reduce((acc, group) => {
        acc[group.id] = group;
        return acc;
      }, {});
      return new GroupsState({
        list: ids,
        byId,
      });
    }
    default:
      return state;
  }
};
