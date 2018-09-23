import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';

import Store from '../redux/Store';
import GroupsActions from '../redux/GroupsActions';

const mapStateToProps = state => ({
  groups: state.groups,
});

class GroupsScreen extends React.Component {
  static navigationOptions = {
    title: 'Groups',
  };

  render() {
    const { groups } = this.props;

    if (!groups) {
      return (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <FlatList
        style={styles.mainContainer}
        data={groups.list}
        renderItem={this._renderItem}
        keyExtractor={id => String(id)}
      />
    );
  }

  componentDidMount() {
    Store.dispatch(GroupsActions.fetchGroups());
  }

  _renderItem = ({ item: groupId }) => {
    const group = this.props.groups.byId[groupId];
    return (
      <TouchableHighlight
        onPress={() => this._onGroupPress(groupId)}
        style={styles.row}
        underlayColor={highlightedColor}>
        <View>
          <Text style={styles.rowText}>{group.name}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  _onGroupPress(groupId) {
    this.props.navigation.navigate('Group', { groupId });
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 1,
    marginTop: 10,
  },
  row: {
    marginHorizontal: 3,
    marginBottom: 5,
    backgroundColor: '#c6ebe1',
  },
  rowText: {
    fontSize: 16,
    padding: 15,
  },
});

const highlightedColor = '#a1decd';

export default connect(mapStateToProps)(GroupsScreen);
