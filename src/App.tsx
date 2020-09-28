/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, Redirect, RouteProps, HashRouter } from 'react-router-dom';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';
import DataStore from './util/dataStore';
import FormationView from './components/FormationView';
import { RootState } from './reducers/rootReducer';
import LandingView from './components/LandingView';
import ErrorView from './components/ErrorView';

const RefreshRoute: React.FC<RouteProps> = (props) => {
  const appState = useSelector((state: RootState) => state.appState);
  if (appState.cState === 'ERROR') {
    return (
      <Redirect
        to={{
          pathname: '/error',
        }}
      />
    );
  }
  return appState.cState === 'INIT' ? (
    <Redirect
      to={{
        pathname: '/',
      }}
    />
  ) : (
    <Route {...props} component={props.component} />
  );
};

const App: React.FC = () => {
  const shipData = new DataStore();
  return (
    <HashRouter>
      <div className={`App`}>
        <Switch>
          <Route exact path="/" render={() => <LandingView shipData={shipData} />}></Route>
          <RefreshRoute path="/shipdetails">
            <ShipDetailView shipData={shipData} />
          </RefreshRoute>
          <RefreshRoute path="/formations">
            <FormationView shipData={shipData} />
          </RefreshRoute>
          <RefreshRoute path="/options">
            <Home shipData={shipData} />
          </RefreshRoute>
          <Route path="/error">
            <ErrorView />
          </Route>
        </Switch>
      </div>
    </HashRouter>
  );
};

export default App;
