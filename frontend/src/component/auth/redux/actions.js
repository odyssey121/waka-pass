import { createActions } from "redux-actions";

const {
  login,
  setUser,
  resetUser,
  loginSuccess,
  loginFailure,
  restoreProfile,
  restoreProfileSuccess,
  restoreProfileFailure,
  logout
} = createActions(
  "LOGIN",
  "SET_USER",
  "RESET_USER",
  "LOGIN_SUCCESS",
  "LOGIN_FAILURE",
  "RESTORE_PROFILE",
  "RESTORE_PROFILE_SUCCESS",
  "RESTORE_PROFILE_FAILURE",
  "LOGOUT"
);

export {
  login,
  setUser,
  resetUser,
  loginSuccess,
  loginFailure,
  restoreProfile,
  restoreProfileSuccess,
  restoreProfileFailure,
  logout
};
