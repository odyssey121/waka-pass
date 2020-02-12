import React, { useEffect } from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import NotFoundPage from "./component/notFoundPage";
import Month from "./component/month";
import Days from "./component/day";
import Login from "./component/auth";
import Header from "./component/header";
import { connect } from "react-redux";
import { Loader } from "./component/loader";
// import { Icon } from "antd";
import { restoreProfile } from "./component/auth/redux/actions";
import "./App.css";

function App({ restoreProfile, restoring, profile, ...rest }) {
  useEffect(() => {
    restoreProfile();
  }, []);
  return (
    <div className="App">
      <div id="mainContainer">
        <Header />
        <div id="mainSheet">
          <Switch>
            <Route
              exact
              path="/"
              render={props =>
                profile ? (
                  <Month {...props} />
                ) : restoring == "IDLE" ? (
                  <Loader />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />
            <Route
              exact
              path="/detail/:last_name/:date/"
              render={props => <Days {...props} />}
            />

            <Route
              exact
              path="/login"
              render={props =>
                (profile && <Redirect to="/" />) || <Login {...props} />
              }
            />

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

export default connect(
  state => ({
    profile: state.authentication.user,
    restoring: state.authentication.restore.status
  }),
  {
    restoreProfile
  }
)(App);
