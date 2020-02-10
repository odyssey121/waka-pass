import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { redirectMiddleware } from "../middleware";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducer";
import sagas from "./saga";

const createAppStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    composeWithDevTools ||
    compose;

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(sagaMiddleware, redirectMiddleware))
  );

  sagaMiddleware.run(sagas);

  return store;
};

export default createAppStore;
