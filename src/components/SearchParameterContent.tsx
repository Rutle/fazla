import React, { useCallback, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nationCategories, rarityCategories, hullTypesAbb } from '_/data/categories';
import { RootState } from '_/reducers/rootReducer';
import { updateSearch, SearchAction } from '_/reducers/slices/searchParametersSlice';
import { AppContext } from '_/App';
import DataStore from '_/utils/dataStore';
import RButton from './RButton/RButton';

/**
 * Grid displaying search parameter toggles.
 */
const SearchParameterContent: React.FC<{ themeColor: string }> = ({ themeColor }) => {
  const dispatch = useDispatch();
  const { shipData } = useContext(AppContext);
  const sParam = useSelector((state: RootState) => state.searchParameters);
  const appState = useSelector((state: RootState) => state.appState);

  const updSearch = useCallback(
    (
        data: DataStore,
        action: SearchAction,
        options: { name: string; cat: string; param: string; list: 'ALL' | 'OWNED'; id: string }
      ) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      () => {
        dispatch(updateSearch(data, action, options));
      },
    [dispatch]
  );

  return (
    <div id="search-categories" className={`${themeColor}`}>
      <div className="f-grid" style={{ marginBottom: '0px' }}>
        <div className="f-row wrap">
          <div className="grid-item toggle">
            <RButton
              className={`btn small ${sParam.nationality.All ? 'selected' : ''}`}
              themeColor={themeColor}
              onClick={updSearch(shipData, SearchAction.ToggleAll, {
                name: '',
                cat: 'nationality',
                param: '',
                list: appState.cToggle,
                id: '',
              })}
            >
              All
            </RButton>
          </div>
          {Object.keys(nationCategories).map((key) => {
            return (
              <div className="grid-item toggle" key={key}>
                <RButton
                  className={`btn small ${sParam.nationality[key] ? 'selected' : ''}`}
                  themeColor={themeColor}
                  onClick={updSearch(shipData, SearchAction.ToggleParameter, {
                    name: '',
                    cat: 'nationality',
                    param: key,
                    list: appState.cToggle,
                    id: '',
                  })}
                >
                  {nationCategories[key]}
                </RButton>
              </div>
            );
          })}
        </div>
        <div className="f-row wrap">
          <div className="grid-item toggle">
            <RButton
              className={`btn small ${sParam.hullType.All ? 'selected' : ''}`}
              themeColor={themeColor}
              onClick={updSearch(shipData, SearchAction.ToggleAll, {
                name: '',
                cat: 'hullType',
                param: '',
                list: appState.cToggle,
                id: '',
              })}
            >
              All
            </RButton>
          </div>
          {Object.keys(hullTypesAbb).map((key) => {
            return (
              <div className="grid-item toggle" key={key}>
                <RButton
                  className={`btn small ${sParam.hullType[key] ? 'selected' : ''}`}
                  themeColor={themeColor}
                  onClick={updSearch(shipData, SearchAction.ToggleParameter, {
                    name: '',
                    cat: 'hullType',
                    param: key,
                    list: appState.cToggle,
                    id: '',
                  })}
                >
                  {hullTypesAbb[key]}
                </RButton>
              </div>
            );
          })}
        </div>
        <div className="f-row wrap">
          <div className="grid-item toggle">
            <RButton
              className={`btn small ${sParam.rarity.All ? 'selected' : ''}`}
              themeColor={themeColor}
              onClick={updSearch(shipData, SearchAction.ToggleAll, {
                name: '',
                cat: 'rarity',
                param: '',
                list: appState.cToggle,
                id: '',
              })}
            >
              All
            </RButton>
          </div>
          {rarityCategories.map((value) => {
            return (
              <div className="grid-item toggle" key={value}>
                <RButton
                  className={`btn small ${sParam.rarity[value] ? 'selected' : ''}`}
                  themeColor={themeColor}
                  onClick={updSearch(shipData, SearchAction.ToggleParameter, {
                    name: '',
                    cat: 'rarity',
                    param: value,
                    list: appState.cToggle,
                    id: '',
                  })}
                >
                  {value}
                </RButton>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchParameterContent;
