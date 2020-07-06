import React from 'react';
import './App.css';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';

import { HashRouter, Route, Switch } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/shipdetails" component={ShipDetailView} />
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
