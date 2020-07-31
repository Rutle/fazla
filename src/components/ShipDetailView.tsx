import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import ShipList from './ShipList';
import ShipDetails from './ShipDetails';
import { RootState } from '../reducers/rootReducer';
import { useSelector, useDispatch } from 'react-redux';
import { addShip, removeShip } from '../reducers/slices/ownedShipListSlice';
import { Ship } from '../util/shipdatatypes';

const ShipDetailView: React.FC = () => {
  const dispatch = useDispatch();
  const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const config = useSelector((state: RootState) => state.config);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const listState = useSelector((state: RootState) => state.listState);
  const [isShips, setIsShips] = useState(false);

  useEffect(() => {
    setIsShips(shipSearchList.length > 0);
    // console.log('Ship detail view: [', listState.cState, ']');
  }, []);
  const isOwned = (id: string) => {
    return ownedShips.some((ele) => ele.id === id);
  };

  const addShipToOwned = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, ship: Ship) => {
    dispatch(addShip({ name: ship.names.code, id: ship.id, class: ship.class }));
  };

  const removeFromOwned = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    dispatch(removeShip(id));
  };

  useEffect(() => {
    // Check if there any ships left.
    switch (listState.cToggle) {
      case 'all':
        setIsShips(shipSearchList.length > 0);
        break;
      case 'owned':
        setIsShips(ownedSearchList.length > 0);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownedSearchList, shipSearchList, listState.cToggle]);

  const renderShipDetails = () => {
    if (listState.cState === 'INIT') {
      return (
        <div style={{ textAlign: 'center' }}>
          <h1>{listState.cMsg}</h1>
        </div>
      );
    }
    if (!isShips) {
      return (
        <div>
          <h1>No ship selected or found</h1>
        </div>
      );
    } else {
      return (
        <>
          <div className="scroll">
            <ShipDetails />
          </div>
          <div className={'button-group'}>
            {!isOwned(shipDetails.id) ? (
              <button
                onClick={(e) => addShipToOwned(e, shipDetails)}
                className={`btn ${config.themeColor}`}
                type="button"
                disabled={isOwned(shipDetails.id)}
              >
                <b>Add to docks</b>
              </button>
            ) : (
              <button
                onClick={(e) => removeFromOwned(e, shipDetails.id)}
                className={`btn ${config.themeColor}`}
                type="button"
              >
                <b>Remove from docks</b>
              </button>
            )}
          </div>
        </>
      );
    }
  };
  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        <ShipList />
        <div className="ship-data-container dark">
          {renderShipDetails()}
          {/*
          !isShips ? (
            <div>
              <h1>No ship selected or found</h1>
            </div>
          ) : (
            <>
              <div className="scroll">
                <ShipDetails />
                <div className={'button-group'}>
                  {!isOwned(shipDetails.id) ? (
                    <button
                      onClick={(e) => addShipToOwned(e, shipDetails)}
                      className={`btn ${config.themeColor}`}
                      type="button"
                      disabled={isOwned(shipDetails.id)}
                    >
                      <b>Add to docks</b>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => removeFromOwned(e, shipDetails.id)}
                      className={`btn ${config.themeColor}`}
                      type="button"
                    >
                      <b>Remove from docks</b>
                    </button>
                  )}
                </div>
              </div>
            </>
          )
                  */}
        </div>
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
