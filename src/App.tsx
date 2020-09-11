/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import './App.css';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';
import DataStore from './util/dataStore';
import { BrowserRouter, Route, Switch, Redirect, RouteProps } from 'react-router-dom';
import FormationView from './components/FormationView';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import { initShipLists } from './reducers/slices/appStateSlice';
import { initData } from './util/appUtilities';
import FooterBar from './components/FooterBar';
import TitleBar from './components/TitleBar';
import RButton from './components/RButton/RButton';

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
  const dispatch = useDispatch();
  const [shipData, setShipData] = useState(new DataStore());
  const [isDataReady, setIsDataReady] = useState(false);
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);

  useEffect(() => {
    try {
      if (appState.cState === 'INIT') {
        (async () => {
          const initDataObj = await initData();
          await shipData.setArray(initDataObj.shipData);
          dispatch(initShipLists(initDataObj.ownedShips, shipData, initDataObj.config, initDataObj.formations));
        })();
      }
    } catch (e) {
      console.log('[INIT] {1}: Error, useEffect []: ', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log('cState:', appState.cState, shipData);
  }, [appState.cState]);

  useEffect(() => {
    console.log('shidata:', appState.cState, shipData);
  }, [shipData.state]);

  return (
    <BrowserRouter>
      <div className={`App`}>
        {!isDataReady ? (
          <>
            <TitleBar />
            <div className={`page ${config.themeColor}`}>
              <section className="page-content">
                <div className="ship-data-container dark">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      margin: 'auto',
                      padding: '6px',
                    }}
                  >
                    <div className="info-text">Data initialization complete</div>
                    <RButton
                      themeColor={config.themeColor}
                      onClick={() => setIsDataReady(!isDataReady)}
                      extraStyle={{ marginTop: '30px', height: '50px', width: '60%' }}
                    >
                      Continue
                    </RButton>
                  </div>
                </div>
              </section>
            </div>
            <FooterBar />
          </>
        ) : (
          <Switch>
            <Route exact path="/">
              <Redirect to="/shipdetails" />
            </Route>
            <Route path="/shipdetails">
              <ShipDetailView shipData={shipData} />
            </Route>
            <RefreshRoute path="/formations">
              <FormationView shipData={shipData} />
            </RefreshRoute>
            <RefreshRoute path="/options">
              <Home shipData={shipData} />
            </RefreshRoute>
          </Switch>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
