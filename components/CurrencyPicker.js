import React from 'react';
import { StyleSheet, Picker, View, Text } from 'react-native';

export default class CurrenyPicker extends React.Component {
  render() {
    const { currencies, onValueChange, selectedValue } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Choose currency:</Text>
        <Picker style={styles.picker} selectedValue={selectedValue} onValueChange={onValueChange}>
          {currencies.map(currency => (
            <Picker.Item key={currency} label={currency} value={currency} />
          ))}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  picker: {
    flex: 1,
  },
});
