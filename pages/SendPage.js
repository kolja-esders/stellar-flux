import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableNativeFeedback, AsyncStorage, ActivityIndicator,  Platform, TextInput, TouchableHighlight, TouchableOpacity, DeviceEventEmitter, Linking, Keyboard } from 'react-native';
import { Button } from 'react-native-common';
import { connect } from "react-redux";
import CodeInput from 'react-native-confirmation-code-input';
import Svg, { Path, Circle, Defs, Stop, RadialGradient, Rect } from 'react-native-svg';
import StellarAccount from '../helper/StellarAccount';
import FormattingUtils from '../helper/FormattingUtils';
import Transaction from '../components/Transaction';
import Modal from '../components/Modal';
import ValidatedTextInput from '../components/ValidatedTextInput';

const mapStateToProps = state => ({
  accountId: state.account.id,
  balance: state.account.balance,
  secret: state.account.secret
})

class SendPage extends React.Component {

  static navigationOptions = {
    title: 'Send XLM',
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: '#2196F3'
    },
    headerTitleStyle: {
      color: '#fff',
    },
  }

  state = { isModalVisible: false, modalStatus: '', modalTitle: '', isModalLoading: false, txHash: '', confirmed: false, recipientAccountId: '', recipientValidationError: false, isSendButtonDisabled: false, recipientValidationSuccess: false, recipientDetails: '', amount: '', amountValidationError: false, amountValidationSuccess: false, amountValidationErrorMessage: '', recipientValidationErrorMessage: '' }

  async componentWillMount() {
    StellarAccount.initializeWithSecretKey(this.props.secret)

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
    let recipientAccountId = text.replace(/[^0-9A-Z]/g, '')
    this.setState({ ...this.state, recipientAccountId, recipientDetails: '', recipientValidationSuccess: false })
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

  onRecipientInputFocus = () => {
    this.setState({ ...this.state, recipientValidationError: false })
  }
  
  onRecipientBlur = async () => {
    const recipient = this.state.recipientAccountId
    if (recipient === '') {
      return
    }

    // Check if the format of the account id is valid
    let isValid = await StellarAccount.isValidAccountId(recipient)
    if (!isValid) {
      this.setState({ ...this.state, recipientValidationSuccess: false, recipientValidationError: true, recipientValidationErrorMessage: 'Invalid account id' })
      return;
    }

    // Check if the account id is known to be associated with an exchange.
    const EXCHANGES = new Map([
      ['GCGNWKCJ3KHRLPM3TM6N7D3W5YKDJFL6A2YCXFXNMRTZ4Q66MEMZ6FI2', 'Poloniex'],
      ['GBSTRH4QOTWNSVA6E4HFERETX4ZLSR3CIUBLK7AXYII277PFJC4BBYOG', 'Stronghold'],
      ['GC4KAS6W2YCGJGLP633A6F6AKTCV4WSLMTMIQRSEQE5QRRVKSX7THV6S', 'BitcoinIndonesia'],
      ['GB6YPGW5JFMMP2QB2USQ33EUWTXVL4ZT5ITUNCY3YKVWOJPP57CANOF3', 'Bittrex'],
      ['GA5XIGA5C7QTPTWXQHY6MCJRMTRZDOSHR6EFIBNDQTCQHG262N4GGKTM', 'Kraken'],
      ['GBV4ZDEPNQ2FKSPKGJP2YKDAIZWQ2XKRQD4V4ACH3TCTFY6KPY3OAVS7', 'Changelly']
    ])
    const recipientDetails = EXCHANGES.has(recipient) ? EXCHANGES.get(recipient) : ''

    this.setState({ ...this.state, recipientValidationError: false, recipientValidationSuccess: true, recipientDetails })
  }

  onAmountChanged = (amount) => {
    this.setState({ ...this.state, amount })
  }

  onMaxAmountPressed = () => {
    this.setState({ ...this.state, amount: '10,000', amountValidationSuccess: true, amountValidationError: false })
  }

  onAmountBlur = () => {
    // Validate
  }

  onAmountFocus = () => {
    this.setState({ ...this.state, amountValidationError: false })
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
            <View style={styles.inputHeadingContainer}>
              <Text style={styles.title}>RECIPIENT</Text>
              <Text style={styles.recipientDetails}>{ this.state.recipientDetails }</Text>
            </View>
            <View style={styles.recipientTextInputContainer}>
              <ValidatedTextInput
                placeholder='GAGNWKCJ3KHRLPM3T...'
                inputStyle={styles.recipientTextInput}
                autoCorrect={false}
                autoCapitalize='characters'
                onFocus={this.onRecipientInputFocus}
                maxLength={56}
                underlineColorAndroid='rgba(0,0,0,0)'
                value={this.state.recipientAccountId}
                onChangeText={this.onRecipientTextChanged}
                isError={this.state.recipientValidationError}
                isSuccess={this.state.recipientValidationSuccess}
                showTooltipByDefault={true}
                errorMessage={this.state.recipientValidationErrorMessage}
                onBlur={this.onRecipientBlur}
              />
            </View>
          </View>
          <View style={styles.memoContainer}>
            <View style={styles.inputHeadingContainer}>
              <Text style={styles.title}>DETAILS</Text>
            </View>
            <TextInput
              ref='memoInput'
              placeholder='Memo (optional)'
              style={styles.memoInput}
              autoCorrect={false}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
          </View>

          <View style={styles.inputHeadingContainer}>
            <Text style={styles.title}>AMOUNT</Text>
            <TouchableOpacity onPress={this.onMaxAmountPressed}>
              <Text style={styles.maxAmount}>(max. 10,000 XLM)</Text>
            </TouchableOpacity>
          </View>
        <ValidatedTextInput
            placeholder='100.00 XLM'
            keyboardType='numeric'
            onFocus={this.onAmountFocus}
            autoCorrect={false}
            value={this.state.amount}
            onChangeText={this.onAmountChanged}
            underlineColorAndroid='rgba(0,0,0,0)'
            isError={this.state.amountValidationError}
            isSuccess={this.state.amountValidationSuccess}
            showTooltipByDefault={true}
            errorMessage={this.state.amountValidationErrorMessage}
            onBlur={this.onAmountBlur}
          />
          <Button
            style={{marginTop: 32, elevation: 2}}
            label='Send XLM'
            size='large'
            borderRadius={3}
            disabled={this.state.isSendButtonDisabled}
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

export default connect(mapStateToProps)(SendPage);

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
    color: '#effbf3',
    fontFamily: 'sans-serif',
    fontWeight: '600',
    fontSize: 20,
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
    width: '100%'
  },
  memoInput: {
    fontFamily: 'sans-serif-light',
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    elevation: 2
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
  inputHeadingContainer: {
    flexDirection: 'row',
    paddingTop: 32,
    paddingBottom: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  recipientDetails: {
    fontFamily: 'sans-serif-light',
    color: '#effbf3',
    fontSize: 14,
    lineHeight: 20
  },
  maxAmount: {
    fontFamily: 'sans-serif-light',
    color: '#effbf3',
    fontSize: 14,
    lineHeight: 20
  }
});
