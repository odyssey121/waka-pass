import React, { useEffect } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import NotFoundPage from "./component/notFoundPage";
import Month from "./component/month";
import Days from "./component/day";
import Login from "./component/auth";
import Header from "./component/header";
import { connect } from "react-redux";
// import { Icon } from "antd";
import { restoreProfile } from "./component/auth/redux/actions";
import "./App.css";

function App({ restoreProfile, ...rest }) {
  useEffect(() => {
    restoreProfile();
  }, []);
  return (
    <div className="App">
      <div id="mainContainer">
        <Header />
        <div id="mainSheet">
          <Switch>
            <Route exact path="/" render={props => <Month {...props} />} />
            <Route
              exact
              path="/detail/:last_name/:date/"
              render={props => <Days {...props} />}
            />

            <Route exact path="/login" render={props => <Login {...props} />} />

            <Route
              path="*"
              render={props => (
                <NotFoundPage
                  errorText="Страница не найдена"
                  errorCaption="404"
                  {...props}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default connect(null, {
  restoreProfile
})(App);
