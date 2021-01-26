/* eslint-disable react/prop-types */
import React, { useCallback, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PassivesList from './PassivesList';
import { openWikiUrl, urlValidation } from '../utils/appUtilities';
import { addShip, removeShip } from '../reducers/slices/ownedShipListSlice';
import RButton from './RButton/RButton';
import { AppContext } from '../App';

/**
 * Component for displaying the details of a ship.
 */
const ShipDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { addToast, shipData } = useContext(AppContext);
  const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const config = useSelector((state: RootState) => state.config);
  const ship = shipData.getShipByIndex(shipDetails.index);
  const isOwned = () => {
    if (ship) {
      return ownedShips.some((ele) => ele === ship.id);
    }
    return false;
  };

  const addShipToOwned = useCallback(() => {
    if (ship) {
      dispatch(addShip(ship.id));
      if (config.isToast) addToast('success', 'Docks', `${ship.names.code} was added to docks.`);
    }
  }, [dispatch, addToast, ship, config.isToast]);

  const removeFromOwned = useCallback(() => {
    if (ship) {
      dispatch(removeShip(shipData, ship.id));
      if (config.isToast) addToast('info', 'Docks', `${ship.names.code} removed from docks.`);
    }
  }, [ship, dispatch, shipData, config.isToast, addToast]);

  const renderAddRemoveButton = () => {
    if (!isOwned()) {
      return (
        <RButton
          themeColor={config.themeColor}
          onClick={addShipToOwned}
          className="btn normal"
          extraStyle={{ minWidth: '85px' }}
        >
          Add
        </RButton>
      );
    }
    return (
      <RButton
        themeColor={config.themeColor}
        onClick={removeFromOwned}
        className="btn normal"
        extraStyle={{ minWidth: '85px' }}
      >
        Remove
      </RButton>
    );
  };
  return ship ? (
    <>
      <div className="ship-title-bar">
        <div>
          <span className="ship-name">{ship.names.code}</span>
          <span className={ship.rarity}>{` ${ship.stars?.stars as string}`}</span>
        </div>
      </div>
      <div className="button-group" style={{ width: 'unset', marginBottom: '5px' }}>
        {renderAddRemoveButton()}
        <RButton
          themeColor={config.themeColor}
          onClick={() => openWikiUrl(ship.wikiUrl !== undefined ? ship.wikiUrl : '')}
          className="btn normal"
          disabled={!urlValidation(ship.wikiUrl !== undefined ? ship.wikiUrl : '')}
          extraStyle={{ minWidth: '85px' }}
        >
          wiki
        </RButton>
      </div>
      <div className="scroll">
        <div className={`f-grid ${config.themeColor}`}>
          <div className="f-collapsible">
            <div className="f-row">
              <div className="passive f-header">Passives</div>
            </div>
            <PassivesList skills={ship.skills} />
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="info-text">No ship selected or found</div>
  );
};

export default ShipDetails;
