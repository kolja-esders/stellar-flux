import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, AsyncStorage, ActivityIndicator,  Platform, RefreshControl, ScrollView } from 'react-native';
import { Button } from 'react-native-common';
import Svg, { Path, RadialGradient, Rect, Defs, Stop } from 'react-native-svg';
import StellarAccount from '../helper/StellarAccount';
import FormattingUtils from '../helper/FormattingUtils';
import Transaction from '../components/Transaction';

export default class BalancePage extends React.Component {
  
  state = { balance: 22907.3978986, isLoadingBalance: true, isMounted: true, refreshing: false }

  async componentWillMount() {
    let accountId = await AsyncStorage.getItem('@Flux:accountId')
    console.log('accountId: ', accountId)
    let balance = await StellarAccount.getBalance(accountId)
    if (this.state.isMounted) {
      this.setState({ balance, isLoadingBalance: false })
    }
  }

  componentWillUnmount() {
    this.setState({ ...this.state, isMounted: false })
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 5000)
    //fetchData().then(() => {
      //this.setState({ refreshing: false });
    //});
    //

    // Fetch
    // - (new) transactions
    // - current balance
    // - exchange rate XLM / USD, XLM / EUR
  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            colors={['#08b5e5', '#002348']}
            progressViewOffset={height * 0.125 - 42}
          />
        }
      >
        <Svg
          style={styles.svgContainer}
          height={height * 0.25}
          width={width}
        >
          <Defs>
<RadialGradient id="grad" cx="200%" cy="200%" rx={2*height} ry={2*height} fx="50%" fy="50%" gradientUnits="userSpaceOnUse">
            <Stop
                offset="0%"
                stopColor="#002348"
                stopOpacity="1"
            />
            <Stop
                offset="100%"
                stopColor="#08B5E5"
                stopOpacity="1"
            />
        </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height * 0.25} fill="url(#grad)" />
        </Svg>
        <View style={styles.topContainer}>
          { this.state.isLoadingBalance ? 
            <ActivityIndicator style={styles.loadingIndicator} size={36} color='#effbf3' />
            :
            <View>
              <Text style={styles.balance}>
                { FormattingUtils.formatAmount(this.state.balance, 2) } <Text style={styles.balanceCurrency}>XLM</Text>
              </Text>
              <Text style={styles.balanceConverted}>
                7853.75 EUR
              </Text>
            </View>
          }
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.heading}>LAST TRANSACTIONS</Text>
          <Transaction
            containerStyle={styles.transactionItem}
            amount={100}
            date={'01.02.2018'}
            memo='very very very looooooong memo of something important I guess'
          />
          <Transaction
            containerStyle={styles.transactionItem}
            amount={-20020.54}
            date={'12.01.2018'}
            memo='very very very looooooong memo of something important I guess'
          />
          <Transaction
            containerStyle={styles.transactionItem}
            memo='test'
            amount={-20020.54}
            date={'12.01.2018'}
          />
          <View style={styles.seeAllButtonContainer}>
            <TouchableNativeFeedback
              style={styles.seeAllButtonRipple}
              background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.26)', true)}>
              <View>
                <Text style={styles.seeAllButton}>See all transactions</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.actionsInner}>
            <View>
              <TouchableNativeFeedback
                style={styles.rippleBackground}
                onPress={() => {this.props.navigation.navigate('ReceivePage')}}
                background={TouchableNativeFeedback.Ripple('#08b5e5', true)}>
                <View style={styles.actionInnerContainer}>
                  <Svg height={36} width={36}>
                    <Path d="M0 0h24v24H0z" fill="none"/>
                    <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" fill='#fff' fillOpacity={1} scale={1.5}/>
                  </Svg>
                </View>
              </TouchableNativeFeedback>
              <Text style={styles.actionCaption}>Receive</Text>
            </View>
            <View>
              <TouchableNativeFeedback
                style={styles.rippleBackground}
                onPress={() => {this.props.navigation.navigate('SendPage')}}
                background={TouchableNativeFeedback.Ripple('#08b5e5', true)}>
                <View style={styles.actionInnerContainer}>
                  <Svg height={36} width={36}>
                    <Path d="M0 0h24v24H0z" fill="none"/>
                    <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill='#fff' fillOpacity={1} scale={1.5}/>
                  </Svg>
                </View>
              </TouchableNativeFeedback>
              <Text style={styles.actionCaption}>Send</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  topContainer: {
    height: '25%',
    width: '100%',
    justifyContent: 'center',
  },
  rippleBackground: {
    borderRadius: 500,
    padding: 24,
  },
  balance: {
    color: '#dfdfdf',
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
    fontSize: 36,
  },
  balanceCurrency: {
    fontSize: 16,
    color: '#dfdfdf',
  },
  balanceConverted: {
    textAlign: 'center',
    fontFamily: 'sans-serif-thin',
    color: '#fff',
    fontSize: 16,
  },
  heading: {
    fontFamily: 'sans-serif',
    fontWeight: '600',
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
    marginTop: 24
  },
  actionsContainer: {
    bottom: 0,
    width: '100%',
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 32,
    paddingBottom: 16,
  },
  actionsInner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  actionCaption: {
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    textAlign: 'center'
  },
  actionInnerContainer: {
    alignItems: 'center',
    //justifyContent: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: '#08b5e5',
    borderRadius: 500,
    padding: 24,
  },
  dividerLine: {
    //marginTop: 32,
    //marginBottom: 32,
    width: '20%',
    borderBottomColor: '#08b5e5',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  seeAllButton: {
    textAlign: 'center',
    color: '#888',
    width: '100%',
    padding: 16
  },
  seeAllButtonContainer: {
    borderRadius: 3
  },
  transactionsContainer: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    overflow: 'hidden'
  },
  transactionItem: {
    elevation: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 3,
    marginBottom: 8
  }
});
