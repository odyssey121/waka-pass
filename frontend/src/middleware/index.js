import history from "./history";

export const redirectMiddleware = store => next => action => {
  const url = window.location.pathname;
  const loginStatus = store.getState().authentication.status;
  console.log(url);

  if (action.type === "LOGIN_SUCCESS") {
    history.push("/");
  }
  if (action.type === "LOGOUT") {
    history.push("/login");
  }
  if (action.type === "RESTORE_PROFILE_FAILURE" && url != "/login") {
    history.push("/login");
  }
  return next(action);
};
