import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, AsyncStorage, ActivityIndicator,  Platform, TextInput, TouchableHighlight, DeviceEventEmitter, Linking, Keyboard } from 'react-native';
import { Button } from 'react-native-common';
import CodeInput from 'react-native-confirmation-code-input';
import Svg, { Path, Circle, Defs, Stop, RadialGradient, Rect } from 'react-native-svg';
import StellarAccount from '../helper/StellarAccount';
import FormattingUtils from '../helper/FormattingUtils';
import Transaction from '../components/Transaction';
import Modal from '../components/Modal';

export default class SendPage extends React.Component {

  static navigationOptions = {
    title: 'Send XLM',
    headerTintColor: '#444',
    headerStyle: {
      backgroundColor: '#eee',
    },
    headerTitleStyle: {
      color: '#444',
    },
  }

  state = { isModalVisible: false, modalStatus: '', modalTitle: '', isModalLoading: false, txHash: '', confirmed: false, recipientAccountId: '' }

  async componentWillMount() {
    let secret = await AsyncStorage.getItem('@Flux:secret')
    StellarAccount.initializeWithSecretKey(secret)

    DeviceEventEmitter.addListener('EV_SOURCE_ACCOUNT_UPDATED', (e) => {
      this.setState({ ...this.state, modalStatus: 'Building transaction…' })
    }); 
    DeviceEventEmitter.addListener('EV_DESTINATION_ACCOUNT_CHECKED', (e) => {
      this.setState({ ...this.state, modalStatus: 'Updating account…' })
    }); 
    DeviceEventEmitter.addListener('EV_CREATED_TRANSACTION', (e) => {
      this.setState({ ...this.state, modalStatus: 'Submitting transaction…' })
    }); 
  }

  onRecipientTextChanged = (text) => {
    console.log(text)
    let recipientAccountId = text.replace(/[^0-9A-Z]/g, '')
    this.setState({ ...this.state, recipientAccountId })
  }

  onCloseModalRequest() {
    if (!this.state.isModalLoading) {
      this.setState({ ...this.state, isModalVisible: false, confirmed: false, txHash: '', modalStatus: '', isModalLoading: false, modalStatus: '' })
    }
  }

  confirmTransaction() {
    // Validate all inputs
    this.setState({ modalTitle: 'Confirm transaction', isModalVisible: true })
  }

