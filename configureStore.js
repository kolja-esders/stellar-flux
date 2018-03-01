import { compose, applyMiddleware, createStore } from "redux";
import { persistStore, persistCombineReducers } from "redux-persist";
import createSensitiveStorage from "redux-persist-sensitive-storage";
import reducers from "./reducers";

const storage = createSensitiveStorage({
  keychainService: "fluxKeychain",
  sharedPreferencesName: "fluxSharedPrefs"
});

const config = {
  key: "root",
  storage,
};

const reducer = persistCombineReducers(config, reducers);

let store = createStore(reducer);
let persistor = persistStore(store);

export default { store, persistor }
