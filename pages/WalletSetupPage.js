import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';
import { Button } from 'react-native-common';
import Svg, { Path, RadialGradient, Rect, Defs, Stop } from 'react-native-svg';

export default class WalletSetupPage extends React.Component {

  state = { secretKey: '' }

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <Svg
          style={styles.svgContainer}
          height={height}
          width={width}
        >
          <Defs>
<RadialGradient id="grad" cx="100%" cy="150%" rx={2*height} ry={2*height} fx="50%" fy="50%" gradientUnits="userSpaceOnUse">
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
          <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
        </Svg>

        <View style={styles.titleContainer}>
          <Svg height={72} width={72}>
            <Path d="M0 0h24v24H0z" fill="none"/>
            <Path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill='#fff' fillOpacity={0.3} scale={3} stroke='#effbf3' strokeWidth={0.3} strokeOpacity={0.7} />
          </Svg>
          <Text style={styles.title}>
            Wallet
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>
            CREATE
          </Text>
          <Text style={styles.desc}>
            Didn't use Stellar so far?{"\n"}Create a new wallet and get started.
          </Text>
          <Button
            style={styles.createButton}
            label='Create wallet'
            size='large'
            onPress={() => this.props.navigation.navigate('BalancePage') }
            borderRadius={3}
          />
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          <Text style={styles.heading}>
            IMPORT
          </Text>
          <Text style={styles.desc}>
            Already have a Stellar account?{"\n"}Paste your secret key in the box below.
          </Text>
          <TextInput
            placeholder='Secret key'
            style={styles.keyInput}
            autoCorrect={false}
            onChangeText={(secretKey) => this.setState({ secretKey })}
            value={this.state.text}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000'
  },
  svgContainer: {
    position: 'absolute',
  },
  titleContainer: {
    flex: 1,
    flexGrow: 0,
    marginTop: 116,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    marginLeft: 16,
    fontFamily: 'sans-serif-thin',
    fontSize: 48,
    color: '#effbf3',
  },
  keyInput: {
    fontFamily: 'sans-serif-light',
    backgroundColor: '#fff',
    borderRadius: 3,
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  content: {
    flex: 1,
    width: '100%',
    paddingLeft: 64,
    paddingRight: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70
  },
  createButton: {
    width: '100%'
  },
  heading: {
    fontFamily: 'sans-serif-thin',
    color: '#effbf3',
    textAlign: 'center',
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
  desc: {
    marginTop: 8,
    marginBottom: 8,
    fontFamily: 'sans-serif-thin',
    textAlign: 'center',
    color: '#effbf3',
    fontSize: 14,
    lineHeight: 24
  }
});
