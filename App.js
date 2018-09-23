import React from 'react';
import { Provider } from 'react-redux';

import RootNavigator from './navigation/RootNavigator';
import Store from './redux/Store';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <RootNavigator />
      </Provider>
    );
  }
}
