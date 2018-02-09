import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Platform, AsyncStorage, TouchableOpacity, TextInput, Clipboard, ToastAndroid } from 'react-native';
import Svg, { Path, RadialGradient, Rect, Defs, Stop } from 'react-native-svg';
import QRCode from 'react-native-qrcode-svg';
import DeviceBrightness from 'react-native-device-brightness';

export default class ReceivePage extends React.Component {

  state = { accountId: '', isBrightnessIncreased: false, originalBrightness: 0 }
  
  async componentWillMount() {
    let accountId = await AsyncStorage.getItem('@Flux:accountId')
    this.setState({ accountId })
  }

  componentWillUnmount() {
    if (this.state.isBrightnessIncreased) {
      DeviceBrightness.setBrightnessLevel(this.state.originalBrightness);
    }
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

  onTextPress = () => {
    console.log('tesssst')
    Clipboard.setString(this.state.accountId); 
    ToastAndroid.show('Copied account id to clipboard', ToastAndroid.LONG)
  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <Svg style={styles.svgContainer} height={height} width={width}>
          <Defs>
            <RadialGradient id="grad" cx="100%" cy="150%" rx={2*height} ry={2*height} fx="50%" fy="50%" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#002348" stopOpacity="1" />
              <Stop offset="100%" stopColor="#08B5E5" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
        </Svg>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <TouchableOpacity style={styles.codeContainer} activeOpacity={1} onPress={this.onCodePress}>
            <QRCode
              color='#444'
              size={width * 0.618}
              value="GA6NL6C2IDWOPTB6USS4O3VRIODUDXIZPCIFZXA2YG7MNS6M3ORE3JBE"
            />
          </TouchableOpacity>
          <Text style={styles.actionDesc}>SCAN QR CODE</Text>
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.actionDesc}>SHARE ACCOUNT ID</Text>
          <TouchableOpacity onPress={this.onTextPress} activeOpacity={0.7}>
            <Text style={styles.accountIdText} numberOfLines={1}>
              {this.state.accountId}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
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
    elevation: 1,
    marginBottom: 16
  },
  actionDesc: {
    color: '#effbf3',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    fontSize: 20
  },
  dividerContainer: {
    marginTop: 32,
    marginBottom: 32,
    flex:1,
    flexGrow: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dividerLine: {
    width: '20%',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  dividerText: {
    fontFamily: 'sans-serif-light',
    color: 'rgba(255, 255, 255, 0.3)',
    paddingLeft: 16,
    paddingRight: 16
  },
  accountIdText: {
    fontFamily: 'sans-serif-light',
    backgroundColor: '#fff',
    borderRadius: 3,
    padding: 16,
    margin: 16
  },
});
