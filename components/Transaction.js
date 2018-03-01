import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormattingUtils from '../helper/FormattingUtils';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Transaction extends React.Component {

  state = {isPositive: this.props.amount > 0}

  render() {
    return (
      <View style={this.props.containerStyle}>
        <View style={styles.inner}>
          { this.state.isPositive ? 
            <Icon name="call-received" size={24} style={styles.iconReceived} />
          :
            <Icon name="call-made" size={24} style={styles.iconSent} />
          }
          <View style={styles.midContainer}>
            <Text style={styles.otherParty}>G3SJHJK23KJHSD8343</Text>
            <Text style={styles.memo} numberOfLines={1}>{ this.props.memo }</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={this.props.amount >= 0 ? styles.amountPositive : styles.amountNegative}>
              { FormattingUtils.formatAmount(this.props.amount, 4) } <Text style={styles.currency}>XLM</Text>
            </Text>
            <Text style={styles.date}>{ this.props.date }</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    //fontSize: 14
  },
  iconSent: {
    padding: 8,
    backgroundColor: '#ef5350',
    color: '#fff',
    borderRadius: 20
  },
  iconReceived: {
    padding: 8,
    backgroundColor: '#66bb6a',
    color: '#fff',
    borderRadius: 20
  },
  amountPositive: {
    fontFamily: 'sans-serif-medium',
    color: '#66bb6a',
    marginLeft: 16
  },
  amountNegative: {
    fontSize: 14,
    fontFamily: 'sans-serif-medium',
    color: '#ef5350',
    marginLeft: 16
  },
  currency: {
  },
  date: {
    fontSize: 14,
    color: '#BDBDBD',
  },
  otherParty: {
    fontSize: 14,
    fontFamily: 'sans-serif-medium'
  },
  memo: {
    color: '#BDBDBD',
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  midContainer: {
    flexShrink: 1,
    flexGrow: 1,
    marginLeft: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  }
});
