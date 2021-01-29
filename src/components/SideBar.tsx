import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { RootState } from '../reducers/rootReducer';
import { setDetails } from '../reducers/slices/shipDetailsSlice';
import { setCurrentToggle } from '../reducers/slices/appStateSlice';
import { SearchAction, updateSearch } from '../reducers/slices/searchParametersSlice';
import CategoryOverlay from './CategoryOverlay';
import { AppContext } from '../App';

interface ShipListProps {
  children: React.ReactNode;
}

/**
 * Component for a sidebar.
 */
const SideBar: React.FC<ShipListProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { shipData } = useContext(AppContext);
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);
  const searchParameters = useSelector((state: RootState) => state.searchParameters);
  const [searchValue, setSearchValue] = useState(searchParameters.name);
  const [inputFocus, setInputFocus] = useState(false);

  // Set details of the selected ship when changed between 'all ships' and 'owned ships'.
  useEffect(() => {
    const { cToggle } = appState;
    if (appState.cState === 'INIT') return;
    dispatch(setDetails({ id: appState[cToggle].id, index: appState[cToggle].index }));
    dispatch(updateSearch(shipData, SearchAction.UpdateList, { name: '', cat: '', param: '', id: '', list: cToggle }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.cToggle]);

  return (
    <div className="ship-side-container">
      <div className="top-container">
        <CategoryOverlay themeColor={config.themeColor} />
        <div id="input-group" className={`${config.themeColor} ${inputFocus ? 'input-focus' : ''}`}>
          <div className={`searchIcon ${config.themeColor}`}>
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <input
            id="search-input"
            type="text"
            spellCheck="false"
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
                  id: '',
                })
              );
            }}
            onFocus={(e) => {
              e.target.select();
              setInputFocus(true);
            }}
            onBlur={() => setInputFocus(false)}
          />
          {searchValue.length > 0 ? (
            <button
              type="button"
              className={`clearIcon ${config.themeColor}`}
              onClick={() => {
                setSearchValue('');
                dispatch(
                  updateSearch(shipData, SearchAction.SetName, {
                    name: '',
                    cat: '',
                    param: '',
                    list: appState.cToggle,
                    id: '',
                  })
                );
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className={`radio-group ${config.themeColor}`}>
          <label
            className={`btn graphic ${config.themeColor}${appState.cToggle === 'ALL' ? ' selected' : ''}`}
            htmlFor="all"
          >
            All
            <input
              id="all"
              type="radio"
              value="all"
              checked={appState.cToggle === 'ALL'}
              onChange={() => dispatch(setCurrentToggle('ALL'))}
            />
          </label>

          <label
            className={`btn graphic ${config.themeColor}${appState.cToggle === 'OWNED' ? ' selected' : ''}`}
            htmlFor="owned"
          >
            Owned
            <input
              id="owned"
              type="radio"
              value="false"
              checked={appState.cToggle === 'OWNED'}
              onChange={() => dispatch(setCurrentToggle('OWNED'))}
            />
          </label>
        </div>
      </div>
      {children}
    </div>
  );
};

export default SideBar;

SideBar.propTypes = {
  children: PropTypes.node.isRequired,
};
