import React from "react";
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

export default App;
