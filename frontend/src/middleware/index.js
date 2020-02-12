import history from "./history";

export const redirectMiddleware = store => next => action => {
  if (action.type === "LOGOUT") {
    history.push("/login");
  }

  return next(action);
};
