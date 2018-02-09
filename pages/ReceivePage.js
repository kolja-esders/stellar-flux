import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Platform, AsyncStorage, TouchableOpacity } from 'react-native';
import Svg, { Path, RadialGradient, Rect, Defs, Stop } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import DeviceBrightness from 'react-native-device-brightness';

export default class ReceivePage extends React.Component {

  state = { accountId: '', isBrightnessIncreased: false, originalBrightness: 0 }
  
  async componentWillMount() {
    let accountId = await AsyncStorage.getItem('@Flux:accountId')
    this.setState({ accountId })
  }

  onCodePress = async () => {
    if (this.state.isBrightnessIncreased) {
      return
    }
    let originalBrightness = await DeviceBrightness.getBrightnessLevel()
    this.setState({ originalBrightness, isBrightnessIncreased: true }, () => {
      DeviceBrightness.setBrightnessLevel(1);
      setTimeout(() => {
        DeviceBrightness.setBrightnessLevel(originalBrightness);
        this.setState({ isBrightnessIncreased: false })
      }, 3000)
    })
  }

  componentWillUnmount() {
    DeviceBrightness.setBrightnessLevel(this.state.originalBrightness);
  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Svg style={styles.svgContainer} height={height} width={width}>
          <Defs>
            <RadialGradient id="grad" cx="100%" cy="150%" rx={2*height} ry={2*height} fx="50%" fy="50%" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#002348" stopOpacity="1" />
              <Stop offset="100%" stopColor="#08B5E5" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
        </Svg>
        <TouchableOpacity style={styles.codeContainer} activeOpacity={1} onPress={this.onCodePress}>
          <QRCode
            color='#444'
            size={width * 0.618}
            value="GA6NL6C2IDWOPTB6USS4O3VRIODUDXIZPCIFZXA2YG7MNS6M3ORE3JBE"
          />
        </TouchableOpacity>
        <Text style={styles.scanDesc}>Scan me!</Text>
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
  codeContainer: {
    marginTop: '14.6%',
    padding: '5%',
    borderRadius: 3,
    backgroundColor: '#fff',
    elevation: 1
  },
  scanDesc: {
  }
});
