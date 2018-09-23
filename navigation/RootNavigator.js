import { createSwitchNavigator } from 'react-navigation';

import UserNavigator from './UserNavigator';
import HomeScreen from '../screens/HomeScreen';

const RootNavigator = createSwitchNavigator(
  {
    Home: HomeScreen,
    User: UserNavigator,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  }
);

export default RootNavigator;
