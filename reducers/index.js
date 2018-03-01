import { SET_ACCOUNT_ID, SET_SECRET, SET_BALANCE } from "../actions/action-types";

const initialState = {
  id: '',
  secret: '',
  balance: 0.0
};
 
const account = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_ID:
      return { ...state, id: action.payload }
    case SET_SECRET:
      return { ...state, secret: action.payload }
    case SET_BALANCE:
      return { ...state, balance: action.payload }
    default:
      return state;
  }
};
 
export default {
  account
}