  async onPinEntered(pin) {
    this.setState({ modalStatus: 'Checking destination account…', modalTitle: 'Sending funds…', isModalLoading: true, isModalVisible: true, confirmed: true })
    let txHash = await StellarAccount.sendLumensWithEvents('GA6NL6C2IDWOPTB6USS4O3VRIODUDXIZPCIFZXA2YG7MNS6M3ORE3JBE', 100, '')
    if (txHash) {
      this.setState({ ...this.state, modalStatus: '', modalTitle: 'Successfully sent funds', isModalLoading: false, txHash })
    }
  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <View style={styles.outer}>
        <Svg style={styles.svgContainer} height={height} width={width}>
          <Defs>
            <RadialGradient id="grad" cx="100%" cy="150%" rx={2*height} ry={2*height} fx="50%" fy="50%" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#002348" stopOpacity="1" />
              <Stop offset="100%" stopColor="#08B5E5" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="url(#grad)" />
        </Svg>

        <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
          <View style={styles.recipientContainer}>
            <Text style={styles.title}>RECIPIENT</Text>
            <View style={styles.recipientTextInputContainer}>
              <TextInput
                ref={(element) => this.test = element }
                placeholder='GAGNWKCJ3KHRLPM3T...'
                style={styles.recipientTextInput}
                autoCorrect={false}
                autoCapitalize='characters'
                maxLength={56}
                underlineColorAndroid='rgba(0,0,0,0)'
                value={this.state.recipientAccountId}
                onChangeText={this.onRecipientTextChanged}
              />
            </View>
          </View>
          <View style={styles.memoContainer}>
            <Text style={styles.title}>DETAILS</Text>
            <TextInput
              ref='memoInput'
              placeholder='Memo (optional)'
              style={styles.memoInput}
              autoCorrect={false}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
          </View>

          <Text style={styles.title}>AMOUNT</Text>
          <TextInput
            ref='amountInput'
            placeholder='100.00 XLM'
            keyboardType='numeric'
            style={styles.amountInput}
            autoCorrect={false}
            underlineColorAndroid='rgba(0,0,0,0)'
          />

          <Button
            label='Send XLM'
            size='large'
            borderRadius={3}
            onPress={() => this.confirmTransaction() }
          />
          <View style={styles.confirmationInfoContainer}>
            <Svg height={24} width={24}>
              <Path d="M0 0h24v24H0z" fill="none"/>
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill='#effbf3'/>
            </Svg>
            <Text style={styles.confirmationInfo}>You will be required to enter your PIN code.</Text>
          </View>
        </ScrollView>

        <Modal
          style={styles.modal}
          visible={this.state.isModalVisible}
          onRequestClose={() => this.onCloseModalRequest()}
        >
          <Text style={styles.modalHeading}>{ this.state.modalTitle }</Text>
          { !this.state.confirmed ?
          <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
            <View style={styles.codeWrapper}>
              <CodeInput
                secureTextEntry
                activeColor='#444'
                inactiveColor='rgba(0,0,0,0.3)'
                codeLength={4}
                keyboardType="numeric"
                autoFocus={true}
                inputPosition='left'
                onFulfill={(pin) => this.onPinEntered(pin) }
                containerStyle={{ marginTop: 0 }}
                codeInputStyle={{ color: '#444', backgroundColor: 'rgba(0,0,0,0.05)', fontSize: 24, fontWeight: '800', borderWidth: 0.5, borderColor: '#444', borderRadius: 3, height: 60, width: 45, marginLeft: 5, marginRight: 5 }}
              />
            </View>
            <Text style={styles.modalConfirmationText}>
              Enter confirmation PIN to send funds.
            </Text>
            <Button
              backgroundColor='#ddd'
              color='#444'
              style={styles.modalButton}
              borderRadius={3}
              onPress={() => this.onCloseModalRequest()}
              label="Cancel"
            />
          </ScrollView>
          :
            <View>
              { this.state.isModalLoading ?
                <View>
                  <ActivityIndicator style={styles.modalLoadingIndicator} size={60} color='#08b5e5' />
                  <Text style={styles.modalStatus}>
                    { this.state.modalStatus }
                  </Text>
                </View>
                :
                <View style={{alignItems: 'center'}}>
                  <Svg height={96} width={96} style={styles.modalSuccessIcon}>
                    <Path d="M0 0h24v24H0z" fill="none"/>
                    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill='#4CAF50' scale='4'/>
                  </Svg>
                  <Text
                    style={styles.modalTransactionLink}
                    onPress={() => Linking.openURL('http://testnet.stellarchain.io/tx/' + this.state.txHash)}
                  >
                    View transaction on stellarchain.io.
                  </Text>
                  <Button
                    backgroundColor='#ddd'
                    color='#444'
                    style={styles.modalButton}
                    borderRadius={3}
                    onPress={() => this.onCloseModalRequest()}
                    label="Dismiss"
                  />
              </View>
              }
            </View>
          }
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outer: {
    flex: 1
  },
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },
  svgContainer: {
    position: 'absolute',
  }, 
  dividerText: {
    fontFamily: 'sans-serif-light',
    color: 'rgba(255, 255, 255, 0.7)',
    paddingBottom: 8,
    paddingTop: 8
  },
  recipientTextInput: {
    fontFamily: 'sans-serif-light',
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexGrow: 1,
  },
  recipientTextInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    fontFamily: 'sans-serif-thin',
    textAlign: 'center',
    color: '#effbf3',
    fontSize: 14,
    lineHeight: 24
  },
  title: {
    paddingTop: 32,
    paddingBottom: 8,
    width: '100%',
    color: '#effbf3',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    fontSize: 20
  },
  titleDivider: {
    width: '100%',
    borderBottomColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  scanContainer: {
    alignItems: 'center'
  },
  memoContainer: {
    //marginTop: 16,
    //marginBottom: 16,
    width: '100%'
  },
  memoInput: {
    fontFamily: 'sans-serif-light',
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    //paddingBottom: 12,
    //marginTop: 16,
  },
  confirmationInfo: {
    fontFamily: 'sans-serif-thin',
    color: '#effbf3',
    marginLeft: 4
  },
  confirmationInfoContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  recipientInputButtonContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 500,
    padding: 24,
    flex: 1,
  },
  actionsContainer: {
    width: '100%',
    paddingLeft: 48,
    paddingRight: 48,
    paddingTop: 32,
    paddingBottom: 16,
  },
  actionsInner: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionCaption: {
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
    textAlign: 'center'
  },
  actionInnerContainer: {
    backgroundColor: '#08b5e5',
    borderRadius: 500,
    padding: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  ripple: {
    //flexGrow: 1,
    //padding: 24,
  },
  buttonWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  dividerWrap: {
    flexGrow: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  verticalDividerLine: {
    height: 40,
    borderRightColor: 'rgba(255, 255, 255, 0.7)',
    borderRightWidth: StyleSheet.hairlineWidth
  },
  recipientInputButtonDesc: {
    color: '#fff',
    marginTop: 16,
    paddingLeft: 32,
    paddingRight: 32,
    textAlign: 'center'
  },
  amountInput: {
    marginBottom: 32,
    fontFamily: 'sans-serif-light',
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
  },
  modalHeading: {
    color: '#333',
    fontSize: 20,
    marginBottom: 16
  },
  modalButton: {
    marginTop: 16,
    width: '100%'
  },
  modalLoadingIndicator: {
    margin: 16
  },
  modalStatus: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 16
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSuccessIcon: {
    margin: 16
  },
  modalTransactionLink: {
    textAlign: 'center',
    color: '#2196F3',
    marginBottom: 16
  },
  codeWrapper: {
    marginTop: 16,
    height: 60,
    alignItems: 'center',
  },
  modalConfirmationText: {
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#888',
  },
});
