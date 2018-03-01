import { SET_ACCOUNT_ID } from "../actions/action-types";

const initialState = {
  accountId: ''
};
 
const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_ID:
      return { ...state, accountId: action.payload }
    default:
      return state;
  }
};
 
export default {
  rootReducer
}
