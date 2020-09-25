/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { setDetails } from '../reducers/slices/shipDetailsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { setCurrentToggle } from '../reducers/slices/appStateSlice';
import { SearchAction, updateSearch } from '../reducers/slices/searchParametersSlice';
import CategoryOverlay from './CategoryOverlay';
import DataStore from '../util/dataStore';
import ShipList from './ShipList';

interface ShipListProps {
  shipData: DataStore;
}
const SideBar: React.FC<ShipListProps> = ({ shipData }) => {
  const dispatch = useDispatch();
  const shipSearchList = useSelector((state: RootState) => state.shipSearchList);
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);
  const ownedSearchList = useSelector((state: RootState) => state.ownedSearchList);
  const searchParameters = useSelector((state: RootState) => state.searchParameters);
  const [searchValue, setSearchValue] = useState(searchParameters.name);
  const [inputFocus, setInputFocus] = useState(false);

  // Set details of the selected ship when changed between 'all ships' and 'owned ships'.
  useEffect(() => {
    const { cToggle } = appState;
    if (appState.cState === 'INIT') return;
    dispatch(setDetails({ id: appState[cToggle].id, index: appState[cToggle].index }));
    dispatch(updateSearch(shipData, SearchAction.UpdateList, { list: cToggle }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.cToggle]);

  return (
    <div className="ship-side-container">
      <div className="top-container">
        <CategoryOverlay shipData={shipData} themeColor={config.themeColor} />
        <form>
          <div id="input-group">
            <div className={`searchIcon ${config.themeColor} ${inputFocus ? 'input-focus' : ''}`}>
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
              id="search-input"
              type="text"
              className={`${config.themeColor}`}
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchValue(e.target.value);
                dispatch(
                  updateSearch(shipData, SearchAction.SetName, {
                    name: e.target.value,
                    cat: '',
                    param: '',
                    list: appState.cToggle,
                  }),
                );
              }}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
            />
          </div>
        </form>
        <div className={`radio-group ${config.themeColor}`}>
          <input
            id="all"
            type="radio"
            value="all"
            checked={appState.cToggle === 'ALL'}
            onChange={() => dispatch(setCurrentToggle('ALL'))}
          />
          <label
            className={`btn graphic ${config.themeColor}${appState.cToggle === 'ALL' ? ' selected' : ''}`}
            htmlFor="all"
          >
            All
          </label>
          <input
            id="owned"
            type="radio"
            value="false"
            checked={appState.cToggle === 'OWNED'}
            onChange={() => dispatch(setCurrentToggle('OWNED'))}
          />
          <label
            className={`btn graphic ${config.themeColor}${appState.cToggle === 'OWNED' ? ' selected' : ''}`}
            htmlFor="owned"
          >
            Owned
          </label>
        </div>
      </div>
      <ShipList shipData={shipData} shipSearchList={shipSearchList} listName={'ALL'} />
      <ShipList shipData={shipData} shipSearchList={ownedSearchList} listName={'OWNED'} />
    </div>
  );
};

export default SideBar;
