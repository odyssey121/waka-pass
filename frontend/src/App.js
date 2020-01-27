import React, { useState, useEffect } from "react";
import "./App.css";
import TimeTable from "./component/TimeTable";
import { Form, Input, Button, Icon, Typography } from "antd";
import { allMonth } from "./component/mock";
import { ConfirmBlue } from "./component/modal";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Month from "./component/month";
import Day from "./component/day";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" render={props => <Month {...props} />} />
        </Switch>
        <Switch>
          <Route
            exact
            path="/detail/:last_name"
            render={props => <Day {...props} />}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default Form.create()(App);
