import React from 'react';
import { nationCategories, rarityCategories, hullTypesAbb } from '../data/categories';
import RButton from './RButton/RButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { updateSearch, SearchAction } from '../reducers/slices/searchParametersSlice';
import DataStore from '../util/dataStore';
import PropTypes from 'prop-types';

const SearchParameterContent: React.FC<{ shipData: DataStore; themeColor: string }> = ({ shipData, themeColor }) => {
  const dispatch = useDispatch();
  const sParam = useSelector((state: RootState) => state.searchParameters);
  const config = useSelector((state: RootState) => state.config);
  const appState = useSelector((state: RootState) => state.appState);

  return (
    <div className="popover-content dark">
      <div className="f-grid">
        <div className="f-row wrap">
          <div className="grid-item toggle">
            <RButton
              className={`btn small graphic ${sParam['nationality']['All'] ? 'selected' : ''}`}
              themeColor={themeColor}
              onClick={() =>
                dispatch(
                  updateSearch(shipData, SearchAction.ToggleAll, {
                    name: '',
                    cat: 'nationality',
                    param: '',
                    list: appState.cToggle,
                  }),
                )
              }
            >
              All
            </RButton>
          </div>
          {Object.keys(nationCategories).map((key) => {
            return (
              <div className="grid-item toggle" key={key}>
                <RButton
                  className={`btn small graphic ${sParam['nationality'][key] ? 'selected' : ''}`}
                  themeColor={themeColor}
                  onClick={() =>
                    dispatch(
                      updateSearch(shipData, SearchAction.ToggleParameter, {
                        name: '',
                        cat: 'nationality',
                        param: key,
                        list: appState.cToggle,
                      }),
                    )
                  }
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
              className={`btn small graphic ${sParam['hullType']['All'] ? 'selected' : ''}`}
              themeColor={themeColor}
              onClick={() =>
                dispatch(
                  updateSearch(shipData, SearchAction.ToggleAll, {
                    name: '',
                    cat: 'hullType',
                    param: '',
                    list: appState.cToggle,
                  }),
                )
              }
            >
              All
            </RButton>
          </div>
          {Object.keys(hullTypesAbb).map((key) => {
            return (
              <div className="grid-item toggle" key={key}>
                <RButton
                  className={`btn small graphic ${sParam['hullType'][key] ? 'selected' : ''}`}
                  themeColor={themeColor}
                  onClick={() =>
                    dispatch(
                      updateSearch(shipData, SearchAction.ToggleParameter, {
                        name: '',
                        cat: 'hullType',
                        param: key,
                        list: appState.cToggle,
                      }),
                    )
                  }
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
              className={`btn small graphic ${sParam['rarity']['All'] ? 'selected' : ''}`}
              themeColor={themeColor}
              onClick={() =>
                dispatch(
                  updateSearch(shipData, SearchAction.ToggleAll, {
                    name: '',
                    cat: 'rarity',
                    param: '',
                    list: appState.cToggle,
                  }),
                )
              }
            >
              All
            </RButton>
          </div>
          {rarityCategories.map((value) => {
            return (
              <div className="grid-item toggle" key={value}>
                <RButton
                  className={`btn small graphic ${sParam['rarity'][value] ? 'selected' : ''}`}
                  themeColor={themeColor}
                  onClick={() =>
                    dispatch(
                      updateSearch(shipData, SearchAction.ToggleParameter, {
                        name: '',
                        cat: 'nationality',
                        param: value,
                        list: appState.cToggle,
                      }),
                    )
                  }
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

SearchParameterContent.propTypes = {
  shipData: PropTypes.instanceOf(DataStore).isRequired,
};
