import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import RToggle from './RToggle/RToggle';
import RButton from './RButton/RButton';

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

  const changeList = useCallback(
    (value: 'ALL' | 'OWNED') => {
      dispatch(setCurrentToggle(value));
    },
    [dispatch]
  );

  return (
    <div className="ship-side-container">
      <div className="top-container">
        <form role="search">
          <div id="input-group" className={`${config.themeColor} ${inputFocus ? 'input-focus' : ''}`}>
            <div className={`searchIcon ${config.themeColor}`}>
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
              id="search-input"
              aria-label="search"
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
              <RButton
                className="btn icon"
                themeColor={config.themeColor}
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
              </RButton>
            ) : (
              <></>
            )}
          </div>
        </form>
        <CategoryOverlay themeColor={config.themeColor} />
        <div className={`radio-group ${config.themeColor}`}>
          <RToggle
            id="all-toggle"
            value="ALL"
            className="btn normal"
            themeColor={config.themeColor}
            onChange={() => changeList('ALL')}
            selected={appState.cToggle === 'ALL'}
          >
            All
          </RToggle>
          <RToggle
            id="owned-toggle"
            value="OWNED"
            className="btn normal"
            themeColor={config.themeColor}
            onChange={() => changeList('OWNED')}
            selected={appState.cToggle === 'OWNED'}
          >
            Owned
          </RToggle>
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
