import React from 'react';
import { StyleSheet, Text, View, Modal as ReactNativeModal } from 'react-native';

export default class Modal extends React.Component {
  
  render() {
    return (
      <ReactNativeModal
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
        animationType={'fade'}
      >
        <View style={styles.container}>
          <View style={styles.inner}>
            { this.props.children }
          </View>
        </View>
      </ReactNativeModal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.618)'
  },
  inner: {
    padding: 16,
    marginLeft: '10%',
    marginRight: '10%',
    //alignItems: 'center',
    backgroundColor: '#fff',
    //backgroundColor: '#006600',
    borderRadius: 3
  },
});
