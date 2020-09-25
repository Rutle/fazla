/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';
import DataStore from './util/dataStore';
import { Route, Switch, Redirect, RouteProps, HashRouter } from 'react-router-dom';
import FormationView from './components/FormationView';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import { initShipLists, setPhaseState } from './reducers/slices/appStateSlice';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shipData, setShipData] = useState(new DataStore());
  const appState = useSelector((state: RootState) => state.appState);
  const config = useSelector((state: RootState) => state.config);

  useEffect(() => {
    try {
      if (appState.cState === 'INIT') {
        (async () => {
          // Load data from .json using electron.
          // setTest([...test, 'Loading data from disk']);
          const initDataObj = await initData();
          dispatch(setPhaseState({ key: 'initData', value: true }));
          // Set current data array to shipData.
          await shipData.setArray(initDataObj.shipData);
          dispatch(setPhaseState({ key: 'initStructure', value: true }));
          dispatch(initShipLists(initDataObj.ownedShips, shipData, initDataObj.config, initDataObj.formations));
        })();
      }
    } catch (e) {
      console.log('[INIT] {1}: Error, useEffect []: ', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderList = () => {
    return (
      <ul
        style={{
          listStyle: 'none',
          alignSelf: 'flex-end',
          paddingInlineStart: '6px',
          marginBlockEnd: '6px',
        }}
      >
        {Object.keys(appState.initPhases).map((key, index) => (
          <li
            key={`${key}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <span style={{ marginRight: '15px' }}>{appState.initPhases[key].text}</span>{' '}
            <span>{appState.initPhases[key].isReady ? 'Done' : '----'}</span>
          </li>
        ))}
      </ul>
    );
  };
  return (
    <HashRouter>
      <div className={`App`}>
        <Switch>
          <Route
            exact
            path="/"
            render={({ history }) => {
              return (
                <>
                  <TitleBar showMenu={false} />
                  <div className={`page ${config.themeColor}`}>
                    <section className="page-content">
                      <div className="ship-data-container dark">
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          {appState.cState === 'RUNNING' ? (
                            <>
                              <div className="info-text">Program is ready. Please continue.</div>
                              <RButton
                                themeColor={config.themeColor}
                                onClick={() => {
                                  history.push('/shipdetails');
                                }}
                                extraStyle={{ marginTop: '30px', height: '50px', width: '20%' }}
                              >
                                Continue
                              </RButton>
                            </>
                          ) : (
                            <>{renderList()}</>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                  <FooterBar />
                </>
              );
            }}
          ></Route>
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
      </div>
    </HashRouter>
  );
};

export default App;
