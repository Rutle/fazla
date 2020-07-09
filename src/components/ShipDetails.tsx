import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { Skill, Ship, ShipSimple } from './util/shipdata';
import { addShip, removeShip } from '../reducers/slices/ownedShipListSlice';

const ShipDetails: React.FC = () => {
  const dispatch = useDispatch();
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);

  useEffect(() => {
    // console.log('details', shipDetails);
  }, [shipDetails]);

  const addShipToOwned = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, ship: Ship) => {
    dispatch(addShip({ name: ship.names.code, id: ship.id, class: ship.class }));
  };

  const removeFromOwned = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    dispatch(removeShip(id));
  };

  return (
    <>
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
          <button
            onClick={(e) => addShipToOwned(e, shipDetails)}
            className={`btn ${config.themeColor} selected`}
            type="button"
            disabled
          >
            <b>&#x1F5F8; Already in docks</b>
          </button>
          <button
            onClick={(e) => removeFromOwned(e, shipDetails.id)}
            className={`btn ${config.themeColor}`}
            type="button"
          >
            <b>Remove from docks</b>
          </button>
        </div>
      </div>
    </>
  );
};

export default ShipDetails;
