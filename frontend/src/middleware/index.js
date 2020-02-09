import history from './history';


// export const redirectMiddleware = store => next => action => {
//   const url = window.location.pathname;
//   const loginStatus = store.getState().Authorization.status.loginStatus;
//   const isLogged = store.getState().Authorization.user.isLogged;
//   const isAuthorized = store.getState().Authorization.user.isAuthorized;
//   if (action.type === 'SET_ACTIVE_PROFILE') {
//     const { payload } = action;
//     if (payload.redirect) {
//       history.push('/' + URLs.CONTROL_PANEL);
//     }
//   } else if (action.type === 'UNSET_ACTIVE_PROFILE') {
//     history.push('/' + URLs.AUTHORIZATION + '/' + URLs.PROFILES_LIST);
//   }
//   if (url === '/check_code') {
//     history.push('/authorization/login');
//   }
//   if (loginStatus.message === 'FAILURE') {
//     history.push('/authorization/login');
//   } else if (
//     (url === '/authorization/login' || url === '/') &&
//     loginStatus.message === 'SUCCESS'
//   ) {
//     history.push('/authorization/profiles');
//   }
//   if (isAuthorized && !isLogged) {
//     history.push('/authorization/add/profile');
//   }
//   return next(action);
// };