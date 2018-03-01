import React from 'react';
import { connect } from "react-redux";
import { StackNavigator } from 'react-navigation';

import SetupContainerPage from '../pages/SetupContainerPage';
import BalancePage from '../pages/BalancePage';
import SendPage from '../pages/SendPage';
import ReceivePage from '../pages/ReceivePage';

const DefaultStack = StackNavigator({
    BalancePage: {
      screen: BalancePage
    },
    SendPage: {
      screen: SendPage
    },
    ReceivePage: {
      screen: ReceivePage
    },
  }, {
    initialRouteName: 'BalancePage',
    headerMode: 'screen'
  }
);

const SetupStack = StackNavigator({
    SetupPage: {
      screen: SetupContainerPage
    },
    BalancePage: {
      screen: BalancePage
    },
    SendPage: {
      screen: SendPage
    },
    ReceivePage: {
      screen: ReceivePage
    },
  }, {
    initialRouteName: 'SetupPage',
    headerMode: 'screen'
  }
);

const mapStateToProps = state => ({
  accountId: state.account.id
})

class SetupFork extends React.Component {
  render() {
    if (this.props.accountId) {
      return <DefaultStack />
    } else {
      return <SetupStack />
    }
  }
}

export default connect(mapStateToProps)(SetupFork);
