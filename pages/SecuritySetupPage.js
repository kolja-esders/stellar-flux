import React from 'react';
import { StyleSheet, Text, View, Dimensions, AsyncStorage } from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import Svg, { RadialGradient, Rect, Defs, Stop, Path, Use, ClipPath } from 'react-native-svg';

export default class SecuritySetupPage extends React.Component {

  async handlePin(pin) {
    try {
      await AsyncStorage.setItem('@StellarFluxStore:pinHash', pin);
    } catch (error) {
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


        <Text style={styles.desc}>
          Enter a 4-digit PIN to access your wallet in the future.
        </Text>
        <CodeInput
          secureTextEntry
          activeColor='rgba(255, 255, 255, 1)'
          inactiveColor='rgba(255, 255, 255, 0.3)'
          codeLength={4}
          keyboardType="numeric"
          autoFocus={false}
          inputPosition='left'
          onFulfill={(pin) => this.handlePin(pin) }
          containerStyle={{ marginTop: 20 }}
          codeInputStyle={{ color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.05)', fontSize: 24, fontWeight: '800', borderWidth: 0.5, borderColor: '#fff', borderRadius: 3, height: 60, width: 45, marginLeft: 5, marginRight: 5 }}
        />
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
    marginLeft: 8,
    fontFamily: 'sans-serif-thin',
    fontSize: 48,
    color: '#effbf3',
  },
  desc: {
    alignItems: 'center',
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: 'sans-serif-thin',
    fontSize: 24,
    fontWeight: '300',
    color: '#effbf3',
    marginTop: 100,
  },
});
