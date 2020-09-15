/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import PassivesList from './PassivesList';
import { openWikiUrl, urlValidation } from '../util/appUtilities';
import { addShip } from '../reducers/slices/ownedShipListSlice';
import RButton from './RButton/RButton';
import DataStore from '../util/dataStore';
import { SearchAction, updateSearch } from '../reducers/slices/searchParametersSlice';
import { toggleSearchState } from '../reducers/slices/appStateSlice';

interface ShipDetails {
  shipData: DataStore;
}

const ShipDetails: React.FC<ShipDetails> = ({ shipData }) => {
  const dispatch = useDispatch();
  const ownedShips = useSelector((state: RootState) => state.ownedShips);
  const shipDetails = useSelector((state: RootState) => state.shipDetails);
  const config = useSelector((state: RootState) => state.config);
  const ship = shipData.getShipByIndex(shipDetails.index);

  const isOwned = () => {
    if (ship) {
      return ownedShips.some((ele) => ele === ship.id);
    }
  };

  const addShipToOwned = () => {
    if (ship) {
      dispatch(addShip(ship.id));
      dispatch(toggleSearchState('OWNED'));
    }
  };

  const removeFromOwned = () => {
    if (ship) {
      dispatch(updateSearch(shipData, SearchAction.RemoveShip, { list: 'OWNED', id: ship.id }));
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
      <div className="scroll">
        <div className={`f-grid ${config.themeColor}`}>
          <div className={`f-collapsible`}>
            <div className={`f-row`}>
              <div className={'passive f-header'}>Passives</div>
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
