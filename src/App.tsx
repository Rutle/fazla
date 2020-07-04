import React from 'react';
import './App.css';
import ShipList from './components/ShipList';
import Home from './components/Home';

import { HashRouter, Route, Switch } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/shiplist" component={ShipList} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
