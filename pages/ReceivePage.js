import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, AsyncStorage, ActivityIndicator,  Platform } from 'react-native';
import { Button } from 'react-native-common';
import Svg, { Path, RadialGradient, Rect, Defs, Stop } from 'react-native-svg';
import StellarAccount from '../helper/StellarAccount';
import FormattingUtils from '../helper/FormattingUtils';
import Transaction from '../components/Transaction';

export default class ReceivePage extends React.Component {
  
  async componentWillMount() {
    let accountId = await AsyncStorage.getItem('@Flux:accountId')
    console.log('accountId: ', accountId)
    let balance = await StellarAccount.getBalance(accountId)
    this.setState({ balance, isLoadingBalance: false })
  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <Text>receive</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  svgContainer: {
    position: 'absolute',
  }, 
});
