import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import SetupFork from './components/SetupFork'
import { persistor, store } from './configureStore';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SetupFork />
        </PersistGate>
      </Provider>
    )
  }
}
