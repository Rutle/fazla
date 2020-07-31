import React, { useEffect } from 'react';
import './App.css';
import ShipDetailView from './components/ShipDetailView';
import Home from './components/Home';

import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import FormationView from './components/FormationView';
import { initShipLists, initListState } from './reducers/slices/appStateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './reducers/rootReducer';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const fullShipList = useSelector((state: RootState) => state.fullList);
  const appState = useSelector((state: RootState) => state.appState);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  // Initialize app state values.

  useEffect(() => {
    try {
      if (fullShipList.length === 0) {
        console.log('[INIT] {1}: Initialize full ship list');
        dispatch(initShipLists());
      }
    } catch (e) {
      console.log('[INIT] {1}: Error, useEffect []: ', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (appState.cState === 'INIT') {
      if (shipSearchList.length !== 0) {
        console.log('[INIT] {2}: Set initial lists states after Init {1}.');
        dispatch(
          initListState('all', 0, shipSearchList[0].id, 'owned', 0, ownedSearchList[0].id, appState.useTempData),
        );
      } else {
        console.log(
          '[INIT] {1}: and shipSearchList length: [',
          shipSearchList.length,
          ']: Ship data has not been set in search list yet.',
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipSearchList]);
  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={Home} />
          <Route path="/shipdetails" component={ShipDetailView} />
          <Route path="/formation" component={FormationView} />
        </Switch>
      </div>
    </HashRouter>
  );
};

export default App;
