import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect, RouteProps, HashRouter } from 'react-router-dom';
import ShipDetailView from '_components/ShipDetailView';
import Home from '_components/Home';
import localForage from 'localforage';
import DataStore from './utils/dataStore';
import FormationView from './components/FormationView';
import { RootState } from './reducers/rootReducer';
import ErrorView from './components/ErrorView';
import ToastContainer from './components/Toast/ToastContainer';
import Tooltip from './components/Tooltip/Tooltip';
import { CallbackDismiss, ToastList, ToastMessageType, useToast } from './hooks/useToast';
import { useTooltip, TooltipHooks } from './hooks/useTooltip';
import { initShipData, setErrorMessage } from './reducers/slices/appStateSlice';
import LandingView from './components/LandingView';

export const AppContext = React.createContext(
  {} as {
    addToast: (type: ToastMessageType, label: string, msg: string, onDismiss?: CallbackDismiss | undefined) => void;
    onToastDismiss: (id: number) => void;
    popToast: () => void;
    shipData: DataStore;
    toasts: ToastList;
    storage: LocalForage | undefined;
    tooltip: TooltipHooks;
  }
);

const RefreshRoute: React.FC<RouteProps> = ({ component, ...props }) => {
  const appState = useSelector((state: RootState) => state.appState);
  // Grab the location on refresh of page or linking and save it to sessionStorage.
  if (props.location && props.location.pathname) {
    sessionStorage.setItem('rr', props.location.pathname);
  }
  // In error state redirect to error page.
  if (appState.cState === 'ERROR') {
    return (
      <Redirect
        to={{
          pathname: '/error',
        }}
      />
    );
  }
  // If state is still INIT and data hasn't been loaded, Redirect to '/' where data is loaded first.
  if (appState.cState === 'INIT' && !appState.isData) {
    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    );
  }
  return <Route {...props} component={component} />;
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const platform = process.env.PLAT_ENV || 'NOSET';
  // Finally found out how to properly pass down "static" data that doesn't cause re-render
  // but still gets updated unlike just a const variable.
  const shipData = useRef(new DataStore());
  const [addToast, onToastDismiss, popToast, toasts] = useToast(true, 3000);
  const tooltip = useTooltip();
  const storage =
    process.env.PLAT_ENV === 'web' ? localForage.createInstance({ name: 'Fazla-storage', version: 1.0 }) : undefined;
  const appState = useSelector((state: RootState) => state.appState);

  useEffect(() => {
    if (platform === 'NOSET') {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'Platform has not been defined' }));
    }
    if (appState.cState === 'INIT' && !appState.isData) {
      dispatch(initShipData(shipData.current, platform, storage));
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
            shipData: shipData.current,
            storage,
            tooltip,
          }}
        >
          <Switch>
            <Route exact path="/">
              {appState.isData && sessionStorage.getItem('rr') ? (
                <Redirect to={sessionStorage.getItem('rr') as string} />
              ) : (
                <LandingView />
              )}
            </Route>
            <RefreshRoute path="/ships">
              <ShipDetailView />
            </RefreshRoute>
            <RefreshRoute path="/formations">
              <FormationView viewOnly={false} />
            </RefreshRoute>
            <RefreshRoute path="/options">
              <Home />
            </RefreshRoute>
            <RefreshRoute path="/link/:code">
              <FormationView viewOnly />
            </RefreshRoute>
            <Route path="/error">
              <ErrorView />
            </Route>
            <Route>
              <ErrorView isNotFound />
            </Route>
          </Switch>
          <ToastContainer position="bottom-right" />
          <Tooltip />
        </AppContext.Provider>
      </div>
    </HashRouter>
  );
};

export default App;
