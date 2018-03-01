import { SET_ACCOUNT_ID, SET_SECRET, SET_BALANCE } from "./action-types";

export const setAccountId = accountId => ({ type: SET_ACCOUNT_ID , payload: accountId });

export const setSecret = secret => ({ type: SET_SECRET, payload: secret });

export const setBalance = balance => ({ type: SET_BALANCE, payload: balance });
