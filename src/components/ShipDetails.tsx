import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PassivesList from './PassivesList';
import { openUrl } from '../util/appUtilities';
import { addShip, removeShip } from '../reducers/slices/ownedShipListSlice';
import { Ship } from '../util/shipdatatypes';
import InfoButton from './InfoButton';

interface ShipDetails {
  orient?: string;
  page?: string;
}

// eslint-disable-next-line react/prop-types
const ShipDetails: React.FC<ShipDetails> = ({ orient = 'vertical', page }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appState);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const ownedShips = useSelector((state: RootState) => state.ownedShips);

  useEffect(() => {
    console.log('ship details: [', appState.cState, ']');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOwned = () => {
    return ownedShips.some((ele) => ele.id === shipDetails.id);
  };

  const addShipToOwned = () => {
    console.log(shipDetails.names.code);
    dispatch(
      addShip({
        name: shipDetails.names.code,
        id: shipDetails.id,
        class: shipDetails.class,
        hullType: shipDetails.hullType,
        nationality: shipDetails.nationality,
      }),
    );
  };

  const removeFromOwned = () => {
    dispatch(removeShip(shipDetails.id));
  };
  const openWikiUrl = () => {
    console.log(urlValidation());
    openUrl(shipDetails.wikiUrl as string);
  };

  const urlValidation = (): boolean => {
    if (shipDetails.wikiUrl === undefined) return false;
    const urlVal = 'https?://(www.)?azurlane.koumakan.jp.*';
    const flags = 'gi';
    const re = new RegExp(urlVal, flags);
    return re.test(shipDetails.wikiUrl as string);
  };
  const renderAddRemoveButton = () => {
    if (!isOwned()) {
      return (
        <InfoButton
          buttonAction={addShipToOwned}
          classes={'btn dark informative'}
          text={'Add to docks'}
          width={'110px'}
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
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <h1>
          {shipDetails.names.en} <span className={shipDetails.rarity}>{` ${shipDetails.stars?.stars}`}</span>
        </h1>
        <span style={{ display: 'flex', alignItems: 'center', paddingRight: '15px' }}>
          {renderAddRemoveButton()}
          <button
            className="btn dark informative"
            style={{ width: '50px', height: '25px' }}
            onClick={() => openWikiUrl()}
            disabled={!urlValidation()}
          >
            <b>wiki</b>
          </button>
        </span>
      </div>
      <PassivesList orient={orient} /* page={page} */ />
    </>
  );
};

export default ShipDetails;
