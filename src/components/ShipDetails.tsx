import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { Skill, Ship } from './util/shipdata';
import { addShip, removeShip } from '../reducers/slices/ownedShipListSlice';
// import { setListState } from '../reducers/slices/listStateSlice';

// eslint-disable-next-line react/prop-types
const ShipDetails: React.FC<{ toggle: string }> = ({ toggle }) => {
  const dispatch = useDispatch();
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const listState = useSelector((state: RootState) => state.listState);

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
    console.log(listState);
  }, [ownedShips]);
  return (
    <>
      {!isShips ? (
        <div>Select ship or add new ship to docks</div>
      ) : (
        <div>
          <h1>
            {shipDetails.names.code} <span className={shipDetails.rarity}>{` ${shipDetails.stars?.stars}`}</span>
          </h1>
          <div id="passives">
            {shipDetails.skills?.map((skill: Skill) => {
              return (
                <div key={skill.names.en} className={skill.color}>
                  <div>{skill.names.en}</div>
                  <div>{skill.description}</div>
                </div>
              );
            })}
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
        </div>
      )}
    </>
  );
};

export default ShipDetails;
