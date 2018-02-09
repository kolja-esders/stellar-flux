import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';

import WelcomePage from './WelcomePage';
import SecuritySetupPage from './SecuritySetupPage';
import WalletSetupPage from './WalletSetupPage';


export default class SetupContainerPage extends React.Component {

  static navigationOptions = {
    header: null
  }

  nextPageHandler = () => {
    this.refs.swiper.scrollBy(1)
  }

  render() {
    return (
      <Swiper
        ref="swiper"
        style={styles.wrapper}
        showButtons={false}
        dot={<View style={{backgroundColor: 'rgba(255,255,255,.3)', width: 10, height: 10, borderRadius: 5, marginLeft: 4, marginRight: 4}} />}
        activeDot={<View style={{backgroundColor: '#fff', width: 10, height: 10, borderRadius: 5, marginLeft: 4, marginRight: 4}} />}
        loop={false}
        paginationStyle={{bottom: '5%'}}>
        <WelcomePage goToNextPage={this.nextPageHandler} />
        <SecuritySetupPage goToNextPage={this.nextPageHandler} />
        <WalletSetupPage navigation={this.props.navigation} goToNextPage={this.nextPageHandler} />
      </Swiper>
    );
  }

}

const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  }
});
