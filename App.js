import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import SetupContainerPage from './pages/SetupContainerPage';
import BalancePage from './pages/BalancePage';

const RootStack = StackNavigator({
    SetupPage: {
      screen: SetupContainerPage
    },
    BalancePage: {
      screen: BalancePage
    },
  }, {
    initialRouteName: 'SetupPage',
    headerMode: 'none',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
