import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate';
import ShipList from './ShipList';
import ShipDetails from './ShipDetails';
import { RootState } from '../reducers/rootReducer';
import { useSelector, useDispatch } from 'react-redux';
import { addShip, removeShip } from '../reducers/slices/ownedShipListSlice';
import { Ship } from './util/shipdata';

const ShipDetailView: React.FC = () => {
  const dispatch = useDispatch();
  const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const [isShips, setIsShips] = useState(ownedShips.length > 0);

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
    setIsShips(ownedShips.length > 0);
    // dispatch(dispatch(setDetails(getShipById(data.ships[0].id)));)
  }, [ownedShips]);

  return (
    <PageTemplate>
      <section id="ship-list-page-content">
        <ShipList />
        <div className="ship-data-container dark">
          {!isShips ? (
            <div>Select ship or add new ship to docks</div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>
    </PageTemplate>
  );
};

export default ShipDetailView;
