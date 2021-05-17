import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '_/reducers/rootReducer';
import { openWikiUrl } from '_/utils/ipcAPI';
import { urlValidation } from '_utils/appUtilities';
import { addShip, removeShip } from '_/reducers/slices/ownedShipListSlice';
import { AppContext } from '_/App';
import { SearchAction, updateSearch } from '_/reducers/slices/searchParametersSlice';
import PassivesList from './PassivesList';
import RButton from './RButton/RButton';
import { Ship } from '../types/types';
import { DashIcon, PlusIcon } from './Icons';

/**
 * Component for displaying the details of a ship.
 */
const ShipDetails: React.FC<{ additionalTopButtons?: JSX.Element }> = ({ additionalTopButtons }) => {
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
          name: '',
          cat: '',
          param: '',
          id: '',
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
      <div className="ship-title-bar">
        <span className="ship-name">{ship.names.code}</span>
        <span className={ship.rarity}>{` ${ship.stars?.stars as string}`}</span>
      </div>
      <div className={`button-group ${config.themeColor}`} style={{ marginBottom: '5px' }}>
        {additionalTopButtons || <></>}
        <RButton
          themeColor={config.themeColor}
          onClick={isOwned ? removeFromOwned : addShipToOwned}
          className="btn normal icon"
          // extraStyle={{ minWidth: '85px' }}
        >
          {isOwned ? <DashIcon themeColor={config.themeColor} /> : <PlusIcon themeColor={config.themeColor} />}
          Docks
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
          // extraStyle={{ minWidth: '85px' }}
        >
          wiki
        </RButton>
      </div>
      <div className="scroll">
        <div className={`f-grid ${config.themeColor}`}>
          <div className="f-row">
            <div className="passive f-header">Passives</div>
          </div>
          <PassivesList skills={ship.skills} />
        </div>
      </div>
    </>
  ) : (
    <div style={{ display: 'flex', height: '100%', justifyContent: 'center' }}>
      <div
        className={`message-container ${config.themeColor}`}
        style={{
          alignSelf: 'center',
          width: '50%',
          minHeight: '40px',
        }}
      >
        <span className="message" style={{ fontSize: '24px', justifyContent: 'center' }}>
          No ship selected or found.
        </span>
      </div>
    </div>
  );
};

export default ShipDetails;
