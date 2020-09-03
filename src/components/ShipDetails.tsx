/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PassivesList from './PassivesList';
import { openWikiUrl, urlValidation } from '../util/appUtilities';
import { addShip, removeShip } from '../reducers/slices/ownedShipListSlice';
import { Ship } from '../util/shipdatatypes';
import InfoButton from './InfoButton';

interface ShipDetails {
  orient?: string;
  page?: string;
  ship: Ship;
}

const ShipDetails: React.FC<ShipDetails> = ({ orient = 'vertical', page, ship }) => {
  const dispatch = useDispatch();
  const ownedShips = useSelector((state: RootState) => state.ownedShips);

  const isOwned = () => {
    return ownedShips.some((ele) => ele === ship.id);
  };

  const addShipToOwned = () => {
    dispatch(addShip(ship.id));
  };

  const removeFromOwned = () => {
    dispatch(removeShip(ship.id));
  };

  const renderAddRemoveButton = () => {
    if (!isOwned()) {
      return (
        <InfoButton
          buttonAction={addShipToOwned}
          classes={'btn dark informative'}
          text={'Add to docks'}
          width={'160px'}
        />
      );
    } else {
      return (
        <InfoButton
          buttonAction={removeFromOwned}
          classes={'btn dark informative'}
          text={'Remove from docks'}
          width={'160px'}
        />
      );
    }
  };

  return (
    <>
      <div className="ship-title-bar">
        <div>
          <span className="ship-name">{ship.names.en}</span>
          <span className={ship.rarity}>{` ${ship.stars?.stars}`}</span>
        </div>
        <span className="end-buttons dark">
          {renderAddRemoveButton()}
          <button
            className="btn dark informative"
            style={{ width: '160px', height: '22px', padding: 0 }}
            onClick={() => openWikiUrl(ship.wikiUrl !== undefined ? ship.wikiUrl : '')}
            disabled={!urlValidation(ship.wikiUrl !== undefined ? ship.wikiUrl : '')}
          >
            <b>wiki</b>
          </button>
        </span>
      </div>
      <PassivesList orient={orient} /* page={page} */ ship={ship} />
    </>
  );
};

export default ShipDetails;
