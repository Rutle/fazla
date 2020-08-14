import React from 'react';
import './App.css';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';
import DataStore from './util/dataStore';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import FormationView from './components/FormationView';

const App: React.FC = () => {
  const shipData: DataStore = new DataStore([]);

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={() => <Home shipData={shipData} />} />
          <Route path="/shipdetails" component={() => <ShipDetailView shipData={shipData} />} />
          <Route path="/formation" component={() => <FormationView shipData={shipData} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
