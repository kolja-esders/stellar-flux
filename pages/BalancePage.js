import React from 'react';
import { StatusBar, StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, AsyncStorage, ActivityIndicator,  Platform, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-common';
import Svg, { Path, RadialGradient, Rect, Defs, Stop } from 'react-native-svg';
import { connect } from "react-redux";
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StellarAccount from '../helper/StellarAccount';
import FormattingUtils from '../helper/FormattingUtils';
import NavigationUtils from '../helper/NavigationUtils';
import Transaction from '../components/Transaction';

const mapStateToProps = state => ({
  accountId: state.account.id,
  balance: state.account.balance
})

class BalancePage extends React.Component {
  
  state = { isLoadingBalance: false, isMounted: true, refreshing: false }

  static navigationOptions = {
    header: null
  }

  async componentWillMount() {
    let test = await StellarAccount.getTransactions(this.props.accountId)
    console.log(test)

    //if (!this.props.balance && this.state.isMounted) {
      //this.setState({ ...state, isLoadingBalance: true })
    //}
    //let balance = await StellarAccount.getBalance(this.props.accountId)

    //if (this.state.isMounted) {
      //this.setState({ isLoadingBalance: false })
    //}
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
      <StatusBar
         backgroundColor="#1976D2"
         barStyle="light-content"
       />
        <View style={styles.topContainer}>
          { this.state.isLoadingBalance ? 
            <ActivityIndicator style={styles.loadingIndicator} size={36} color='#effbf3' />
            :
            <View style={styles.topInner}>
              <Svg height={height * 0.125} width={height * 0.125} viewBox='0 0 1792 1792'>
                <Path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z" fill='#fff'/>
              </Svg>
              <View style={styles.balanceContainer}>
                <Text style={styles.balance}>
                  { FormattingUtils.formatAmount(this.props.balance, 2) } <Text style={styles.balanceCurrency}>XLM</Text>
                </Text>
                <Text style={styles.balanceConverted}>
                  7853.75 EUR
                </Text>
              </View>
            </View>
          }
        </View>

        <View style={styles.transactionsContainer}>
          <Transaction
            containerStyle={styles.transactionItem}
            amount={100}
            date={'01.02.2018'}
            memo='very very very looooooong memo of something important I guess'
          />
          <View style={styles.itemDivider} />
          <Transaction
            containerStyle={styles.transactionItem}
            amount={-20020.54}
            date={'12.01.2018'}
            memo='very very very looooooong memo of something important I guess'
          />
          <View style={styles.itemDivider} />
          <Transaction
            containerStyle={styles.transactionItem}
            memo='test'
            amount={-20020.54}
            date={'12.01.2018'}
          />
        </View>

        <ActionButton buttonColor="#2979FF" fixNativeFeedbackRadius={true}>
          <ActionButton.Item buttonColor='#fff' title="Send XLM" onPress={() => NavigationUtils.navigateWithEffectsTo('SendPage', this)}>
            <Icon name="send" size={24} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#fff' title="Receive XLM" onPress={() => NavigationUtils.navigateWithEffectsTo('ReceivePage', this)}>
            <Icon name="mail" size={24} />
          </ActionButton.Item>
        </ActionButton>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps)(BalancePage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  svgContainer: {
    position: 'absolute',
  }, 
  topContainer: {
    height: '25%',
    width: '100%',
    justifyContent: 'center',
    elevation: 8,
    backgroundColor: '#2196F3'
  },
  rippleBackground: {
    borderRadius: 500,
    padding: 24,
  },
  balance: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 36,
  },
  balanceCurrency: {
    fontSize: 16,
    color: '#fff',
  },
  balanceConverted: {
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
    color: '#FAFAFA',
    fontSize: 16,
  },
  heading: {
    fontFamily: 'sans-serif',
    fontWeight: '400',
    fontSize: 16,
    color: '#9E9E9E',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 8,
    marginBottom: 8
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
  itemDivider: {
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  transactionsContainer: {
    width: '100%',
    //paddingLeft: 16,
    //paddingRight: 16,
    flex: 1,
    overflow: 'hidden'
  },
  transactionItem: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    height: 72
  },
  topInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 32
  },
  balanceContainer: {
    flexGrow: 1,
    marginRight: 32
  }
});
