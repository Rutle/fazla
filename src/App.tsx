/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';
import DataStore from './util/dataStore';
import { Route, Switch, Redirect, RouteProps, HashRouter } from 'react-router-dom';
import FormationView from './components/FormationView';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import { initShipLists, setErrorMessage, setPhaseState } from './reducers/slices/appStateSlice';
import { initData } from './util/appUtilities';
import LandingView from './components/LandingView';
import ErrorView from './components/ErrorView';

const RefreshRoute: React.FC<RouteProps> = (props) => {
  const appState = useSelector((state: RootState) => state.appState);
  console.log(appState.cState);
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
        pathname: '/shipdetails',
      }}
    />
  ) : (
    <Route {...props} component={props.component} />
  );
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shipData, setShipData] = useState(new DataStore());
  const appState = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    try {
      if (appState.cState === 'INIT') {
        (async () => {
          // Load data from .json using electron.
          const initDataObj = await initData();
          if (!initDataObj.isOk) {
            throw new Error('There was a problem with initializing the program.');
          }
          dispatch(setPhaseState({ key: 'initData', value: true }));
          // Set current data array to shipData.
          await shipData.setArray(initDataObj.shipData);
          dispatch(setPhaseState({ key: 'initStructure', value: true }));
          dispatch(initShipLists(initDataObj.ownedShips, shipData, initDataObj.config, initDataObj.formations));
        })().catch((error: Error) => dispatch(setErrorMessage({ cState: 'ERROR', eMsg: error.message })));
      }
    } catch (error) {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: error.message }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HashRouter>
      <div className={`App`}>
        <Switch>
          <Route exact path="/" render={({ history }) => <LandingView history={history} />}></Route>
          <Route path="/shipdetails">
            <ShipDetailView shipData={shipData} />
          </Route>
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
