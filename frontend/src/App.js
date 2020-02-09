import React, { useEffect } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import NotFoundPage from './component/notFoundPage'
import Month from "./component/month";
import Days from "./component/day";
import Login from "./component/auth";
import Header from './component/header';

import "./App.css";

function App() {
  return (
    <div className="App">
      <div id="mainContainer">
        <Header />
        <div id="mainSheet">
          <Switch>
            <Route exact path="/" render={props => <Month {...props} />}
            />
            <Route
              exact
              path="/detail/:last_name/:date/"
              render={props => <Days {...props} />}
            />

            <Route
              exact
              path="/login"
              render={props => <Login {...props} />}
            />

            <Route
              path="*"
              render={props => <NotFoundPage
                errorText="Страница не найдена"
                errorCaption="404"{...props} />}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
