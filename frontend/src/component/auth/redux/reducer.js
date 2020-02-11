import { handleActions } from "redux-actions";
import { combineReducers } from "redux";
import * as authAction from "./actions";

const user = handleActions(
  {
    [authAction.setUser]: (state, { payload }) => {
      return payload;
    },
    [authAction.resetUser]: () => null
  },
  null
);

const detail = handleActions(
  {
    [authAction.login]: (state, _payload) => ({
      ...state,
      loading: true,
      error: null
    }),
    [authAction.loginSuccess]: (state, { payload }) => ({
      status: "SUCCESS",
      loading: false
    }),
    [authAction.loginFailure]: (state, { payload }) => ({
      error: payload,
      status: "FAILURE",
      loading: false
    })
  },
  { error: null, status: "IDLE", loading: false }
);

const restore = handleActions(
  {
    [authAction.restoreProfile]: (state, _payload) => ({
      ...state
    }),
    [authAction.restoreProfileSuccess]: (state, { payload }) => ({
      status: "SUCCESS"
    }),
    [authAction.restoreProfileFailure]: (state, { payload }) => ({
      error: payload,
      status: "FAILURE"
    })
  },
  { error: null, status: "IDLE" }
);

export const authentication = combineReducers({
  user,
  detail,
  restore
});
