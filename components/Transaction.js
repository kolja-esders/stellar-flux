import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormattingUtils from '../helper/FormattingUtils';

export default class Transaction extends React.Component {
  
  render() {
    return (
      <View style={this.props.containerStyle}>
        <View style={styles.inner}>
          <Text style={styles.date}>
            { this.props.date }
          </Text>
          <Text style={styles.memo} numberOfLines={1}>{ this.props.memo }</Text>
          <Text style={this.props.amount >= 0 ? styles.amountPositive : styles.amountNegative}>
            { FormattingUtils.formatAmount(this.props.amount, 4) } <Text style={styles.currency}>XLM</Text>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
  },
  amountPositive: {
    color: '#66bb6a',
    marginLeft: 8
  },
  amountNegative: {
    color: '#ef5350',
    marginLeft: 8
  },
  currency: {
  },
  date: {
    color: '#aaa',
    marginRight: 8
  },
  memo: {
    flexShrink: 1,
    flexGrow: 1,
  },
});
