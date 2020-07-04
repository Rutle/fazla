import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import List from './components/List';
import Home from './components/Home';

import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={Home} />
          <Route path="/list" component={List} />
        </Switch>
      </div>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
