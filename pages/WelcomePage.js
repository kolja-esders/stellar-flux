import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Svg, { RadialGradient, Rect, Defs, Stop } from 'react-native-svg';
import { connect } from "react-redux";

const mapStateToProps = state => ({
  accountId: state.account.id,
})

class WelcomePage extends React.Component {

  componentWillMount() {
    console.log('fuck ey', this.props.accountId)
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
<RadialGradient id="grad" cx="300%" cy="150%" rx={2*height} ry={2*height} fx="50%" fy="50%" gradientUnits="userSpaceOnUse">
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
        <Text style={styles.title}>
          Welcome
        </Text>
      </View>
    );
  }
}

export default connect(mapStateToProps)(WelcomePage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000'
  },
  svgContainer: {
    position: 'absolute',
  }, 
  title: {
    fontFamily: 'sans-serif-light',
    fontSize: 48,
    marginTop: 60,
    color: '#effbf3',
  }
});
