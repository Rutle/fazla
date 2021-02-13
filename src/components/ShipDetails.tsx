import React, { useCallback, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
import { openWikiUrl } from '_/utils/ipcAPI';
import { urlValidation } from '_utils/appUtilities';
import { addShip, removeShip } from '_/reducers/slices/ownedShipListSlice';
import { AppContext } from '_/App';
import PassivesList from './PassivesList';
import RButton from './RButton/RButton';

/**
 * Component for displaying the details of a ship.
 */
const ShipDetails: React.FC = () => {
  const dispatch = useDispatch();
  const { addToast, shipData, storage } = useContext(AppContext);
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
      dispatch(addShip(ship.id, storage));
      if (config.isToast) addToast('success', 'Docks', `${ship.names.code} was added to docks.`);
    }
  }, [ship, dispatch, storage, config.isToast, addToast]);

  const removeFromOwned = useCallback(() => {
    if (ship) {
      dispatch(removeShip(shipData, ship.id, storage));
      if (config.isToast) addToast('info', 'Docks', `${ship.names.code} removed from docks.`);
    }
  }, [ship, dispatch, shipData, storage, config.isToast, addToast]);

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
        <span className="ship-name">{ship.names.code}</span>
        <span className={ship.rarity}>{` ${ship.stars?.stars as string}`}</span>
      </div>
      <div className={`button-group ${config.themeColor}`} style={{ width: 'unset', marginBottom: '5px' }}>
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
    /*
    <div className="info-text">No ship selected or found</div>
    */
    <div
      className={`message-container ${config.themeColor}`}
      style={{
        alignSelf: 'center',
        width: '50%',
      }}
    >
      <span className="message" style={{ fontSize: '24px', justifyContent: 'center' }}>
        No ship selected or found
      </span>
    </div>
  );
};

export default ShipDetails;
