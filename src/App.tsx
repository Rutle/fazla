import React from 'react';
import './App.css';
import List from './components/List';
import Home from './components/Home';

import { HashRouter, Route, Switch } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/list" component={List} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
