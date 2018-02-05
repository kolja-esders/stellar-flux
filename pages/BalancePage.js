import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, Platform } from 'react-native';
import { Button } from 'react-native-common';
import Svg, { Path, RadialGradient, Rect, Defs, Stop } from 'react-native-svg';

export default class BalancePage extends React.Component {
  
  state = { balance: 22907.3978986  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <Svg
          style={styles.svgContainer}
          height={230}
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
          <Rect x="0" y="0" width={width} height={230} fill="url(#grad)" />
        </Svg>
        <View style={styles.topContainer}>
          <Text style={styles.balance}>
            { this.state.balance.toFixed(2) }
          </Text>
          <Text style={styles.balanceConverted}>
            7853.75 EUR
          </Text>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.heading}>LAST TRANSACTIONS</Text>
          <View style={styles.transactionItem}>
            <Text>testsa1234</Text>
          </View>
          <View style={styles.transactionItem}>
            <Text>test2</Text>
          </View>
          <View style={styles.transactionItem}>
            <Text>test3</Text>
          </View>
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
          <View style={styles.actionReceive}>
            <TouchableNativeFeedback
              style={styles.rippleBackground}
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
          <View style={styles.actionSend}>
            <TouchableNativeFeedback
              style={styles.rippleBackground}
              background={TouchableNativeFeedback.Ripple('#08b5e5', true)}>
              <View style={styles.actionInnerContainer} onPress={() => console.log('test')}>
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
    width: '100%',
    paddingBottom: 32,
  },
  rippleBackground: {
    borderRadius: 500,
    padding: 24,
  },
  balance: {
    color: '#dfdfdf',
    textAlign: 'center',
    fontFamily: 'sans-serif-light',
    fontSize: 48,
    marginTop: 100,
  },
  balanceConverted: {
    textAlign: 'center',
    fontFamily: 'sans-serif-thin',
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
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
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    paddingLeft: 48,
    paddingRight: 48,
    marginBottom: 32,
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
    justifyContent: 'center',
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
    paddingRight: 16
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
