import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { toggleParameter } from '../reducers/slices/searchParametersSlice';

interface CategoryProps {
  category: string;
  catKey: string;
  value: string;
}
// eslint-disable-next-line react/prop-types
const CategoryToggleButton: React.FC<CategoryProps> = ({ category, catKey, value }) => {
  const sParam = useSelector((state: RootState) => state.searchParameters);
  const dispatch = useDispatch();

  return (
    <div className="grid-item">
      <button
        className={`btn small dark ${sParam[category][catKey] ? 'active' : ''}`}
        onClick={() => {
          dispatch(toggleParameter({ cat: category, param: catKey }));
        }}
      >
        {value}
      </button>
    </div>
  );
};

export default CategoryToggleButton;
