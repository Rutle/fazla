/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Route, Switch, Redirect, RouteProps, HashRouter 
} from 'react-router-dom';
import ShipDetailView from '_components/ShipDetailView';
import Home from '_components/Home';
import DataStore from './utils/dataStore';
import FormationView from './components/FormationView';
import { RootState } from './reducers/rootReducer';
import LandingView from './components/LandingView';
import ErrorView from './components/ErrorView';
import ToastContainer from './components/Toast/ToastContainer';
import {
 CallbackDismiss, ToastList, ToastMessageType, useToast 
} from './components/Toast/useToast';

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
    addToast: (type: ToastMessageType, label: string, msg: string, onDismiss?: CallbackDismiss | undefined) => void;
    onToastDismiss: (id: number) => void;
    popToast: () => void;
    shipData: DataStore;
    setShipData: React.Dispatch<React.SetStateAction<DataStore>>;
    toasts: ToastList;
  },
);

const App: React.FC = () => {
  const [shipData, setShipData] = useState(new DataStore());
  const [addToast, onToastDismiss, popToast, toasts] = useToast(true, 3000);
  return (
    <HashRouter>
      <div className={`App`}>
        <AppContext.Provider value={{
          addToast, onToastDismiss, popToast, toasts, shipData, setShipData 
        }}>
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
          <ToastContainer position="bottom-right" />
        </AppContext.Provider>
      </div>
    </HashRouter>
  );
};

export default App;
