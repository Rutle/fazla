import React from 'react';
import { nationCategories, rarityCategories, hullTypesAbb } from '../data/categories';
import RButton from './RButton/RButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { toggleParameter, toggleAll } from '../reducers/slices/searchParametersSlice';

const SearchParameterContent: React.FC = () => {
  const sParam = useSelector((state: RootState) => state.searchParameters);
  const config = useSelector((state: RootState) => state.config);
  const dispatch = useDispatch();
  return (
    <div className="popover-content dark">
      <div className="f-grid">
        <div className="f-row wrap">
          <div className="grid-item toggle">
            <RButton
              className={`btn small graphic ${sParam['nationality']['All'] ? 'selected' : ''}`}
              themeColor={config.themeColor}
              onClick={() => dispatch(toggleAll('nationality'))}
            >
              All
            </RButton>
          </div>
          {Object.keys(nationCategories).map((key) => {
            return (
              <div className="grid-item toggle" key={key}>
                <RButton
                  className={`btn small graphic ${sParam['nationality'][key] ? 'selected' : ''}`}
                  themeColor={config.themeColor}
                  onClick={() => dispatch(toggleParameter({ cat: 'nationality', param: key }))}
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
              themeColor={config.themeColor}
              onClick={() => dispatch(toggleAll('hullType'))}
            >
              All
            </RButton>
          </div>
          {Object.keys(hullTypesAbb).map((key) => {
            return (
              <div className="grid-item toggle" key={key}>
                <RButton
                  className={`btn small graphic ${sParam['hullType'][key] ? 'selected' : ''}`}
                  themeColor={config.themeColor}
                  onClick={() => dispatch(toggleParameter({ cat: 'hullType', param: key }))}
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
              themeColor={config.themeColor}
              onClick={() => dispatch(toggleAll('rarity'))}
            >
              All
            </RButton>
          </div>
          {rarityCategories.map((value) => {
            return (
              <div className="grid-item toggle" key={value}>
                <RButton
                  className={`btn small graphic ${sParam['rarity'][value] ? 'selected' : ''}`}
                  themeColor={config.themeColor}
                  onClick={() => dispatch(toggleParameter({ cat: 'rarity', param: value }))}
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
