import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect, RouteProps, HashRouter, useHistory } from 'react-router-dom';
import ShipDetailView from '_components/ShipDetailView';
import Home from '_components/Home';
import localForage from 'localforage';
import DataStore from './utils/dataStore';
import FormationView from './components/FormationView';
import { RootState } from './reducers/rootReducer';
import LandingView from './components/LandingView';
import ErrorView from './components/ErrorView';
import ToastContainer from './components/Toast/ToastContainer';
import Tooltip from './components/Tooltip/Tooltip';
import { CallbackDismiss, ToastList, ToastMessageType, useToast } from './components/Toast/useToast';
import { useTooltip, TooltipHooks } from './components/Tooltip/useTooltip';
import { initShipData, setErrorMessage } from './reducers/slices/appStateSlice';

export const AppContext = React.createContext(
  {} as {
    addToast: (type: ToastMessageType, label: string, msg: string, onDismiss?: CallbackDismiss | undefined) => void;
    onToastDismiss: (id: number) => void;
    popToast: () => void;
    shipData: DataStore;
    // setShipData: React.Dispatch<React.SetStateAction<DataStore>>;
    toasts: ToastList;
    storage: LocalForage | undefined;
    tooltip: TooltipHooks;
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
  const history = useHistory();
  const platform = process.env.PLAT_ENV || 'NOSET';
  // const [shipData, setShipData] = useState(new DataStore());
  const shipData = useRef(new DataStore());
  const [addToast, onToastDismiss, popToast, toasts] = useToast(true, 3000);
  const tooltip = useTooltip();
  const storage =
    process.env.PLAT_ENV === 'web' ? localForage.createInstance({ name: 'Fazla-storage', version: 1.0 }) : undefined;

  useEffect(() => {
    if (platform === 'NOSET') {
      dispatch(setErrorMessage({ cState: 'ERROR', eMsg: 'Platform has not been defined', eState: 'ERROR' }));
      history.push('/error');
    } else {
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
            // setShipData,
            storage,
            tooltip,
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
          <Tooltip />
        </AppContext.Provider>
      </div>
    </HashRouter>
  );
};

export default App;
