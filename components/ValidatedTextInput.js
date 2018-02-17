import React from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default class ValidatedTextInput extends React.Component {

  state = { isTooltipVisible: this.props.showTooltipByDefault }

  onIconPress = () => {
    if (this.props.alwaysShowTooltip) {
      return
    }
    this.setState({ isTooltipVisible: !this.state.isTooltipVisible })
  }

  getInputAddonStyle() {
    if (this.props.isError || this.props.isSuccess) {
      return styles.inputIconVisible
    }
    return {}
  }

  getTooltipStyle() {
    switch (this.props.tooltipPosition) {
      case 'top':
        return styles.topTooltip
    }
  }

  getTooltipArrowStyle() {
    switch (this.props.tooltipPosition) {
      case 'top':
        return styles.topTooltipArrow
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={[styles.inputStyle, this.props.inputStyle, this.getInputAddonStyle()]}
          value={this.props.value}
          placeholder={this.props.placeholder}
          autoCorrect={this.props.autoCorrect}
          autoCapitalize={this.props.autoCapitalize}
          onFocus={this.props.onFocus}
          maxLength={this.props.maxLength}
          onChangeText={this.props.onChangeText}
          onBlur={this.props.onBlur}
          underlineColorAndroid='rgba(0,0,0,0)'
        />
        <TouchableOpacity activeOpacity={1} onPress={this.onIconPress} style={styles.iconContainer}>
          { this.props.isError &&
            <Svg height={24} width={24}>
              <Path d="M0 0h24v24H0z" fill="none"/>
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill={this.props.errorBackgroundColor}/>
            </Svg>
          }
          { this.props.isSuccess &&
          <Svg height={24} width={24}>
            <Path d="M0 0h24v24H0z" fill="none"/>
            <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill={this.props.successBackgroundColor}/>
          </Svg>
          }
        </TouchableOpacity>
        { this.props.isError && this.state.isTooltipVisible &&
          <View style={styles.tooltipContainer}>
            <Text style={[{backgroundColor: this.props.errorBackgroundColor}, styles.tooltip, this.getTooltipStyle()]}>
              { this.props.errorMessage }
            </Text>
            <View style={[styles.tooltipArrow, this.getTooltipArrowStyle()]}></View>
          </View>
        }
      </View>
    );
  }
}

ValidatedTextInput.defaultProps = {
  errorBackgroundColor: '#f44336',
  successBackgroundColor: '#4caf50',
  tooltipPosition: 'top',
  showTooltipByDefault: false,
  isError: false,
  isSuccess: false
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  inputStyle: {
    fontFamily: 'sans-serif-light',
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexGrow: 1,
    elevation: 2
  },
  inputErrorStyle: {
    fontFamily: 'sans-serif-light',
    backgroundColor: '#fff',
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#f00',
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 10,
    flexGrow: 1,
  },
  iconContainer: {
    position: 'absolute',
    right: 16,
    flexShrink: 0,
    elevation: 2
  },
  tooltipContainer: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  tooltip: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    color: '#eee',
    borderRadius: 3,
    position: 'absolute',
    elevation: 2
  },
  tooltipArrow: {
    position: 'absolute',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#f44336',
    elevation: 2
  },
  topTooltip: {
    right: 8,
    top: -20
  },
  topTooltipArrow: {
    right: 20,
    top: 6,
  },
  inputIconVisible: {
    paddingRight: 56
  },
});
