import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
import { openWikiUrl } from '_/utils/ipcAPI';
import { urlValidation } from '_utils/appUtilities';
import { addShip, removeShip } from '_/reducers/slices/ownedShipListSlice';
import { AppContext } from '_/App';
import { SearchAction, updateSearch } from '_/reducers/slices/searchParametersSlice';
import { Ship } from '_/types/shipTypes';
import PassivesList from './PassivesList';
import RButton from './RButton/RButton';
import { DashIcon, PlusIcon } from './Icons';
import SlotList from './SlotList';
import StatList from './StatList';

/**
 * Component for displaying the details of a ship.
 */
const ShipDetails: React.FC<{ topButtonGroup?: JSX.Element }> = ({ topButtonGroup }) => {
  const dispatch = useDispatch();
  const { addToast, shipData, storage } = useContext(AppContext);
  const appState = useSelector((state: RootState) => state.appState);
  const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const config = useSelector((state: RootState) => state.config);
  const [ship, setShip] = useState<Ship | undefined>();
  const [isOwned, setIsOwned] = useState(false);

  const isShipOwned = (newShip?: Ship) => {
    if (newShip) {
      return ownedShips.some((ele) => ele === newShip.id);
    }
    return false;
  };

  useEffect(() => {
    if (!appState[appState.cToggle].isUpdated) {
      dispatch(
        updateSearch(shipData, SearchAction.UpdateList, {
          list: appState.cToggle,
        })
      );
    } else {
      const tempShip = shipData.getShipByIndex(appState[appState.cToggle].index);
      setShip(tempShip);
      setIsOwned(isShipOwned(tempShip));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.cToggle, dispatch, shipData]);

  useEffect(() => {
    const tempShip = shipData.getShipByIndex(appState[appState.cToggle].index);
    setShip(tempShip);
    setIsOwned(isShipOwned(tempShip));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.ALL, appState.OWNED, shipData]);

  const addShipToOwned = useCallback(() => {
    if (ship) {
      dispatch(addShip(ship.id, storage));
      if (config.isToast) addToast('success', 'Docks', `${ship.names.code} was added to docks.`);
      setIsOwned(true);
    }
  }, [ship, dispatch, storage, config.isToast, addToast]);

  const removeFromOwned = useCallback(() => {
    if (ship) {
      dispatch(removeShip(shipData, ship.id, storage));
      if (config.isToast) addToast('info', 'Docks', `${ship.names.code} removed from docks.`);
      setIsOwned(false);
    }
  }, [ship, dispatch, shipData, storage, config.isToast, addToast]);

  return ship ? (
    <>
      <div className={`ship-title-bar rounded ${config.themeColor}`}>
        <span className="ship-name">{ship.names.code}</span>
        <span className={ship.rarity}>{` ${'\u2605'.repeat(ship.stars)}`}</span>
      </div>
      <div className={`button-group start rounded ${config.themeColor}`} style={{ marginBottom: '5px' }}>
        {topButtonGroup || <></>}
        <RButton
          themeColor={config.themeColor}
          onClick={isOwned ? removeFromOwned : addShipToOwned}
          className="btn normal icon"
        >
          <div className="btn-icon">
            {isOwned ? <DashIcon themeColor={config.themeColor} /> : <PlusIcon themeColor={config.themeColor} />}
          </div>
          <span>Docks</span>
        </RButton>
        <RButton
          themeColor={config.themeColor}
          onClick={async () => {
            if (process.env.PLAT_ENV === 'electron') {
              await openWikiUrl(ship.wikiUrl !== undefined ? ship.wikiUrl : '');
            } else if (process.env.PLAT_ENV === 'web' && ship.wikiUrl !== undefined) {
              window.open(ship.wikiUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          className="btn normal"
          disabled={!urlValidation(ship.wikiUrl !== undefined ? ship.wikiUrl : '')}
        >
          wiki
        </RButton>
      </div>
      <div className="scroll">
        <div className={`f-grid rounded ${config.themeColor}`}>
          <div className={`f-row wrap gap ${config.themeColor}`}>
            <div className="f-column section" id="stat-section" style={!ship.retrofit ? { minWidth: '330px' } : {}}>
              <StatList stats={ship.stats} themeColor={config.themeColor} />
            </div>
            <div className="f-column section" id="slot-section" style={{ minWidth: '220px' }}>
              <SlotList slots={ship.slots} hasRetrofit={ship.retrofit} themeColor={config.themeColor} />
            </div>
          </div>
        </div>
        <div className={`f-grid rounded ${config.themeColor}`}>
          <div className="f-column section" id="passive-section">
            <div className={`f-row ${config.themeColor}`}>
              <div className="f-header">Passives</div>
            </div>
            <div className="f-body">
              <PassivesList skills={ship.skills} />
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div style={{ display: 'flex', height: '100%', justifyContent: 'center' }}>
      <div className={`message-container ${config.themeColor}`}>
        <span className="message">No ship selected or found.</span>
      </div>
    </div>
  );
};

export default ShipDetails;
