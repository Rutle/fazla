/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PassivesList from './PassivesList';
import { openWikiUrl, urlValidation } from '../util/appUtilities';
import { addShip, removeShip } from '../reducers/slices/ownedShipListSlice';
import { Ship } from '../util/shipdatatypes';
import RButton from './RButton/RButton';

interface ShipDetails {
  orient?: string;
  page?: string;
  ship?: Ship;
}

const ShipDetails: React.FC<ShipDetails> = ({ orient = 'vertical', page, ship }) => {
  const dispatch = useDispatch();
  const ownedShips = useSelector((state: RootState) => state.ownedShips);

  const isOwned = () => {
    if (ship) {
      return ownedShips.some((ele) => ele === ship.id);
    }
  };

  const addShipToOwned = () => {
    if (ship) {
      dispatch(addShip(ship.id));
    }
  };

  const removeFromOwned = () => {
    if (ship) {
      dispatch(removeShip(ship.id));
    }
  };

  const renderAddRemoveButton = () => {
    if (!isOwned()) {
      return (
        <RButton
          themeColor="dark"
          onClick={addShipToOwned}
          className="btn dark informative"
          extraStyle={{ width: '160px', height: '22px', padding: 0 }}
        >
          <b>Add to docks</b>
        </RButton>
      );
    } else {
      return (
        <RButton
          themeColor="dark"
          onClick={removeFromOwned}
          className="btn dark informative"
          extraStyle={{ width: '160px', height: '22px', padding: 0 }}
        >
          <b>Remove from docks</b>
        </RButton>
      );
    }
  };
  return ship ? (
    <>
      <div className="ship-title-bar">
        <div>
          <span className="ship-name">{ship.names.en}</span>
          <span className={ship.rarity}>{` ${ship.stars?.stars}`}</span>
        </div>
        <span className="end-buttons dark">
          {renderAddRemoveButton()}
          <RButton
            themeColor="dark"
            onClick={() => openWikiUrl(ship.wikiUrl !== undefined ? ship.wikiUrl : '')}
            className="btn dark informative"
            extraStyle={{ width: '160px', height: '22px', padding: 0 }}
            disabled={!urlValidation(ship.wikiUrl !== undefined ? ship.wikiUrl : '')}
          >
            <b>wiki</b>
          </RButton>
        </span>
      </div>
      <PassivesList orient={orient} /* page={page} */ ship={ship} />
    </>
  ) : (
    <div className="info-text">No ship selected or found</div>
  );
};

export default ShipDetails;
