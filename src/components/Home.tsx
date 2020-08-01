import React from 'react';
import PageTemplate from './PageTemplate';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { updateShipData } from '../reducers/slices/appStateSlice';

const Home = (): JSX.Element => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const fullShipList = useSelector((state: RootState) => state.fullList);

  const updateData = () => {
    dispatch(updateShipData());
  };

  const renderUpdate = () => {
    if (appState.cState === 'UPDATING') {
      return <span>{appState.cMsg}</span>;
    }
    return (
      <button className="btn dark" onClick={() => updateData()}>
        Update
      </button>
    );
  };
  return (
    <PageTemplate>
      <section className="page-content">
        <div className="home-container dark">
          <div className="f-grid">
            <div className="f-row">
              <div className="f-title">Options</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update Data:</div>
              <div className="grid-item action">{renderUpdate()}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update Data:</div>
              <div className="grid-item action">
                <button className="btn dark">Update</button>
              </div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update Data:</div>
              <div className="grid-item action">
                <button className="btn dark">Update</button>
              </div>
            </div>
            <div className="f-row">
              <div className="f-title">Stats</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Ship count</div>
              <div className="grid-item action">{fullShipList.length}</div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update Data:</div>
              <div className="grid-item action">
                <button className="btn dark">Update</button>
              </div>
            </div>
            <div className="f-row wrap">
              <div className="grid-item name">Update Data:</div>
              <div className="grid-item action">
                <button className="btn dark">Update</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
};

export default Home;
