import { createStackNavigator } from 'react-navigation';

import GroupsScreen from '../screens/GroupsScreen';
import GroupScreen from '../screens/GroupScreen';

const navigationOptions = {
  headerStyle: {
    backgroundColor: '#48be9d',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const UserNavigator = createStackNavigator(
  {
    Groups: GroupsScreen,
    Group: GroupScreen,
  },
  {
    initialRouteName: 'Groups',
    navigationOptions,
  }
);

export default UserNavigator;
