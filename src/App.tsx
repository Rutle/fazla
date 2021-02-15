import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect, RouteProps, HashRouter } from 'react-router-dom';
import ShipDetailView from '_components/ShipDetailView';
import Home from '_components/Home';
import localForage from 'localforage';
import DataStore from './utils/dataStore';
import FormationView from './components/FormationView';
import { RootState } from './reducers/rootReducer';
import LandingView from './components/LandingView';
import ErrorView from './components/ErrorView';
import ToastContainer from './components/Toast/ToastContainer';
import { CallbackDismiss, ToastList, ToastMessageType, useToast } from './components/Toast/useToast';
import { AppConfigAction, configAction, setConfig } from './reducers/slices/programConfigSlice';
import { AppConfig } from './types/types';

export const AppContext = React.createContext(
  {} as {
    addToast: (type: ToastMessageType, label: string, msg: string, onDismiss?: CallbackDismiss | undefined) => void;
    onToastDismiss: (id: number) => void;
    popToast: () => void;
    shipData: DataStore;
    setShipData: React.Dispatch<React.SetStateAction<DataStore>>;
    toasts: ToastList;
    storage: LocalForage | undefined;
  }
);

const RefreshRoute: React.FC<RouteProps> = (props) => {
  const { component } = props;
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
    <Route {...props} component={component} />
  );
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [shipData, setShipData] = useState(new DataStore());
  const [addToast, onToastDismiss, popToast, toasts] = useToast(true, 3000);
  const storage =
    process.env.PLAT_ENV === 'web' ? localForage.createInstance({ name: 'Fazla-storage', version: 1.0 }) : undefined;

  useEffect(() => {
    if (process.env.PLAT_ENV === 'web' && storage) {
      try {
        (async () => {
          // Get config immediately.
          const configA = (await storage.getItem('config')) as AppConfig;
          if (configA !== null) {
            dispatch(setConfig(configA));
          } else {
            dispatch(configAction(AppConfigAction.Save, { storage }));
          }
        })().catch((e) => console.log(e));
      } catch (e) {
        console.log(e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HashRouter>
      <div className="App">
        <AppContext.Provider
          value={{
            addToast,
            onToastDismiss,
            popToast,
            toasts,
            shipData,
            setShipData,
            storage,
          }}
        >
          <Switch>
            <Route exact path="/" render={() => <LandingView />} />
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
