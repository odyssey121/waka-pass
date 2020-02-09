import { createActions } from 'redux-actions';

const {
  login,
  getUser,
  getUserSuccess,
  getUserFailure,
} = createActions(
  'LOGIN',
  'GET_USER',
  'GET_USER_SUCCESS',
  'GET_USER_FAILURE'
);

export {
  login,
  getUser,
  getUserSuccess,
  getUserFailure,
};