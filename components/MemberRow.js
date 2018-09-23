import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';

import { findCurrencyBalance } from '../utils/currency';

export default class MemberRow extends React.Component {
  render() {
    const { member, currencyCode, onPressed, lighterColors } = this.props;

    const { fullName, pictures } = member;
    const { amount } = findCurrencyBalance(member, currencyCode);
    const { medium: pictureUri } = pictures;

    const rowOwesStyle = lighterColors ? styles.rowOwesLighter : styles.rowOwes;
    const rowGetsBackStyle = lighterColors ? styles.rowGetsBackLighter : styles.rowGetsBack;

    return (
      <TouchableOpacity onPress={() => onPressed(member)} activeOpacity={ACTIVE_OPACITY}>
        <View style={[styles.row, amount < 0 ? rowOwesStyle : rowGetsBackStyle]}>
          <View style={styles.userInfo}>
            <Image style={styles.userAvatar} source={{ uri: pictureUri }} />
            <Text style={[styles.text, styles.userName]}>{fullName}</Text>
          </View>
          <Text style={styles.text}>{`${amount} ${currencyCode}`}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const ACTIVE_OPACITY = 0.5;

const styles = StyleSheet.create({
  row: {
    marginHorizontal: 3,
    marginBottom: 5,
    padding: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowOwes: {
    backgroundColor: '#ffa280',
  },
  rowGetsBack: {
    backgroundColor: '#8ed7c4',
  },
  rowOwesLighter: {
    backgroundColor: '#ffc7b3',
  },
  rowGetsBackLighter: {
    backgroundColor: '#c6ebe1',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});
