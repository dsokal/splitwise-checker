import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { AppLoading, SplashScreen } from 'expo';

import Store from '../redux/Store';
import ApiTokenActions from '../redux/ApiTokenActions';
import authenticateAsync from '../api/authenticate';

const mapStateToProps = state => ({
  apiToken: state.apiToken,
});

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.apiToken.restored &&
      this.props.apiToken.restored !== prevProps.apiToken.restored
    ) {
      SplashScreen.hide();
    }
    if (this.props.apiToken.value && this.props.apiToken.value !== prevProps.apiToken.value) {
      this._navigateToGroups();
    }
  }

  render() {
    const { apiToken } = this.props;

    if (!apiToken.restored) {
      return (
        <AppLoading
          startAsync={this._restoreApiTokenAsync}
          onFinish={() => {}}
          onError={this._handleLoadingError}
          autoHideSplash={false}
        />
      );
    }

    if (apiToken.value) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Who's paying for lunch?</Text>
        <Text style={styles.subheading}>
          Would you like to know who has the biggest debt in a Splitwise group?
        </Text>
        <Text style={styles.subheading}>
          You can check it using this app. Please log in using your Spliwise account.
        </Text>
        <Button title="Log in" onPress={this._handleLoginButtonPress} />
      </View>
    );
  }

  _restoreApiTokenAsync = () => {
    Store.dispatch(ApiTokenActions.restoreApiToken());
  };

  _handleLoadingError = async err => {
    SplashScreen.hide();
    // do sth here, maybe display error screen
    console.error(err);
  };

  _handleLoginButtonPress = async () => {
    const apiToken = await authenticateAsync();
    Store.dispatch(ApiTokenActions.setApiToken(apiToken));
  };

  _navigateToGroups() {
    this.props.navigation.navigate('Groups');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  heading: {
    marginBottom: 25,
    paddingHorizontal: 50,
    fontSize: 50,
    textAlign: 'center',
  },
  subheading: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default connect(mapStateToProps)(HomeScreen);
