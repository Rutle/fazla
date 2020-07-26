import React from 'react';
import { nationCategories, rarityCategories, hullTypesAbb } from './data/categories';
import CategoryToggleButton from './CategoryToggleButton';

const SearchParameterContent: React.FC = () => {
  return (
    <div className="popover-content dark">
      <div className="f-grid">
        <div className="f-row wrap">
          {Object.keys(nationCategories).map((key) => {
            return (
              <CategoryToggleButton key={key} category={'nationality'} catKey={key} value={nationCategories[key]} />
            );
          })}
        </div>
        <div className="f-row wrap">
          {Object.keys(hullTypesAbb).map((key) => {
            return <CategoryToggleButton key={key} category={'hullType'} catKey={key} value={hullTypesAbb[key]} />;
          })}
        </div>
        <div className="f-row wrap">
          {rarityCategories.map((value) => {
            return <CategoryToggleButton key={value} category={'rarity'} catKey={value} value={value} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchParameterContent;
