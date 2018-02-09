import React from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { StackNavigator } from 'react-navigation';

import SetupContainerPage from './pages/SetupContainerPage';
import BalancePage from './pages/BalancePage';
import SendPage from './pages/SendPage';
import ReceivePage from './pages/ReceivePage';

const RootStack = StackNavigator({
    SetupPage: {
      screen: SetupContainerPage
    },
    BalancePage: {
      screen: BalancePage
    },
    SendPage: {
      screen: SendPage
    },
    ReceivePage: {
      screen: ReceivePage
    },
  }, {
    initialRouteName: 'SetupPage',
    headerMode: 'screen'
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
