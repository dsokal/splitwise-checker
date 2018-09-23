import React from 'react';
import { StyleSheet, FlatList, View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { Icon, SearchBar } from 'react-native-elements';
import _ from 'lodash';

import CurrencyPicker from '../components/CurrencyPicker';
import MemberRow from '../components/MemberRow';

import createSearch from '../utils/search';
import { findAvailableCurrencies, findCurrencyBalance } from '../utils/currency';

const mapStateToProps = (state, ownProps) => {
  const { navigation } = ownProps;
  const groupId = navigation.getParam('groupId');
  const group = state.groups.byId[groupId];
  return { group };
};

class GroupScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const { params = {} } = navigation.state;
    const { group } = screenProps;
    return {
      title: `Group: ${group ? group.name : 'unknown'}`,
      headerRight: (
        <Icon
          name="attach-money"
          containerStyle={styles.currencyIconContainer}
          color="white"
          underlayColor="#35977b"
          onPress={() => params.handleCurrencyTogglePressed()}
        />
      ),
    };
  };

  state = {
    search: null,
    currencyCode: null,
    showCurrencySelect: false,
    selectedMemberIds: new Set(),
  };

  constructor(props) {
    super(props);

    const { members } = props.group;

    const search = createSearch(members, ['fullName']);
    const [allCurrencyCodes, selectedCurrencyCode] = findAvailableCurrencies(members);
    const membersById = this._indexMembersById(members);
    const visibleMemberIds = new Set(Object.keys(membersById).map(Number));

    this.state = {
      membersById,
      visibleMemberIds,
      currencyCode: selectedCurrencyCode,
      availableCurrencyCodes: allCurrencyCodes,
      search,
      selectedMemberIds: new Set(),
    };
  }

  render() {
    const { showCurrencySelect, availableCurrencyCodes, currencyCode } = this.state;

    const [selectedMembers, notSelectedMembers] = this._getSplitMembers();
    const sortedSelectedMembers = this._sortedByBalanceDesc(selectedMembers);
    const sortedNotSelectedMembers = this._sortedByBalanceDesc(notSelectedMembers);

    const showSeparator = sortedSelectedMembers.length > 0 && sortedNotSelectedMembers.length > 0;

    return (
      <View>
        <SearchBar
          platform="android"
          cancelIcon={{ type: 'font-awesome', name: 'chevron-left' }}
          lightTheme
          onChangeText={_.debounce(this._handleSearchTextChanged, 150)}
          onClear={this._handleSearchTextCleared}
          placeholder="Type here to filter people..."
          ref={search => (this.search = search)}
        />
        {showCurrencySelect && (
          <CurrencyPicker
            style={styles.currencyPicker}
            currencies={availableCurrencyCodes}
            selectedValue={currencyCode}
            onValueChange={this._handleCurrencyChanged}
          />
        )}
        <ScrollView
          contentContainerStyle={
            showCurrencySelect ? styles.listContainerExtraPadding : styles.listContainer
          }
          keyboardShouldPersistTaps="always">
          {sortedSelectedMembers.length > 0 && (
            <FlatList
              style={styles.memberList}
              data={sortedSelectedMembers}
              renderItem={this._renderMember}
              keyExtractor={({ id }) => String(id)}
              keyboardShouldPersistTaps="always"
            />
          )}
          {showSeparator && <View style={styles.separator} />}
          {sortedNotSelectedMembers.length > 0 && (
            <FlatList
              style={styles.memberList}
              data={sortedNotSelectedMembers}
              renderItem={i => this._renderMember(i, true)}
              keyExtractor={({ id }) => String(id)}
              keyboardShouldPersistTaps="always"
            />
          )}
        </ScrollView>
      </View>
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleCurrencyTogglePressed: this._handleCurrencyTogglePressed,
    });
  }

  _indexMembersById(members) {
    return members.reduce((acc, member) => {
      acc[member.id] = member;
      return acc;
    }, {});
  }

  _getSplitMembers() {
    const { membersById, visibleMemberIds, selectedMemberIds } = this.state;

    const visibleMemberIdsArray = Array.from(visibleMemberIds);
    const visibleSelectedMemberIds = _.intersection(
      visibleMemberIdsArray,
      Array.from(selectedMemberIds)
    );
    const visibleNotSelectedMemberIds = _.difference(
      visibleMemberIdsArray,
      visibleSelectedMemberIds
    );

    const selectedMemers = _.pick(membersById, visibleSelectedMemberIds);
    const notSelectedMembers = _.pick(membersById, visibleNotSelectedMemberIds);
    return [Object.values(selectedMemers), Object.values(notSelectedMembers)];
  }

  _renderMember = ({ item: member }, lighterColorsIfAnySelected = false) => {
    const { currencyCode, selectedMemberIds } = this.state;
    const lighterColors = lighterColorsIfAnySelected && selectedMemberIds.size > 0;
    return (
      <MemberRow
        lighterColors={lighterColors}
        currencyCode={currencyCode}
        member={member}
        onPressed={this._handleMemberPressed}
      />
    );
  };

  _sortedByBalanceDesc(members) {
    const { currencyCode } = this.state;
    return _.sortBy(members, member => {
      const balance = findCurrencyBalance(member, currencyCode);
      return balance.amount;
    });
  }

  _handleSearchTextChanged = searchQuery => {
    const { search, membersById } = this.state;
    const newVisibleMemberIds = !searchQuery
      ? Object.keys(membersById).map(Number)
      : search.search(searchQuery).map(({ id }) => id);
    this.setState({ visibleMemberIds: newVisibleMemberIds, searchQuery });
  };

  _handleSearchTextCleared = () => {
    const { membersById } = this.state;
    const newVisibleMemberIds = Object.keys(membersById).map(Number);
    this.setState({ visibleMemberIds: newVisibleMemberIds, searchQuery: null });
  };

  _handleCurrencyChanged = currencyCode => {
    this.setState({ currencyCode });
  };

  _handleCurrencyTogglePressed = () => {
    this.setState(({ showCurrencySelect }) => ({ showCurrencySelect: !showCurrencySelect }));
  };

  _handleMemberPressed = ({ id }) => {
    const { selectedMemberIds, searchQuery } = this.state;
    if (selectedMemberIds.has(id)) {
      selectedMemberIds.delete(id);
    } else {
      selectedMemberIds.add(id);
    }
    this.setState({ selectedMemberIds });
    if (searchQuery) {
      this.search.clear();
      Keyboard.dismiss();
    }
  };
}

const styles = StyleSheet.create({
  memberList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 55,
  },
  listContainerExtraPadding: {
    paddingBottom: 105,
  },
  currencyPicker: {
    height: 50,
  },
  currencyIconContainer: {
    backgroundColor: '#3caa8b',
    padding: 2,
    marginRight: 10,
  },
  separator: {
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    marginBottom: 5,
  },
});

export default connect(mapStateToProps)(GroupScreen);
