import React from 'react';
import { StyleSheet, Text, View, Dimensions, AsyncStorage, TextInput } from 'react-native';
import Svg, { RadialGradient, Rect, Defs, Stop, Path, Use, ClipPath } from 'react-native-svg';
import { Button } from 'react-native-common';
import CodeInput from 'react-native-confirmation-code-input';
//import TouchID from 'react-native-touch-id';
import SecurityUtils from '../helper/SecurityUtils';

export default class SecuritySetupPage extends React.Component {

  async handlePin(pin) {
    //let salt = SecurityUtils.generateSalt(10)
    //SecurityUtils.hashPinWithSalt(pin, salt)
    try {
      await AsyncStorage.setItem('@Flux:pin', pin);
    } catch (error) {
      // Error saving data
    }
    this.props.goToNextPage();
  }

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
<RadialGradient id="grad" cx="200%" cy="150%" rx={2*height} ry={2*height} fx="50%" fy="50%" gradientUnits="userSpaceOnUse">
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
            <Defs>
              <Path d="M0 0h24v24H0V0z" id="a"/>
            </Defs>
            <ClipPath id="b">
              <Use overflow="visible" href="#a"/>
            </ClipPath>
            <Path clip-path="url(#b)" d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z" fill='#fff' fillOpacity={0.3} scale={3} stroke='#effbf3' strokeWidth={0.3} strokeOpacity={0.7} />
          </Svg>
          <Text style={styles.title}>
            Security
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>
            CONFIRMATION PIN
          </Text>
          <Text style={styles.desc}>
            Assign a PIN that will be used to confirm transactions in the future.
          </Text>
          <Text style={styles.descImportant}>
            Warning: You will loose access to your funds if you forget your PIN.
          </Text>

          <View style={styles.codeWrapper}>
            <CodeInput
              secureTextEntry
              activeColor='rgba(255, 255, 255, 1)'
              inactiveColor='rgba(255, 255, 255, 0.3)'
              codeLength={4}
              keyboardType="numeric"
              autoFocus={false}
              inputPosition='left'
              onFulfill={(pin) => this.handlePin(pin) }
              containerStyle={{ marginTop: 0 }}
              codeInputStyle={{ color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: 24, fontWeight: '800', borderWidth: 0.5, borderColor: '#fff', borderRadius: 3, height: 60, width: 45, marginLeft: 5, marginRight: 5 }}
            />
          </View>

          { false &&
            <View>
            <Text style={styles.nextHeading}>
              FINGERPRINT
            </Text>
            <Text style={styles.desc}>
              Two-factor authentication.{"\n"}Protect your app with a fingerprint.
            </Text>
            { !this.state.fingerprintSetupDone?
              <Button
                style={styles.createButton}
                label='Setup fingerprint'
                size='large'
                onPress={() => this.handleCreateWallet() }
                borderRadius={3}
              />
              :
              <Text>done</Text>
              }
            </View>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },
  svgContainer: {
    position: 'absolute',
  }, 
  titleContainer: {
    marginTop: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginLeft: 8,
    fontFamily: 'sans-serif-thin',
    fontSize: 48,
    color: '#effbf3'
  },
  content: {
    flex: 1,
    flexGrow: 1,
    paddingLeft: 64,
    paddingRight: 64,
    justifyContent: 'center',
    marginBottom: '15%'
  },
  heading: {
    fontFamily: 'sans-serif-thin',
    color: '#effbf3',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    fontSize: 20
  },
  nextHeading: {
    color: '#effbf3',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    fontSize: 20,
    marginTop: 32
  },
  desc: {
    marginTop: 8,
    marginBottom: 8,
    fontFamily: 'sans-serif-thin',
    textAlign: 'center',
    color: '#effbf3',
    fontSize: 14,
    lineHeight: 24
  },
  descImportant: {
    marginBottom: 8,
    fontFamily: 'sans-serif-light',
    textAlign: 'center',
    color: '#effbf3',
    fontSize: 14,
    lineHeight: 24
  },
  codeWrapper: {
    height: 60,
    alignItems: 'center'
  }
});
