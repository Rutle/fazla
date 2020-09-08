import React, { useEffect, Profiler, useState } from 'react';
import './App.css';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';
import DataStore from './util/dataStore';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import FormationView from './components/FormationView';
import { getDatastore } from './util/appUtilities';

const App: React.FC = () => {
  const [shipData, setShipData] = useState(new DataStore([]));
  // const shipData: DataStore = new DataStore([]);

  return (
    <BrowserRouter>
      <div className={`App`}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/shipdetails" />
          </Route>
          <Route path="/options" component={() => <Home shipData={shipData} />} />
          <Route
            path="/shipdetails"
            component={() => <ShipDetailView shipData={shipData} setShipData={setShipData} />}
          />
          <Route path="/formations" component={() => <FormationView shipData={shipData} />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
