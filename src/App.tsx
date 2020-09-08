/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './App.css';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';
import DataStore from './util/dataStore';
import { BrowserRouter, Route, Switch, Redirect, RouteProps } from 'react-router-dom';
import FormationView from './components/FormationView';
import { useSelector } from 'react-redux';
import { RootState } from './reducers/rootReducer';

const RefreshRoute: React.FC<RouteProps> = (props) => {
  const appState = useSelector((state: RootState) => state.appState);
  return appState.cState === 'INIT' ? (
    <Redirect
      to={{
        pathname: '/shipdetails',
      }}
    />
  ) : (
    <Route {...props} component={props.component} />
  );
};

const App: React.FC = () => {
  const [shipData, setShipData] = useState(new DataStore([]));

  return (
    <BrowserRouter>
      <div className={`App`}>
        <Switch>
          <Route exact path="/">
            <Redirect to="/shipdetails" />
          </Route>
          <Route path="/shipdetails">
            <ShipDetailView shipData={shipData} setShipData={setShipData} />
          </Route>
          <RefreshRoute path="/formations">
            <FormationView shipData={shipData} />
          </RefreshRoute>
          <RefreshRoute path="/options">
            <Home shipData={shipData} />
          </RefreshRoute>
        </Switch>
      </div>
    </BrowserRouter>
  );
};

export default App;
