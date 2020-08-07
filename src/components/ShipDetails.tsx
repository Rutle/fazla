/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
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

interface ShipInfo {
  name: string;
  id: string;
  class: string;
  hullType: string;
  nationality: string;
}

// eslint-disable-next-line react/prop-types
const ShipDetails: React.FC<ShipDetails> = ({ orient = 'vertical', page, ship }) => {
  const dispatch = useDispatch();
  const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);

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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <h1>
            {ship.names.en}
            <span className={ship.rarity}>{` ${ship.stars?.stars}`}</span>
          </h1>
        </div>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderTop: '2px solid var(--main-dark-border)',
          }}
        >
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
