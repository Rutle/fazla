/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, Redirect, RouteProps, HashRouter } from 'react-router-dom';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';
import DataStore from './util/dataStore';
import FormationView from './components/FormationView';
import { RootState } from './reducers/rootReducer';
import LandingView from './components/LandingView';
import ErrorView from './components/ErrorView';
import ToastContainer from './components/Toast/ToastContainer';
import { CallbackDismiss, DismissFunctionList, useToast } from './components/Toast/useToast';

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

export const AppContext = React.createContext(
  {} as {
    addToast: (
      type: 'warning' | 'error' | 'info',
      label: string,
      msg: string,
      onDismiss?: CallbackDismiss | undefined,
    ) => void;
    onToastDismiss: (id: number) => void;
    popToast: () => void;
    shipData: DataStore;
    setShipData: React.Dispatch<React.SetStateAction<DataStore>>;
    toasts: DismissFunctionList;
  },
);

const App: React.FC = () => {
  // const shipData = new DataStore();
  const [shipData, setShipData] = useState(new DataStore());
  const [addToast, onToastDismiss, popToast, toasts] = useToast();
  return (
    <HashRouter>
      <div className={`App`}>
        <AppContext.Provider value={{ addToast, onToastDismiss, popToast, toasts, shipData, setShipData }}>
          <Switch>
            <Route exact path="/" render={() => <LandingView />}></Route>
            <RefreshRoute path="/shipdetails">
              <ShipDetailView />
            </RefreshRoute>
            <RefreshRoute path="/formations">
              <FormationView />
            </RefreshRoute>
            <RefreshRoute path="/options">
              <Home />
            </RefreshRoute>
            <Route path="/error">
              <ErrorView />
            </Route>
          </Switch>
          <ToastContainer position="bottom-right"></ToastContainer>
        </AppContext.Provider>
      </div>
    </HashRouter>
  );
};

export default App;
